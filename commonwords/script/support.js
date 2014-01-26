/*
 * Licensed under GNU Public License version 3.
 * http://www.gnu.org/copyleft/gpl.html
 * Author: martin.skarsaune@kantega.no
 * 
 * Common state less functions supporting the functionality
 * 
 * */


/*
 * Hide and show settings page
 */
function hideSettingsPage() {
    document.getElementById('settings').classList.add('hidden');
}
function showSettingsPage() {
    document.getElementById('settings').classList.remove('hidden');
}

/*
 * Encode word, highlighting vowels
 */
function encodeWord(word) {
    if (!word) {
	return "";
    }
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


/*
 * Set up a button to toggle between different styles
 */
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

/*
 * Set up a button to toggle between two different states, with a callback function for each transition
 */
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
/*
 * Toggle a component between two different styles 
 */
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

/*
 * Synchronize the value of two input controls
 */
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

/*
 * Check if the browser has support for either mp3 or ogg vorbis audio files
 */
function hasAudioSupport() {
    var audioPlayer = document.getElementById('player');
    return !!(audioPlayer.canPlayType && (audioPlayer
	    .canPlayType('audio/mpeg;').replace(/no/, '') || audioPlayer
	    .canPlayType('audio/ogg;').replace(/no/, '')));
}


/*
 * Find browser specific function for going to fullscreen
 */
function requestFullscreenFunction() {
    if (document.body.webkitRequestFullScreen) {
	return document.body.webkitRequestFullScreen;
    }
    if (document.body.mozRequestFullScreen) {
	return document.body.mozRequestFullScreen;
    }

    return document.requestFullscreen;

}

/*
 * Set up browser specific callback on entering fullscreen
 */
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
    }

}

/*
 * Resize contents on leaving fullscreen
 */
function cancelFullscreen() {
    if (document.webkitCancelFullScreen) {
	document.webkitCancelFullScreen();
    }
    if (document.mozCancelFullScreen) {
	document.webkitCancelFullScreen();
    }

    if (document.exitFullscreen) {
	document.exitFullscreen();
    }
    sizeContents();

}
