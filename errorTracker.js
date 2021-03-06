;(function jaxMathError() {
	window.addEventListener('load', e => {
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
		
		let copyErrorMessage = document.createElement('span');
		copyErrorMessage.classList.add('error-button');
		copyErrorMessage.innerHTML = 'Kopioi virheviesti';
		copyErrorMessage.addEventListener('click', e => {
			let prewchld = Array.from(document.body.querySelectorAll('.MathJax_Preview')).some(e => e.hasChildNodes());
			let errormsg = fontsOnPage() + '\n\n' + prewchld;
			navigator.clipboard.writeText(errormsg);
		});
		
		let errorContainer = document.createElement('div');
		errorContainer.classList.add('error-container');
		errorContainer.append(errorMessage, errorUpdate, errorClose, copyErrorMessage);
		
		let errorBox = document.createElement('div');
		errorBox.classList.add('jax-error');
		errorClose.addEventListener('click', e => {
			for (var o of document.getElementsByClassName('jax-error')) {
				o.remove();
			}
		});
		errorBox.append(errorContainer);
		
		if (document.visibilityState == 'visible') {
			return timeout(errorBox);
		}
		
		document.addEventListener('visibilitychange', e => {
			timeout(errorBox);
		});
	});
})();

function timeout(errorBox) {
	setTimeout(
		function() {
			console.info('Checking for MathJax errors...');
			
			let MathJaxPreviews 
				= Array.from(document.body.querySelectorAll('.MathJax_Preview'));
			let previewHasChildren = MathJaxPreviews.some(e => e.hasChildNodes());
			
			let MathJaxFonts = [];
			fontsOnPage().forEach(e => {
				if (/MathJax|MJX|STIX|Latin Modern|Gyre|Asana Math|TeX|Lucida Bright Math/g.test(e)) {
					MathJaxFonts.push(e);
				}
			});
			
			if (MathJaxPreviews.length > 0 && (MathJaxFonts.length < 1 || previewHasChildren || MathJax.Hub.lastError)) {
				document.body.appendChild(errorBox);
				console.error('MathJaxFonts', MathJaxFonts);
				console.error('previewHasChildren', previewHasChildren);
			}
		}
	, 20000);
}

function fontsOnPage() {
	let nodes = document.body.getElementsByTagName('*');
	let fonts = [];
	
	for (var i = 0; i < nodes.length; i++) {
		
		if (typeof (
				ff = nodes.item(i).style.fontFamily 
				|| window.getComputedStyle(nodes.item(i)).getPropertyValue('font-family')
				|| window.getComputedStyle(nodes.item(i), '::before').getPropertyValue('font-family')
				|| window.getComputedStyle(nodes.item(i), '::after').getPropertyValue('font-family')
			) == 'string') {
			if (!fonts.includes(ff) && ff != '') {
				fonts.push(ff);
			}
		}
	}
	
	nodes = [];
	
	return fonts;
}