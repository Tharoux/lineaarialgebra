function jaxMathError() {
	window.addEventListener('load', e => {
		setTimeout(
			let error 
				= (document.getElementsByClassName('MathJax_Error').length > 0) 
				? true 
				: false;
			if (error) {
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
				
				document.body.appendChild(errorBox);
			}
		, 120000)
	});
}

jaxMathError();