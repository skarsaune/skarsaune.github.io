/*
 * Licensed under GNU Public License version 3.
 * http://www.gnu.org/copyleft/gpl.html
 * Author: martin.skarsaune@kantega.no
 * 
 * 
 * Functionality related to scaling contents according to available space.
 * Perhaps some of this could be replaced by a general purpose such as fit.js
 * 
 * */
var wordStyle = null;
var maxLenght = 10;

function wordSizeFactor() {
    return Math.min(calculateHeight(), (calculateWidth() * 3) / maxLenght);
}

/*
 * Size the content of the carousel div items according to window size
 */
function sizeWordsToWindow() {
    if (wordStyle == null) {
	wordStyle = findStyle("words", "div.itemBox");
    }
    if (wordStyle == null)// old ie versions, give up!
	return;

    var sizeFactor = wordSizeFactor();

    wordStyle.setProperty("font-size", parseInt(sizeFactor / 1.3) + "px",
	    "important");
    wordStyle.setProperty("line-height", calculateHeight() + "px", "important");
}

/*
 * 
 */
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

function sizeContents() {
    sizeWordsToWindow();
    sizeButtonsToWindow();
}

function calculateHeight() {
    return Math.max($(document).height(), $(window).height(),
    /* For opera: */
    document.documentElement.clientHeight) + screen.availHeight - screen.height;
}

function calculateWidth() {
    return Math.max($(document).width(), $(window).width(),
    /* For opera: */
    document.documentElement.clientWidth) + screen.availWidth - screen.width;
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

/*
 * Adjust the length of longest word if any of the words is longer than the
 * current
 */
function setMaxLenght(anArray) {
    for ( var i = 0; i < anArray.lenght; i++) {
	if (anArray[i].lenght > maxLenght) {
	    maxLenght = anArray[i].length;
	}
    }
}
