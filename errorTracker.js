;(function jaxMathError() {
	window.addEventListener('load', e => {
		
		// let error 
				// = (document.getElementsByClassName(id).length > 0) 
				// ? true 
				// : false;
		
		// if (type == 'tag') {
			// error = (document.getElementsByTagName(id).length > 0)
			// ? true
			// : false;
		// }
		
		let errorMessage = document.createElement('span');
		errorMessage.classList.add('error-msg');
		errorMessage.innerHTML = 'Tapahtui virhe.';
		
		let errorClose = document.createElement('span');
		errorClose.classList.add('error-button');
		errorClose.innerHTML = 'Sulje';
		
		let errorUpdate = document.createElement('span');
		errorUpdate.classList.add('error-button');
		errorUpdate.addEventListener('click', e => {
			window.location.reload();
		});
		errorUpdate.innerHTML = 'Päivitä sivu';
		
		let errorContainer = document.createElement('div');
		errorContainer.classList.add('error-container');
		errorContainer.append(errorMessage, errorUpdate, errorClose);
		
		let errorBox = document.createElement('div');
		errorBox.classList.add('jax-error');
		errorClose.addEventListener('click', e => {
			for (var o of document.getElementsByClassName('jax-error')) {
				o.remove();
			}
		});
		errorBox.append(errorContainer);
		
		let searchString;
		switch (type) {
			case 'attribute':
				searchString = `[class*='${id}']`;
			break;
			case 'tag':
				searchString = `${id}`;
			break;
		}
		
		const config = {attributes: true, childList: true, subtree: true}

		const callback = function(mutationRecord, observer) {
			// console.log(mutationRecord);
			
			for (const record of mutationRecord) {
				if (record.type == 'childList') {
					for (const child of record.target.childNodes) {
						if (child.className == 'MathJax_Error' && 
							!document.getElementsByClassName('jax-error')) {
							document.body.appendChild(errorBox);
						}
						
						if (child.tagName == 'MJX-CONTAINER' && 
							!document.getElementsByClassName('jax-error')) {
							document.body.appendChild(errorBox);
						}
					}
				}
			}
		}
		
		const observers = [];
		
		setTimeout(
			function() {
				// if (error) {
					// console.info('MathJax errors are now observed');
				// }
				// document.querySelectorAll(searchString).forEach(o => {
					
					// var observer = new MutationObserver(callback);
					// observers.push(observer);
					
					// observer.observe(o, config);
				// })
				console.info('Checking for MathJax errors...');
				// if (document.querySelectorAll('[class*="MathJax_Error"]').length > 0) {
					// document.body.appendChild(errorBox);
				// }
				// console.log(MathJax);
				// console.log(MathJax.Message.log);
				let MathJaxFonts = [];
				fontsOnPage().forEach(e => {
					if (/MathJax/g.test(e)) {
						MathJaxFonts.push(e);
					}
				});
				if (MathJaxFonts.length < 1) {
					document.body.appendChild(errorBox);
				}
			}
		, 20000);
	});
})();

function fontsOnPage() {
	let nodes = document.body.getElementsByTagName('*');
	let fonts = [];
	
	for (var i = 0; i < nodes.length; i++) {
		if (typeof (ff = nodes.item(i).style.fontFamily) == 'string') {
			if (!fonts.includes(ff) && ff != '') {
				fonts.push(nodes.item(i).style.fontFamily);
			}
		}
	}
	
	nodes = [];
	
	return fonts;
}