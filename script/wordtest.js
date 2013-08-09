var wordStyle = null;
var maxLenght = 10;

function sizeWordsToWindow() {
    if (wordStyle == null) {
	wordStyle = findStyle("words", "div.itemBox");
    }
    wordStyle.setProperty("font-size",
	    parseInt(calculateHeight() / 1.3) + "px", "important");
    wordStyle.setProperty("line-height", calculateHeight() + "px", "important");
}

var buttonStyle = null;
function sizeButtonsToWindow() {
    var height = calculateHeight();
    if (!buttonStyle) {
	buttonStyle = findStyle("words", "button.rowButton");
    }
    buttonStyle.setProperty("font-size", parseInt(height / 10) + "px",
	    "important");
    buttonStyle.setProperty("height", parseInt(height / 9) + "px", "important");

}

function findStyle(styleSheet, selector) {
    for ( var i = 0; i < document.styleSheets.length; i++) {
	if (document.styleSheets[i].title === styleSheet) {
	    var ruleList = document.styleSheets[i].rules
		    || document.styleSheets[i].cssRules;
	    for ( var j = 0; j < ruleList.length; j++) {
		if (ruleList[j] && ruleList[j].selectorText === selector) {
		    return ruleList[j].style;
		}
	    }

	}
    }
    return null;
}

function calculateHeight() {
    return document.height + screen.availHeight - screen.height;
}

function calculateWidth() {
    return document.width + screen.availWidth - screen.width;
}

function hideSettingsPage() {
    document.getElementById('settings').classList.add('hidden');
}

/*
 * Adjust the lenght of longest word if any of the words is longer than the
 * current
 */
function setMaxLenght(anArray) {
    for ( var i = 0; i < anArray.lenght; i++) {
	if (anArray[i].lenght > maxLenght) {
	    maxLenght = anArray[i].length;
	}
    }
}

function setupToggleButtons() {

    /*
     * Initialize non word settings with default values
     */
    function wordSettings() {
	this.interval = 3000;
	this.shuffle = false;
	this.language = "no_NO";
	this.sound = false;
	this.words = [];
	this.firstWord = 0;
	this.lastWord = 0;
	this.currentIndex = 0;

	function setWords(newWords) {
	    this.words = newWords;
	    this.firstWord = 1;
	    this.lastWord = this.words.length - 1;
	    this.currentIndex = this.firstWord;
	}

	function toggleShuffle() {
	    this.shuffle = !this.shuffle;
	}
	function toggleSound() {
	    this.sound = !this.sound;
	}
	function initSettings() {
	}
	function updateSettings() {
	    this.interval = document.getElementById('startSlider').value();
	    this.firstWord = document.getElementById('endSlider').value();
	    this.interval = document.getElementById('speedSlider').value() * 1000;
	    if (this.currentIndex < this.firstWord) {
		this.currentIndex = this.firstWord;
	    }
	    hideSettingsPage();
	}
	function getWord(index) {
	    return this.words[index];
	}
    }
    var wordSettings = new wordSettings();

    wordSettings.loadWords = function() {
	$.getScript('script/' + this.language + '/words.js').done(
		function(script, textstatus) {
		    var words = getAllWords();
		    setMaxLenght(words);
		    wordSettings.setWords(words);
		}).fail(function(jqxhr, settings, exception) {
	    setWords([])
	});

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
	createStyleClassCarousel(fontButton, carouselContainer, [
		'handwriting', 'print', 'printCaps' ]);
	var controlButton = document.getElementById('controlButton');
	toggleFunction(controlButton, function() {
	    $('.carousel').carousel('cycle');
	}, function() {
	    $('.carousel').carousel('pause');
	});
	var shuffleButton = document.getElementById('shuffleButton');
	toggleFunction(shuffleButton, wordSettings.toggleShuffle,
		wordSettings.toggleShuffle);
	var soundButton = document.getElementById('soundButton');
	toggleFunction(soundButton, wordSettings.toggleSound,
		wordSettings.toggleSound);
	var settingsButton = document.getElementById('settingsButton');
	var settingsPage = document.getElementById('settings');
	settingsButton.onclick = function() {
	    settingsPage.classList.remove('hidden');
	};
	var helpButton = document.getElementById('helpButton');
	var helpPage = document.getElementById('help');
	helpButton.onclick = function() {
	    helpPage.classList.remove('hidden');
	};
	var fullscreenButton = document.getElementById('fullscreenButton');
	toggleFunction(fullscreenButton, function() {
	    document.body.webkitRequestFullScreen();
	}, function() {
	    document.webkitCancelFullScreen();
	});

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
	    startWord.innerHTML = '(' + wordSettings.getWord(value) + ')';
	};
	synchronize(startSlider, startValue, onStartChange);

	var onEndChange = function(value) {
	    // start must be equal or less than
	    if (value < startSlider.value) {
		startSlider.value = value;
	    }
	    endWord.innerHTML = '(' + wordSettings.getWord(value) + ')';
	};
	synchronize(endSlider, endValue, onEndChange);

    }
}

function isVowel(character) {
    return false;
}

function synchronize(control1, control2, callback) {
    control1.onchange = function() {
	control2.value = control1.value;
	callback(control1.value);
    };
    control2.onchange = function() {
	control1.value = control2.value;
	callback(control2.value);
    };

}

function createStyleClassCarousel(button, container, styles) {
    if (!button || !container || styles.length === 0) {
	return;
    }
    var index = 0;
    button.onclick = function() {
	// remove the former style
	container.classList.remove(styles[index]);
	index = ++index % styles.length;
	// apply the style at next index
	container.classList.add(styles[index]);
    }
}

function toggleFunction(button, toggleOn, toggleOff) {

    if (!button) {
	return;
    }

    var state = false;
    button.onclick = function() {
	if (state) {
	    toggleOff();
	} else {
	    toggleOn();
	}
	button.classList.toggle('on');
	state = !state;
    };
}

function createStyleToggle(button, style, attribute) {
    // if either button or style is not found abort
    if (!button || !style) {
	return;
    }
    var state = true;
    var value = style.getPropertyValue(attribute);
    button.onclick = function() {
	if (state) {
	    style.removeProperty(attribute);
	    state = false;
	} else {
	    style.setProperty(attribute, value, "important");
	    state = true;
	}
    }
}

function createControlToggle(button, toggleOnAction, toggleOffAction) {
    createStyleClassCarousel(button, button, [ 'off', 'on' ]);
    //	    
    // var state=false;
    // button.onclick=function() {
    // if(state) {
    // button.classList.remove('on');
    // button.classList.add('off');
    // toggleOffAction();
    // }
    // else
    // {
    // button.classList.remove('off');
    // button.classList.add('on');
    // toggleOnAction();
    // }
    // }
}

// Within your document ready function,
// Do an initial size of words
$(document).ready(function() {
    setupToggleButtons();
    sizeWordsToWindow();
    sizeButtonsToWindow();

});
// Resize words on window resize
jQuery(window).resize(function() {
    sizeWordsToWindow();
    sizeButtonsToWindow();
});
