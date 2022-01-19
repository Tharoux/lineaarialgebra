//Lataa ulkoisen tiedoston HTML-sivun
//headeriin. Tuetut tiedostot:
//	- javascript
//	- css
function addFile(fileID, fileName, fileType) {
	
	let tagType;
	
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
	
	fileType = fileType.toLowerCase();
	
	let linkText = 'https://digicampus.fi/pluginfile.php/'
		+ fileID
		+ '/mod_resource/content/'
		+ Number.MAX_VALUE
		+ '/'
		+ fileName
		+ '.'
		+ fileType;
		
	let file;
		
	switch (fileType) {
		case 'js':
			let scriptElement = document.createElement('script');
			scriptElement.type = 'text/javascript';
			scriptElement.src = linkText;
			file = scriptElement;
		break;
		case 'css':
			let linkElement = document.createElement('link');
			linkElement.type = 'text/css';
			linkElement.rel = 'stylesheet';
			linkElement.href = linkText;
			file = linkElement;
		break;
		default:
			return;
	}

	document.head.appendChild(file);
	
	console.log(fileName + '.' + fileType + ' loaded successfully');
}

addFile(815905, 'mainFunctionality', 'js');
addFile(815906, 'mainStyle', 'css');
addFile(815228, 'matlab', 'js');
addFile(814392, 'matlabStyle', 'css');