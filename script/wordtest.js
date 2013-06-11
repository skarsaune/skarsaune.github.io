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
	

	// Within your document ready function,
	// Do an initial size of words
	$(document).ready(function(){
			    sizeWordsToWindow();
			    sizeButtonsToWindow();
  	});
	// Resize words on window resize
	jQuery(window).resize(function() {
	    sizeWordsToWindow();
	    sizeButtonsToWindow();
	});
