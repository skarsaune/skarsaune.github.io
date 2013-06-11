	var wordStyle=null;
	
	function sizeWordsToWindow() {
	    if(wordStyle==null) {
		wordStyle=findStyle("words", "div.itemBox");
	    }
	    wordStyle.setProperty("font-size", parseInt(calculateHeight() / 1.3) + "px", "important");
	}
	
	var buttonStyle=null;
	function sizeButtonsToWindow() {
	    var height=calculateHeight();
	    if(!buttonStyle) {
		buttonStyle=findStyle("words", "button.rowButton");
	    }
	    buttonStyle.setProperty("font-size", parseInt(height / 10) + "px", "important");
	    buttonStyle.setProperty("height", parseInt(height / 9) + "px", "important");
	    
	}
	
	function findStyle(styleSheet, selector) {
	    for(var i = 0; i< document.styleSheets.length; i++) {
		if(document.styleSheets[i].title === styleSheet){
		   var ruleList = document.styleSheets[i].rules || document.styleSheets[i].cssRules;  
		   for(var j=0;j<ruleList.length; j++){
		      if(ruleList[j] && ruleList[j].selectorText === selector) {
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
	
	function setupToggleButtons(){
	    var vowelButton=document.getElementById('vowelButton');
	    var vowelStyle=findStyle('words', 'span.vowel');
	    createStyleToggle(vowelButton, vowelStyle, 'color')
	    vowelButton.onclick();
	    vowelButton.onclick();
	}
	
	function createStyleToggle(button, style, attribute){
	    // if either button or style is not found abort
	    if(!button || !style) {
		return;
	    }
	    var state=true;
	    var value=style.getPropertyValue(attribute);
	    button.onclick= function(){
		if(state) {
		    style.removeProperty(attribute);
		    state = false;
		}
		else {
		    style.setProperty(attribute, value, "important");
		    state = true;
		}
	    }
	}
	

	// Within your document ready function,
	// Do an initial size of words
	$(document).ready(function(){
			    sizeWordsToWindow();
			    sizeButtonsToWindow();
			    setupToggleButtons();
  	});
	// Resize words on window resize
	jQuery(window).resize(function() {
	    sizeWordsToWindow();
	    sizeButtonsToWindow();
	});
