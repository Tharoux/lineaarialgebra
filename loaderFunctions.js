//Lataa ulkoisen tiedoston HTML-sivun
//headeriin. Tuetut tiedostot:
//	- javascript
//	- css
function addFile(fileName, fileType) {
	
	let fileUrl = 'https://Tharoux.github.io/lineaarialgebra/'
	
	switch (fileName) {
		case 'mainFunctionality':
			fileUrl += 'mainFunctionality.js';
		break;
		case 'mainStyle':
			fileUrl += 'mainStyle.css';
		break;
		case 'matlab':
			fileUrl += 'matlab.js';
		break;
		case 'matlabStyle':
			fileUrl += 'matlabStyle.css';
		break;
		case 'errorTracker':
			fileUrl += 'errorTracker.js';
		break;
		case 'errorStyle':
			fileUrl += 'errorStyle.css'
		break;
	}
	
	let tagType;
	
	fileType = fileType.toLowerCase();
	
	switch (fileType) {
		case 'js':
			tagType = 'script';
		break;
		case 'css':
			tagType = 'link'
		break;
		default:
			console.error('fileType missing or invalid!');
			return;
	}
	
	let searchTags = document.getElementsByTagName(tagType);
	for (var i = 0; i < searchTags.length; i++) {
		let regex = new RegExp(fileName, 'g');
		if (regex.test(searchTags[i].src) || regex.test(searchTags[i].href)) {
			console.error('file ' + fileName + '.' + fileType + ' already included!');
			return;
		}
	}
		
	let file;
		
	switch (fileType) {
		case 'js':
			let scriptElement = document.createElement('script');
			scriptElement.type = 'text/javascript';
			scriptElement.src = fileUrl;
			file = scriptElement;
		break;
		case 'css':
			let linkElement = document.createElement('link');
			linkElement.type = 'text/css';
			linkElement.rel = 'stylesheet';
			linkElement.href = fileUrl;
			file = linkElement;
		break;
		default:
			return;
	}

	document.head.appendChild(file);
	
	console.info(fileName + '.' + fileType + ' loaded successfully');
}

;(function () {
	document.addEventListener('DOMContentLoaded', function() {
		addFile('mainFunctionality', 'js');
		addFile('mainStyle', 'css');
		addFile('matlab', 'js');
		addFile('matlabStyle', 'css');
		addFile('errorTracker', 'js');
		addFile('errorStyle', 'css');
	});
})()