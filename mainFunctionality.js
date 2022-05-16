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

class ExplainText extends HTMLElement {
	render() {
			let d = new Date();
			console.log(d.getTime());
			this.classList.add('uef-explainText');
			this.classList.toggle('hidden');
			this.setAttribute('id', randomID());
			
			let title = this.getAttribute('title');
			let titleBox = document.createElement('div');
			titleBox.innerHTML += title;
			titleBox.classList.add('uef-explainTitle');
			titleBox.setAttribute('id', this.id + '-titleBox');
			
			titleBox.addEventListener('click', e => {
				this.classList.toggle('hidden');
				titleBox.classList.toggle('uef-explainTitleWithoutBottom');
			});
			
		if (!document.getElementById(this.id + '-titleBox')) {
			this.parentNode.insertBefore(titleBox, this);
		}
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define('explain-text', ExplainText);

class FancyList extends HTMLElement {
	render() {
		this.setAttribute('listItems', 0);
		this.setAttribute('id', randomID());
		let itemCycle = this.getAttribute('item-cycle');
		
		if (this.parentNode.nodeName == 'F-LIST') {
			if (!this.parentNode.getAttribute('nesting')) {
				this.parentNode.setAttribute('nesting', 0);
			}
			
			if (this.parentNode.getAttribute('item-cycle')) {
				this.setAttribute('item-cycle', this.parentNode.getAttribute('item-cycle'));
			}
			
			this.setAttribute('nesting', Number(this.parentNode.getAttribute('nesting')) + 1);
			this.setAttribute('cyclic', true);
			this.style.marginTop = '0px';
			this.style.marginBottom = '0px';
			this.style.marginLeft = 40 * Number(this.getAttribute('nesting')) + 'px';
			
				
			if ((this.parentNode.getAttribute('item-cycle') || itemCycle)
				&& !this.getAttribute('item-type'))
			{
				if (itemCycle) {
					this.setAttribute('item-cycle', itemCycle);
					itemCycle = itemCycle.split(' ');
				} else {
					this.setAttribute('item-cycle', this.parentNode.getAttribute('item-cycle'));
					itemCycle = this.parentNode.getAttribute('item-cycle').split(' ');
				}
			} else if (this.getAttribute('item-type')) {
				itemCycle = null;
			} else {
				// Default item-cycle.
				itemCycle = ['1.', 'a.', 'i.'];
			}
		}
		
		if (itemCycle != null) {
			this.setAttribute('cyclic', true);
			this.setAttribute('item-type', itemCycle[Number(this.getAttribute('nesting')) % (itemCycle.length)]);
		}
		
		window.addEventListener('load', e => {

			let maxWidth = 30, elementWidth;		//There's a CSS margin-right: 10px in mainStyle.css
			let minHeight = 27, elementHeight;
			let listItems = this.querySelectorAll(`f-li[parent-id = '${this.id}']`);
			
			listItems.forEach(e => {
				let listWrapper = document.createElement('div');
				listWrapper.classList.add('list-wrapper');
				listWrapper.innerHTML += e.innerHTML;
				e.innerHTML = '';
				e.append(listWrapper);
			});
			
			listItems.forEach(e => {
				let counterBox = document.createElement('span');
				counterBox.classList.add('counterBox');
				counterBox.innerHTML += e.getAttribute('index');
				e.prepend(counterBox);
			});
			
			let counterBoxes = this.getElementsByClassName('counterBox'); 	//Safari might have caching problems here
			
			for (const elem of counterBoxes) {
				elementWidth = elem.getBoundingClientRect().width;
				elementHeight = elem.getBoundingClientRect().height;
				if (elementWidth > maxWidth) { maxWidth = elementWidth; }
				if (elementHeight > minHeight) { minHeight = elementHeight; }
			}
			
			for (const elem of counterBoxes) {
				elem.style.minWidth = maxWidth + 'px';
				elem.style.height = minHeight + 'px';
				elem.style.lineHeight = minHeight + 'px';
			}
			
			let listWrappers = this.getElementsByClassName('list-wrapper');
			
			for (const elem of listWrappers) {
				elem.style.lineHeight = minHeight + 'px';
			}
		});
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
		this.setAttribute('parent-id', this.parentNode.id);
		let listItemAmount = Number(this.parentElement.getAttribute('listItems'));
		this.parentElement.setAttribute('listItems', listItemAmount + 1);
		
		let overflow = Math.floor(listItemAmount / alphabet.length);
		let itemType = this.parentElement.getAttribute('item-type');
		let itemName, itemDecorations = ['', '.'];
		if (itemType != null) {
			
			if ((this.parentNode.getAttribute('cyclic') === 'true') && !(/\w/g.exec(itemType))) {
				// This happens with cyclic lists.
				itemName = itemType;
				itemDecorations = ['', ''];
			} else {
				itemName = /\w/g.exec(itemType)[0];
			
				itemDecorations = itemType.split(itemName);
				itemDecorations = [itemDecorations[0], itemDecorations[itemDecorations.length - 1]];
				
				itemDecorations.forEach((e, i) => {
					
					if (itemDecorations[i].length > 0) {
						itemDecorations[i] = itemDecorations[i].split('')[0];
					}
					
				});
			}
		}
		
		// Freely defined list item.
		// User is responsible.
		if (this.parentElement.getAttribute('item-name') 
				&& this.parentElement.getAttribute('item-decor')) {
			itemName = this.parentElement.getAttribute('item-name');
			itemDecorations = this.parentElement.getAttribute('item-decor').split(';');
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
			case itemType:
				// For cyclic lists.
				listItemAmount++;
				
				itemText += itemName;
			break;
			case '1':
				// For cyclic undetermined lists.
				listItemAmount++;
				
				itemText += listItemAmount;
			break;
			default:
				listItemAmount++;
			
				itemText += listItemAmount;
		}
		
		itemText += itemDecorations[1];
		
		this.setAttribute('index', itemText);
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

class SolutionButton extends HTMLElement {
	
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

customElements.define('solution-button', SolutionButton);

class SpecialBox extends HTMLElement {
	render() {
		
		let boxType = this.getAttribute('box-type');
		
		this.classList.add('uef-' + boxType);
		
		// This block is for backwards compatibility.
			let numberContainer = document.createElement('span');
			let numberText = this.getAttribute('theorem-number') 
					? this.getAttribute('theorem-number') 
					: this.getAttribute('number');
			if (numberText) {
				numberContainer.textContent = numberText;
				numberContainer.style.fontWeight = 'bold';
				numberContainer.style.marginRight = '1em';
				numberContainer.style.marginLeft = '-0.75em';
				
				this.prepend(numberContainer);
			}
		
		let textWrapper = document.createElement('span');
		textWrapper.classList.add('special-box-title-text');
		
		switch (boxType) {
			case 'solution':
				let buttonBox = document.createElement('div');
				buttonBox.classList.add('solution-button-box');
				
				this.prepend(buttonBox);
			break;
			case 'solution-byhand':
				textWrapper.innerText = 'Ratkaisu.';
				solutionSettings(
					this,
					'byhand',
					'Näytä ratkaisu',
					'uef-' + boxType
				)
			break;
			case 'solution-bymatlab':
				textWrapper.innerText = 'Matlab-ratkaisu.';
				solutionSettings(
					this,
					'bymatlab',
					'Näytä Matlab-ratkaisu',
					'uef-' + boxType
				)
			break;
			case 'corollary':
				textWrapper.innerText = 'Korollaari.';
			break;
			case 'definition':
				textWrapper.innerText = 'Määritelmä.';
			break;
			case 'example':
				textWrapper.innerText = 'Esimerkki.';
			break;
			case 'exercise':
				textWrapper.innerText = 'Tehtävä.';
			break;
			case 'lemma':
				textWrapper.innerText = 'Lemma.';
			break;
			case 'proof':
				textWrapper.innerText = 'Todistus.';
			break;
			case 'remark':
				textWrapper.innerText = 'Huomio.';
			break;
			case 'summary':
				textWrapper.innerText = 'Tiivistelmä.';
			break;
			case 'theorem':
				textWrapper.innerText = 'Lause.';
			break;
			default:
		}
		
		if (this.getAttribute('alt-name')) {
			textWrapper.innerText = this.getAttribute('alt-name');
		}
		
		if (textWrapper.innerText) {
			this.prepend(textWrapper);
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
				codeExtractor(e, ba) 					//<-- Recursion
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
	let buttonText = e.target.textContent;
	let solutionBoxClass = solutionBox.classList;
	solutionBoxClass.toggle('hidden');
	
	if (solutionBoxClass.contains('hidden')) {
		e.target.textContent = buttonText.replace('Piilota', 'Näytä');
		return
	}
	
	e.target.textContent = buttonText.replace('Näytä', 'Piilota');
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
	solutionButton.addEventListener('click', e => {
		displayBox(e);
	});
	
	solutionButtonBox.appendChild(solutionButton);
	
	node.id = solutionButton.id + '-solution';
	node.classList.toggle('hidden');
}