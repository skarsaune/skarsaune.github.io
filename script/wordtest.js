var wordStyle = null;
var maxLenght = 10;

function wordSizeFactor() {
    return Math.min(calculateHeight(), (calculateWidth() * 3) / maxLenght);
}

function requestFullscreenFunction() {
    if (document.body.webkitRequestFullScreen) {
	return document.body.webkitRequestFullScreen;
    }
    if (document.body.mozRequestFullScreen) {
	return document.body.mozRequestFullScreen;
    }

    return document.requestFullscreen;

}

function setupFullscreenCallback(handleFunction) {
    if (document.body.webkitRequestFullScreen) {
	document.onwebkitfullscreenchange = function() {
	    handleFunction(document.webkitCurrentFullScreenElement)
	};
    }
    if (document.body.mozRequestFullScreen) {
	document.onmozfullscreenchange = function() {
	    handleFunction(document.mozFullScreenElement)
	};
    }

    if (document.requestFullscreen) {
	document.onfullscreenchange = function() {
	    handleFunction(document.fullscreenElement)
	};
	;
    }

}

function cancelFullscreen() {
    if (document.webkitCancelFullScreen) {
	document.webkitCancelFullScreen();
    }
    if (document.mozCancelFullScreen) {
	document.webkitCancelFullScreen();
    }

    if(document.exitFullscreen) {
	document.exitFullscreen();
    }

}

function sizeWordsToWindow() {
    if (wordStyle == null) {
	wordStyle = findStyle("words", "div.itemBox");
    }

    var sizeFactor = wordSizeFactor();

    wordStyle.setProperty("font-size", parseInt(sizeFactor / 1.3) + "px",
	    "important");
    wordStyle.setProperty("line-height", calculateHeight() + "px", "important");
}

var buttonStyle = null;
function sizeButtonsToWindow() {
    var sizeFactor = wordSizeFactor();
    if (!buttonStyle) {
	buttonStyle = findStyle("words", "button.rowButton");
    }
    buttonStyle.setProperty("font-size", parseInt(sizeFactor / 8) + "px",
	    "important");
    buttonStyle.setProperty("height", parseInt(sizeFactor / 7) + "px",
	    "important");

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
    return Math.max(
	        $(document).height(),
	        $(window).height(),
	        /* For opera: */
	        document.documentElement.clientHeight
	    ) + screen.availHeight - screen.height;
}

function calculateWidth() {
    return Math.max(
	        $(document).width(),
	        $(window).width(),
	        /* For opera: */
	        document.documentElement.clientWidth
	    )  + screen.availWidth - screen.width;
}

function hideSettingsPage() {
    document.getElementById('settings').classList.add('hidden');
}
function showSettingsPage() {
    document.getElementById('settings').classList.remove('hidden');
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

function encodeWord(word) {
    var codeString = '';
    for ( var i = 0; i < word.length; i++) {
	if ("aeiouyæøå".indexOf(word[i]) != -1) {
	    codeString += '<span class="vowel">' + word[i] + '</span>';
	} else if (word[i] == '-') {
	    codeString += '<span class="syllableSeparator">-</span>'
	} else
	    codeString += word[i];
    }
    return codeString;
}

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

	    document.getElementById('endSlider').value = this.lastWord + 1;
	    document.getElementById('endValue').value = this.lastWord + 1;
	    document.getElementById('endSlider').setAttribute("max", max);
	    document.getElementById('endValue').setAttribute("max", max);
	    document.getElementById('endValue').setAttribute("step", step);

	    document.getElementById('speedSlider').value = this.interval;
	    document.getElementById('speedValue').value = this.interval;

	    document.getElementById('progressBar').setAttribute("max", max);

	    for ( var i = 0; i < this.carouselItems.length; i++) {
		this.carouselItems[i].innerHTML = encodeWord(this.words[this.currentIndex
			+ i]);
	    }

	}

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

	this.updateSettings = updateSettings;
	function updateSettings() {
	    this.firstWord = document.getElementById('startSlider').value - 1;
	    this.lastWord = document.getElementById('endSlider').value - 1;
	    this.interval = document.getElementById('speedSlider').value;
	    var inMillis = this.interval * 1000;
	    $('.carousel').carousel({ interval: inMillis} );
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

	this.slid = slid;
	function slid(event) {
	    var delta = 1;
	    if (event.direction == "right") {
		delta = -1;
	    }

	    wordSettings.currentIndex += delta;
	    document.getElementById('progressBar').value = wordSettings.currentIndex;
	    if (wordSettings.currentIndex == wordSettings.words.length) {
		controlButton.click();
	    } else {
		wordSettings.carouselIndex = (wordSettings.carouselIndex + delta)
			% wordSettings.carouselItems.length;
		wordSettings.carouselItems[wordSettings.carouselIndex].innerHTML = encodeWord(wordSettings
			.getWord(wordSettings.currentIndex));
	    }
	}
    }
    var wordSettings = new wordSettings();

    $('.carousel').on('slide', wordSettings.slid);

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
    wordSettings.toggleShuffle = function() {
	wordSettings.shuffle = !wordSettings.shuffle;
    };

    wordSettings.toggleSound = function() {
	wordSettings.sound = !wordSettings.sound;
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
    createStyleClassCarousel(fontButton, carouselContainer, [ 'handwriting',
	    'print', 'printCaps' ]);
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
    var fullscreenFunction = requestFullscreenFunction();
    if (fullscreenButton) {
	var state = false;
	
	setupFullscreenCallback(function(fullScreenElement) {
		if (fullScreenElement) {
		    fullscreenButton.classList.add('on');
		    state = true;
		}
		else {
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
	}
	else {
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
    
    synchronize(document.getElementById('speedSlider'), document.getElementById('speedValue'), function(value){});

    var saveSettingsButton = document.getElementById('saveSettings');
    saveSettingsButton.onclick = wordSettings.updateSettings;

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

// Within your document ready function,
// Do an initial size of words
$(document).ready(function() {
    setupToggleButtons();
    sizeWordsToWindow();
    sizeButtonsToWindow();
    $('.carousel').swipe( {
	    swipeLeft: function() {
	        $(this).carousel('next');
	    },
	    swipeRight: function() {
	        $(this).carousel('prev');
	    },
	    allowPageScroll: 'vertical'
	});

});
// Resize words on window resize
jQuery(window).resize(function() {
    sizeWordsToWindow();
    sizeButtonsToWindow();
});
