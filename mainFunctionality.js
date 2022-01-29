// Tämä tiedosto sisältää yleiseen toiminnallisuuteen
// liittyviä luokkia ja funktioita (pl. loaderFunctions.js).

//-----------------------------------------------------------------------------//
//---							CONSTRUCTED GLOBALS							---//
//-----------------------------------------------------------------------------//

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

//-----------------------------------------------------------------------------//
//---								CLASSES									---//
//-----------------------------------------------------------------------------//

class ArticleContent extends HTMLElement {
	render() {
		this.classList.add('article-content');
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define('article-content', ArticleContent);

class CopyButton extends HTMLElement {
	render() {
		this.classList.add('copy-button');
		this.setAttribute('title', 'Kopioi');
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define('copy-button', CopyButton);

class FancyList extends HTMLElement {
	render() {
		this.setAttribute('listItems', 0);
		this.setAttribute('maxwidth', 0);
		
		document.onreadystatechange = function() {
			if (document.readyState === 'interactive') {
				let maxWidth = 0, elementWidth;
				let counterBoxes = this.getElementsByClassName('counterBox');
				
				for (const elem of counterBoxes) {
					elementWidth = elem.getBoundingClientRect().width;
					if (elementWidth > maxWidth) { maxWidth = elementWidth; }
				}
				
				for (const elem of counterBoxes) {
					elem.style.width = maxWidth + 'px';
			}
			}
		}
		
		/*
		document.addEventListener('DOMContentLoaded', e => {				//WebKit can't access this??

			let maxWidth = 0, elementWidth;
			let counterBoxes = this.getElementsByClassName('counterBox'); 	//Safari might have caching problems here
			
			for (const elem of counterBoxes) {
				elementWidth = elem.getBoundingClientRect().width;
				if (elementWidth > maxWidth) { maxWidth = elementWidth; }
			}
			
			for (const elem of counterBoxes) {
				elem.style.width = maxWidth + 'px';
			}
		});
		*/
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define('f-list', FancyList);

// Supported list types:
//	- default: numerical
//	- 'a' for small alphabetical
//	- 'A' for big alphabetical
//	- 'i' for small roman
//	- 'I' for big roman
class FancyListElement extends HTMLElement {
	render() {
		let listItemAmount = Number(this.parentElement.getAttribute('listItems'));
		this.parentElement.setAttribute('listItems', listItemAmount + 1);
		
		let overflow = Math.floor(listItemAmount / alphabet.length);
		let itemType = this.parentElement.getAttribute('item-type');
		let itemName, itemDecorations =['', '.'];
		if (itemType != null) {
			
			itemName = /\w/g.exec(itemType)[0];
			itemDecorations = itemType.split(itemName);
			itemDecorations = [itemDecorations[0], itemDecorations[itemDecorations.length - 1]];
			
			itemDecorations.forEach((e, i) => {
				
				if (itemDecorations[i].length > 0) {
					itemDecorations[i] = itemDecorations[i].split('')[0];
				}
				
			});
		}
		
		let itemText = itemDecorations[0];
		
		switch (itemName) {
			case 'a':
				listItemAmount -= overflow * alphabet.length;
			
				if (overflow <= 0) { itemText += alphabet[listItemAmount]; }
				else {
					itemText += alphabet[overflow - 1] + alphabet[listItemAmount];
				}
			break;
			case 'A':
				listItemAmount -= overflow * alphabet.length;
			
				if (overflow <= 0) { itemText += alphabet[listItemAmount]; }
				else {
					itemText += alphabet[overflow - 1] + alphabet[listItemAmount];
				}
				
				itemText = itemText.toUpperCase();
			break;
			case 'i':
				listItemAmount++;
			
				itemText += toRoman(listItemAmount).toLowerCase();
			break;
			case 'I':
				listItemAmount++;
			
				itemText += toRoman(listItemAmount);
			break;
			default:
				listItemAmount++;
			
				itemText += listItemAmount;
		}
		
		itemText += itemDecorations[1];
		
		let counterBox = document.createElement('span');
		counterBox.classList.add('counterBox');
		counterBox.innerHTML += itemText;
		
		this.prepend(counterBox);
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define('f-li', FancyListElement);

class ImportantTerm extends HTMLElement {
	render() {
		this.classList.add('imp-term');
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define('imp-term', ImportantTerm);

class SolutionButton extends HTMLButtonElement {
	
	constructor(method, ID) {
		super();
		this.method = method;
		this.id = ID;
	}
	
	render() {
		this.classList.add(`solution-${this.method}-button}`);
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define('solution-button', SolutionButton, {extends: 'button'});

class SpecialBox extends HTMLElement {
	render() {
		
		let boxType = this.getAttribute('box-type');
		
		this.classList.add(boxType);
		
		switch (boxType) {
			case 'solution':
				let buttonBox = document.createElement('div');
				buttonBox.classList.add('solution-button-box');
				
				this.prepend(buttonBox);
			break;
			case 'solution-byhand':
				solutionSettings(
					this,
					'byhand',
					'Näytä ratkaisu',
					boxType
				)
			break;
			case 'solution-bymatlab':
				solutionSettings(
					this,
					'bymatlab',
					'Näytä Matlab-ratkaisu',
					boxType
				)
			break;
			case 'theorem':
				if ( this.getAttribute('theorem-number') ) {
					let numberContainer = document.createElement('span');
					numberContainer.textContent = this.getAttribute('theorem-number');
					numberContainer.style.fontWeight = 'bold';
					
					this.insertAdjacentElement('afterbegin', numberContainer);
				}
			break;
			default:
		}
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define('special-box', SpecialBox);

//-----------------------------------------------------------------------------//
//---								FUNCTIONS 								---//
//-----------------------------------------------------------------------------//

function checkPseudoElements(o, ba) {
	let pseudoElements = [
		'::after',
		'::before',
		'::first-letter',
		'::first-line',
		'::marker',
		'::selection'
	];
	
	if (ba) { pseudoElements = ['::before', '::after']; }
	
	let hasThese = [];
	
	pseudoElements.forEach(e => {
		let cont = window.getComputedStyle(o, e).getPropertyValue('content');
		
		if (cont != 'none' && cont!= 'normal') { hasThese.push(e); }
	});
	
	return hasThese;
}

var writtenCode = '';
var iterationNumber = 0;
var extraTabs = 0;

//This function is recursive!
function codeExtractor(container, ba) {
	
	let thisItarationNumber = iterationNumber;
	
	let pseudoElements = checkPseudoElements(container, ba);
	let childNodeArray = container.childNodes;
	
	if (iterationNumber == 0) {
		writtenCode = '';
		
		let textNodeIndex;
		
		for (i = 0; i <= childNodeArray.length; i++) {
			if (childNodeArray[i].nodeType == Node.TEXT_NODE) {
				textNodeIndex =  i;
				break;
			}
		}
		
		extraTabs = ((childNodeArray[textNodeIndex].data || '').match(/\t/g) || []).length;
	}
	
	let regExpString = /^\n?/gm;
	let regExpString2 = /\t*(?=\s)$/gm;
	
	pseudoElements.forEach(e => {
		if (/before/g.test(e)) {
		writtenCode += getPseudoText(container, e);
		}
	})
	
	//---The recursive part start
	
	childNodeArray.forEach(e => {
		if
		(
			e.classList === undefined
			||
			!(
				(e.classList).contains('copy-button')
				||
				(e.classList).contains('copy-button-message')
			)
		)
		{
			if (!(e instanceof HTMLElement)) {
				
				let textData = e.data;
				
				if (writtenCode.charAt(writtenCode.length - 1) == '%') {
					textData = ' ' + textData.trimStart();
				}
				
				writtenCode += textData;
			}
			else {
				iterationNumber++;
				codeExtractor(e, ba) 										//<-- Recursion
			}
		}
	});
	
	//---The recursive part end
	
	pseudoElements.forEach(e => {
		if (/after/g.test(e)) {
		writtenCode += getPseudoText(container, e);
		}
	})
	
	writtenCode = writtenCode.replace(regExpString, '');
	writtenCode = writtenCode.replace(regExpString2, '');
	
	let returnedWrittenCode = writtenCode;
	
	// Return global variables to initial state.
	if (thisItarationNumber == 0) {
		writtenCode = '';
		iterationNumber = 0;
	}
	
	return [returnedWrittenCode, extraTabs];
}

function copyCode(container, ba) {
	
	let codeData = codeExtractor(container, ba);
	
	let writtenCode = codeData[0];
	let extraTabs = codeData[1];
	let regExpString = new RegExp(`^(?<!\\t)\\t\{${extraTabs}\}`, 'gm');
	
	writtenCode = writtenCode.replace(regExpString, '');
	
	navigator.clipboard.writeText(writtenCode);
}

function displayBox(e) {
	let solutionBox = document.getElementById(e.target.id + '-solution');
	let solutionBoxClass = solutionBox.getAttribute('class');
	let buttonText = e.target.textContent;

	if (/-hidden/.test(solutionBoxClass)) {
		solutionBox.setAttribute('class', solutionBoxClass.replace('-hidden', ''));
		e.target.textContent = buttonText.replace('Näytä', 'Piilota');
		
	} else {
		solutionBox.setAttribute('class', solutionBoxClass + '-hidden');
		e.target.textContent = buttonText.replace('Piilota', 'Näytä');
	}
}

function toRoman(n, caps) {
	
	let romanNumbers = {
		M: 1000,
		CM: 900,
		D: 500,
		CD: 400,
		C: 100,
		XC: 90,
		L: 50,
		XL: 40,
		X: 10,
		IX: 9,
		V: 5,
		IV: 4,
		I: 1
	};
	let roman = '';
	
	for (var i of Object.keys(romanNumbers)) {
		var q = Math.floor(n / romanNumbers[i]);
		n -= q * romanNumbers[i];
		roman += i.repeat(q);
	}
	
	if (caps != undefined) {
		if (/[^A-Z]/g.test(caps)) {
			roman = roman.toLowerCase();
		}
	}
	
	return roman;
}

function getPseudoText(o, position) {
	
	let pseudoText = window
		.getComputedStyle(o, position)
		.getPropertyValue('content')
		.replace(/^\"|\"$/g, '');
		
	return pseudoText;
}

function randomID() {
	let id = 0;
	
	while (id == 0) {
		id = Math.random() * Date.now();
	}
	
	id = 'uef-random-id-' + Math.floor(id);
	
	return id;
}
	
function solutionSettings(node, method, buttonText, boxType) {
	let solutionButtonBox = node
			.parentElement
			.getElementsByClassName('solution-button-box')[0];
	let solutionButton = new SolutionButton(method, randomID());
	solutionButton.classList.add(`solution-${method}-button`);
	solutionButton.textContent = buttonText;
	solutionButton.addEventListener( 'click', e => {
		displayBox(e);
	});
	
	solutionButtonBox.appendChild(solutionButton);
	
	node.id = solutionButton.id + '-solution';
	node.classList.replace(boxType, boxType + '-hidden');
}
