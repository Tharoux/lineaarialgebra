class MatlabCode extends HTMLElement {
	
	render() {
		this.classList.add("matlab-code-block");
		
		let infoText = document.createElement('div');
		infoText.classList.add('matlab-infotext');
		infoText.innerHTML = 'Matlab-syöte';
		
		let infoTextWrapper = document.createElement('div');
		infoTextWrapper.classList.add('flex-hor');
		infoTextWrapper.append(infoText);
		
		this.before(infoTextWrapper);
		
		let copyButton = document.createElement('copy-button');
		copyButton.classList.add('copy-button');
		copyButton.setAttribute('id', randomID());
		
		let copyWrapper = document.createElement('div');
		copyWrapper.classList.add('copy');
		copyWrapper.append(copyButton);
		
		let randID = randomID();
		copyButton.addEventListener(
			'click',
			function() {
				let urlString = `https://digicampus.fi/pluginfile.php/823736/mod_resource/content/${Number.MAX_VALUE}/copy_done_icon.svg`;
				this.style.backgroundImage = 'url(' + urlString + ')';
				let thisButtonID = this.id;
				setTimeout(
					function() {
						urlString = `https://digicampus.fi/pluginfile.php/823748/mod_resource/content/${Number.MAX_VALUE}/copy_icon_1.svg`;
						document
							.getElementById(thisButtonID)
							.style
							.backgroundImage = 'url(' + urlString + ')';
					}, 1500);
					
				copyCode(this.parentNode, true);
			}
		);
		this.append(copyButton);
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define("matlab-code", MatlabCode);

class MatlabComment extends HTMLElement {
	render() {
		this.classList.add('matlab-comment');
		
		if (this.getAttribute('multiline')) {
			this.classList.add('matlab-comment-multi');
		}
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define("matlab-comment", MatlabComment);

class MatlabFunctionBlock extends HTMLElement {
	
	render() {
		
			this.classList.add('matlab-function-block');
			
			
			let functionName = document.createElement('span');
			functionName.classList.add('matlab-function');
			functionName.textContent = this.getAttribute('function-name') + ' ';
			
			let inlineCode = document.createElement('span');
			inlineCode.textContent = this.getAttribute('function-inline');
			
			this.prepend(functionName, inlineCode);
		}
		
		connectedCallback() {
			if(!this.rendered) {
				this.render();
				this.rendered = true;
			}
		}
}

customElements.define("matlab-function", MatlabFunctionBlock);

class MatlabMatrix extends HTMLElement {
	
	render() {
		
		let matrixName = this.getAttribute('matrix-name');
		let matrixNameArray = [];
		let constructedMatrices = this.matrixConstructor();
		
		
		//Construct matrix names
		if (matrixName != null) {
			
			matrixNameArray = matrixName.replace(/\s/g,'').split(',');
			matrixNameArray.forEach((e, i) => {
				
				let matrixRowAmount = constructedMatrices[i].childNodes[0].rows.length;
				let matrixColumnAmount = constructedMatrices[i].childNodes[0].rows[0].cells.length;

				let matrixSize = document.createElement('span');
				matrixSize.textContent = `${e} = ${matrixRowAmount}x${matrixColumnAmount}`;
				
				let leftWrap = document.createElement('div');
				leftWrap.append(matrixSize);
				
				let rightWrap = document.createElement('div');
				rightWrap.append(constructedMatrices[i]);
				
				let wrapper = document.createElement('div');
				wrapper.classList.add('flex-ver');
				wrapper.append(leftWrap, rightWrap);
				
				matrixNameArray[i] = wrapper;
			})
		} else {
			constructedMatrices.forEach(e => {
				
				let matrixRow = document.createElement('div');
				matrixRow.classList.add('matlab-matrix-row');
				matrixRow.append(e);
				
				let matrixTable = document.createElement('div');
				matrixTable.classList.add('matlab-matrix-table');
				matrixTable.append(matrixRow);
				
				let wrapper = document.createElement('div');
				wrapper.append(matrixTable);
				
				matrixNameArray.push(wrapper);
			})
		}

		matrixNameArray.forEach(e => {
			this.append(e);
		})
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
	
	matrixConstructor() {
		let matrixElements = this.getAttribute('matrix');
		const tempArray = matrixElements.split(/(?<=\])\s/);
		tempArray.forEach(e => {
			e = e.slice(1,-1);
		})
		
		//Create "matrices"
		let matrixArray = [];
		tempArray.forEach((e, i) => {
			let rows = e.split(/\;/);
			let rowCount = rows.length;
			let columnCount = rows[0].match(/\,/).length + 1;
			
			let matrixTableBody = document.createElement('tbody');
			
			rows.forEach(e => {
				
				let row = document.createElement('tr');
				
				let splitRow = e.replace(/\s/g,'').split(',');
				splitRow.forEach(el => {
					let cell = document.createElement('td');
					cell.style.textAlign = 'center';
					cell.style.verticalAlign = 'middle';
					cell.style.padding = '0px 5px 0px';
					cell.append(el.replace(/\[|\]/g,''));
					
					row.appendChild(cell);
				})
				
				matrixTableBody.appendChild(row);
			})
			
			let matrixTable = document.createElement('table');
			matrixTable.appendChild(matrixTableBody);
			
			let matrixCell = document.createElement('div');
			matrixCell.classList.add('matlab-matrix-cell');
			matrixCell.appendChild(matrixTable);
			
			matrixArray.push(matrixCell);
		})
		
		return matrixArray;
	}
}

customElements.define("matlab-matrix", MatlabMatrix);

class MatlabOutput extends HTMLElement {
	render() {
		this.classList.add('matlab-code-output');
		
		let infoText = document.createElement('div');
		infoText.classList.add('matlab-infotext');
		infoText.innerHTML = 'Matlab-tuloste';
		
		let infoTextWrapper = document.createElement('div');
		infoTextWrapper.classList.add('flex-hor');
		infoTextWrapper.append(infoText);
		
		this.before(infoTextWrapper);
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define("matlab-output", MatlabOutput);

class MatlabSyms extends HTMLElement {
	
	render() {
		
		let symsSpan = document.createElement('span');
		symsSpan.classList.add('matlab-syms');
		symsSpan.textContent = 'syms ';
		
		let symsAttribute = document.createElement('span');
		symsAttribute.textContent = this.getAttribute('syms');
		
		let wrapper = document.createElement('span');
		wrapper.style.display = 'inline-block';
		wrapper.style.width = '100%';
		wrapper.append(symsSpan, symsAttribute);
		
		this.appendChild(wrapper);
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define("matlab-syms", MatlabSyms);

class MatlabTab extends HTMLElement {
	render() {
		this.classList.add('matlab-tab-block');
	}
	
	connectedCallback() {
		if(!this.rendered) {
			this.render();
			this.rendered = true;
		}
	}
}

customElements.define("matlab-tab", MatlabTab);

//-----------------Functions

function tabFunction(regex, node, multiple) {
	
	if (multiple == undefined) {
		multiple = 1;
	}
	
	regex = elementToArray(regex);
	
	multiple = elementToArray(multiple);
	
	regex.forEach((e,i) => {
		if (!(e.test(node.parentElement.tagName))) {
			node.style.paddingLeft = multiple[i] * 25 + 'px';
		}
	})
}

function elementToArray(e) {
	let tempArray = [];
	
	if (!(Array.isArray(e))) {
		tempArray.push(e);
	} else {
		tempArray = e;
	}
	
	return tempArray;
}