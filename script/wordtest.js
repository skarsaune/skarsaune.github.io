var wordStyle = null;

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

function setupToggleButtons() {
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
    var controlButton = document.getElementById('controlButton');
    toggleFunction(controlButton, function() {
	$('.carousel').carousel('cycle');
    }, function() {
	$('.carousel').carousel('pause');
    });
    var shuffleButton = document.getElementById('shuffleButton');
    createStyleClassCarousel(shuffleButton, shuffleButton, [ 'off', 'on' ]);
    var soundButton = document.getElementById('soundButton');
    createStyleClassCarousel(soundButton, soundButton, [ 'off', 'on' ]);
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
    sizeWordsToWindow();
    sizeButtonsToWindow();
    setupToggleButtons();
});
// Resize words on window resize
jQuery(window).resize(function() {
    sizeWordsToWindow();
    sizeButtonsToWindow();
});
