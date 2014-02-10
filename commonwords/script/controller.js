/*
 * Licensed under GNU Public License version 3.
 * http://www.gnu.org/copyleft/gpl.html
 * Author: martin.skarsaune@kantega.no
 * 
 * 
 * Main script controlling the state of the application
 * */




/*
 * Set up callbacks from buttonrow
 */
function setupToggleButtons() {
    var controlButton = document.getElementById('controlButton');

    /*
     * Initialize non word settings with default values
     */
    function wordSettings() {
	this.interval = 3;
	this.shuffle = false;
	this.language = "no_NO";
	this.sound = false;
	this.words = [];
	this.shuffledIndex = [];
	this.firstWord = 0;
	this.lastWord = 0;
	this.currentIndex = 0;
	this.carouselIndex = 0;
	this.carouselItems = document.getElementsByClassName('item');
	$('.carousel').carousel('pause');
	this.carousel = $('.carousel').data('bs.carousel');
	this.running = false;
	this.pause = pause;
	function pause() {
	    this.carousel.pause();
	    this.running = false;
	}

	this.start = start;
	function start() {
	    this.carousel.cycle();
	    this.running = true;
	}

	this.initSettings = initSettings;
	function initSettings() {
	    var max = this.words.length;
	    var step = max / 10;
	    if (step == 0) {
		step = 1;
	    }
	    document.getElementById('startSlider').value = this.firstWord + 1;
	    document.getElementById('startValue').value = this.firstWord + 1;
	    document.getElementById('startSlider').setAttribute("max", max);
	    document.getElementById('startValue').setAttribute("max", max);
	    document.getElementById('startValue').setAttribute("step", step);
	    document.getElementById('startSlider').setAttribute("step", step);

	    document.getElementById('endSlider').value = this.lastWord + 1;
	    document.getElementById('endValue').value = this.lastWord + 1;
	    document.getElementById('endSlider').setAttribute("max", max);
	    document.getElementById('endValue').setAttribute("max", max);
	    document.getElementById('endValue').setAttribute("step", step);
	    document.getElementById('endSlider').setAttribute("step", step);

	    document.getElementById('speedSlider').value = this.interval;
	    document.getElementById('speedValue').value = this.interval;

	    document.getElementById('progressBar').setAttribute("max", max - this.firstWord);

	    for ( var i = 0; i < this.carouselItems.length; i++) {
		this.carouselItems[i].innerHTML = encodeWord(this.words[this.currentIndex
			+ i]);
	    }

	}

	/*
	 * Update list of words after reading language word list
	 */
	this.setWords = setWords;
	function setWords(newWords) {
	    this.words = newWords;

	    this.firstWord = 0;
	    this.lastWord = this.words.length - 1;
	    this.currentIndex = this.firstWord;
	    this.shuffledIndex = new Array();
	    for ( var i = 0; i < this.words.length; i++) {
		this.shuffledIndex[i] = i;
	    }

	    for ( var i = 0; i <= (this.shuffledIndex.length / 2); i++) {
		var firstIndex = Math.floor(Math.random()
			* this.shuffledIndex.length);
		var secondIndex = Math.floor(Math.random()
			* this.shuffledIndex.length);
		var temp = this.shuffledIndex[firstIndex];
		this.shuffledIndex[firstIndex] = this.shuffledIndex[secondIndex];
		this.shuffledIndex[secondIndex] = temp;
	    }

	    this.initSettings();
	}

	/*
	 * Play sound of word by setting source of audio element
	 */
	this.playWordSound = playWordSound;
	function playWordSound() {
	    var audio = document.getElementById('player');
	    var word = this.getWord(this.currentIndex);
	    document.getElementById("mp3_src").setAttribute("src",
		    "media/" + this.language + "/" + word + ".mp3")
	    document.getElementById("ogg_src").setAttribute("src",
		    "media/" + this.language + "/" + word + ".ogg")
	    /** ************* */
	    audio.pause();
	    audio.load();
	    audio.play();
	    /** ************* */
	}

	/*
	 * Apply settings from settings page
	 */
	this.updateSettings = updateSettings;
	function updateSettings() {
	    this.firstWord = document.getElementById('startSlider').value - 1;
	    this.lastWord = document.getElementById('endSlider').value - 1;
	    this.interval = document.getElementById('speedSlider').value;
	    document.getElementById('progressBar').max = this.lastWord - this.firstWord;
	    var inMillis = this.interval * 1000;
	    this.carousel.options.interval = inMillis;
	    this.carousel.options.pause = "no"; //prevent carousel from stopping on mouse enter
	    if (this.currentIndex < this.firstWord) {
		this.currentIndex = this.firstWord;
	    }
	    hideSettingsPage();
	}
	this.getWord = getWord;
	function getWord(index) {
	    if (this.shuffle)
		return this.words[this.shuffledIndex[index]];
	    else
		return this.words[index];
	}

	/*
	 * Respond to carousel slide, update progress bar. Reset if the end has been reached
	 */
	this.slide = slide;
	function slide(event) {


	    this.currentIndex ++;

	    
	    if (this.currentIndex == (this.lastWord)) {
		this.currentIndex = this.firstWord;
		
		if(this.running) {
		    //cannot stop carousel within event loop, do so in separate timeout
		    setTimeout(function(){controlButton.click();}
		  , 0);
		   
		    
		}
	    } else {
		this.carouselIndex = this.currentIndex
			% this.carouselItems.length;
		this.carouselItems[this.carouselIndex].innerHTML = encodeWord(this
			.getWord(this.currentIndex));
	    }
	    document.getElementById('progressBar').value = this.currentIndex - this.firstWord;
	}
	this.slid = slid;
	function slid() {
	    if (this.sound) {
		this.playWordSound();
	    }
	}
	this.toggleShuffle = toggleShuffle;
	function toggleShuffle() {
		this.shuffle = !this.shuffle;
	}
	this.toggleSound = toggleSound;    
	function toggleSound() {
		this.sound = !this.sound;
	}
    }
    var wordSettings = new wordSettings();

    $('.carousel').on('slide.bs.carousel', function(event) {
	wordSettings.slide(event);
    });
    $('.carousel').on('slid.bs.carousel', function() {
	wordSettings.slid();
    });

    wordSettings.loadWords = function() {
	$.getScript('script/' + wordSettings.language + '/words.js').done(
		function(script, textstatus) {
		    var words = getAllWords();
		    setMaxLenght(words);
		    wordSettings.setWords(words);
		}).fail(function(jqxhr, settings, exception) {
	    wordSettings.setWords([]);
	});
    };

    wordSettings.loadWords();

    var vowelButton = document.getElementById('vowelButton');
    var vowelStyle = findStyle('words', 'span.vowel');
    createStyleToggle(vowelButton, vowelStyle, 'color')
    var syllableButton = document.getElementById('syllableButton');
    var syllableSeparator = findStyle('words', 'span.syllableSeparator');
    createStyleToggle(syllableButton, syllableSeparator, 'display');
    // simulate one click in order to reinstate separator
    syllableButton.onclick();
    var fontButton = document.getElementById('fontButton');
    var carouselContainer = document.getElementById('myCarousel');
    createStyleClassCarousel(fontButton, carouselContainer, ['print', 'handwriting',
	     'printCaps' ]);
    toggleFunction(controlButton, function() {
	wordSettings.start();
    }, function() {
	wordSettings.pause();
    });
    var shuffleButton = document.getElementById('shuffleButton');
    toggleFunction(shuffleButton, function(){wordSettings.toggleShuffle()},
	    function(){wordSettings.toggleShuffle()});
    var soundButton = document.getElementById('soundButton');
    if (hasAudioSupport()) {
	toggleFunction(soundButton, function() {
		wordSettings.toggleSound();
	    },
	    function() {
		wordSettings.toggleSound();
	    });
    } else {
	soundButton.classList.add('hidden');
    }

    var settingsButton = document.getElementById('settingsButton');
    var settingsPage = document.getElementById('settings');
    settingsButton.onclick = function() {
	if(wordSettings.running){
	    controlButton.click();
	}
	showSettingsPage();
    };
    var helpButton = document.getElementById('helpButton');
    var helpPage = document.getElementById('help');
    helpButton.onclick = function() {
	if(wordSettings.running){
	    controlButton.click();
	}
	helpPage.classList.remove('hidden');
    };
    var fullscreenButton = document.getElementById('fullscreenButton');
//    var fullscreenSpan = document.getElementById('fullscreenSvg');
//    fit(fullscreenButton, fullscreenSpan, {cover: true});
    var fullscreenFunction = requestFullscreenFunction();
    if (fullscreenButton) {
	var state = false;

	setupFullscreenCallback(function(fullScreenElement) {
	    if (fullScreenElement) {
		fullscreenButton.classList.add('on');
		state = true;
	    } else {
		fullscreenButton.classList.remove('on');
		state = false;
	    }

	});
	if (fullscreenFunction) {
	    fullscreenButton.onclick = function() {

		if (!state) {
		    fullscreenFunction.apply(document.body);
		} else {
		    cancelFullscreen();
		}

	    }
	} else {
	    fullscreenButton.classList.add('hidden');
	}

    }

    // Handle settings page
    var startSlider = document.getElementById('startSlider');
    var startValue = document.getElementById('startValue');
    var startWord = document.getElementById('startWord')
    var endSlider = document.getElementById('endSlider');
    var endValue = document.getElementById('endValue');
    var endWord = document.getElementById('endWord')

    var onStartChange = function(value) {
	// end must be equal or greater than
	if (value > endSlider.value) {
	    endSlider.value = value;
	}
	startWord.innerHTML = '(' + wordSettings.getWord(value - 1) + ')';
    };
    synchronize(startSlider, startValue, onStartChange);

    var onEndChange = function(value) {
	// start must be equal or less than
	if (value < startSlider.value) {
	    startSlider.value = value;
	}
	endWord.innerHTML = '(' + wordSettings.getWord(value - 1) + ')';
    };
    synchronize(endSlider, endValue, onEndChange);

    synchronize(document.getElementById('speedSlider'), document
	    .getElementById('speedValue'), function(value) {
    });

    var saveSettingsButton = document.getElementById('saveSettings');
    saveSettingsButton.onclick = function() {
	wordSettings.updateSettings();
    };

}

// Within your document ready function,
// Do an initial size of words
$(document).ready(function() {
    setupToggleButtons();
    sizeContents();
    $('.carousel').swipe({
	swipeLeft : function() {
	    $(this).carousel('next');
	},
	allowPageScroll : 'vertical'
    });

});
// Resize words on window resize
jQuery(window).resize(function() {
    sizeContents();
});
