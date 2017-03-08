(function() {
	"use strict";

	///////////////////////////////////////////
	// CONSTRUCT // GLOBALS
	///////////////////////////////////////////
	const SearchModule = function() {
		//GLOBALS
		const searchBtn = document.querySelector('.btn');
		const tenImagesBtn = document.querySelector('.btn-image');
		const tenVideosBtn = document.querySelector('.btn-video');

		let searchValue = document.querySelector('#input');
		// used in changing screens
		let results = document.querySelector('.results');
		let formContainer = document.querySelector('.form-container');
		let lbContainer = document.querySelector('.lb-container');
		let lightBoxShow = document.querySelector('.light-box');
		let targetImage = document.getElementsByTagName('img');
		let targetURL = null;
		let searchTerm = '';

		///////////////////////////////////////////
		// EVENT LISTENER - REMOVE LIGHTBOX
		///////////////////////////////////////////
		function removeLightBox() {
			lbContainer.addEventListener('click', () => {
				event.preventDefault();
				changeScreens('default');
			});
		}
		///////////////////////////////////////////
		// EVENT LISTENER - LIGHTBOX
		///////////////////////////////////////////
		function lightBox() {
			for (let i = 0; i < targetImage.length; ++i)
				targetImage[i].addEventListener('click', () => {
					// this works ...
					event.preventDefault();
					targetURL = event.target.dataset.large_url;
					lightBoxShow.innerHTML = `<img src=${targetURL}>`;
					changeScreens('lightBox');
				});
		}

		///////////////////////////////////////////
		// FUNCTION - CHANGE SCREENS
		///////////////////////////////////////////

		function changeScreens(activeScreen) {
			if (activeScreen === 'default') {
				results.classList.remove('is-hidden');
				formContainer.classList.remove('is-hidden');
				lbContainer.classList.add('is-hidden');

			} else if (activeScreen === 'lightBox') {
				// brings up lightbox
				lbContainer.classList.remove('is-hidden');
			} else {
				// if for whatever reason - back to default
				results.classList.remove('is-hidden');
				formContainer.classList.remove('is-hidden');
				lbContainer.classList.add('is-hidden');
			}
			// click out of lightbox
			removeLightBox();
		}

		///////////////////////////////////////////
		// FUNCTION : DISPLAY SEARCH RESULTS
		///////////////////////////////////////////
		// grabbing obj url value & inserting into img tag
		// & grabbing large_url and adding as a dataset in img tag!
		function displayResult(url, large_url) {
			let image = document.createElement('img');
			image.src = url;
			results.appendChild(image);
			image.dataset.large_url = `${large_url}`;
			image.className = 'lightBoxImage';
		}

		function displayVideo(url, large_url) {
			let video = document.createElement('video');
			video.setAttribute('controls', true);
			video.src = large_url;
			video.poster = url;
			results.appendChild(video);
			console.log('in video!');
		}

		///////////////////////////////////////////
		// FUNCTION : LATEST 10 IMAGES
		///////////////////////////////////////////
		function tenImages() {
			tenImagesBtn.addEventListener('click', () => {
				event.preventDefault();
				results.innerHTML = '';
				getTenImages();
				formContainer.reset();
			});
		}

		function getTenImages() {
			const http = new XMLHttpRequest();
			http.onreadystatechange = function() {
				if (http.readyState === 4 && http.status === 200) {
					const resultData = JSON.parse(http.response);
					const resultImages = resultData.images;
					for (let i = 0; i < 10; i++) {
						displayResult(resultImages[i].url, resultImages[i].large_url);
					}
					lightBox();
				}
			};
			http.open('GET', `https://www.splashbase.co/api/v1/images/latest`, true);
			http.send();
		}

		///////////////////////////////////////////
		// FUNCTION : LATEST 10 VIDEOS
		///////////////////////////////////////////
		function tenVideos() {
			tenVideosBtn.addEventListener('click', () => {
				event.preventDefault();
				results.innerHTML = '';
				getTenVideos();
				formContainer.reset();
			});
		}

		function getTenVideos() {
			const http = new XMLHttpRequest();
			http.onreadystatechange = function() {
				if (http.readyState === 4 && http.status === 200) {
					const resultData = JSON.parse(http.response);
					// console.dir(resultData);
					const resultVideos = resultData.images;
					// console.dir(resultVideos);
					for (let i = 0; i < 10; i++) { // keep to 10 results
						displayVideo(resultVideos[i].url, resultVideos[i].large_url);
					}
					lightBox();
				}
			};
			http.open('GET', `https://www.splashbase.co/api/v1/images/latest?videos_only=true`, true);
			http.send();
		}
		///////////////////////////////////////////
		// FUNCTION : GET INPUT :: EVENT LISTENER
		///////////////////////////////////////////
		function getInput() {
			searchBtn.addEventListener('click', () => {
				event.preventDefault();
				searchTerm = searchValue.value.toLowerCase();
				console.log(searchTerm);
				results.innerHTML = ''; // clear page for new results
				getData(searchTerm); // run w/ searchTerm
				formContainer.reset();
			});
		}

		///////////////////////////////////////////
		// FUNCTION : AJAX REQUEST
		///////////////////////////////////////////
		function getData() {
			const http = new XMLHttpRequest();
			http.onreadystatechange = function() {
				if (http.readyState === 4 && http.status === 200) {
					const searchResultData = JSON.parse(http.response);
					const resultImages = searchResultData.images;
					for (let i = 0; i < 10; i++) {
						displayResult(resultImages[i].url, resultImages[i].large_url);
					}
					lightBox();
				}
			};
			// search: "http://www.splashbase.co/api/v1/images/search", "query" => "laptop" // from site
			http.open('GET', `https://www.splashbase.co/api/v1/images/search?query="${searchTerm}`, true);
			http.send();
		}

		///////////////////////////////////////////
		// FUNCTION : INIT
		///////////////////////////////////////////
		function init() {
			changeScreens('default');
			getInput();
			tenImages();
			tenVideos();
		}

		return {
			init: init
		};

	}; // end construct

	const searchApp = SearchModule();
	searchApp.init();
})();
