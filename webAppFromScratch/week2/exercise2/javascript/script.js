(function () {
    'use strict';
    
    // making some variables
    var hidden  = "hidden",
    	thisPage = window.location.hash,
    	oldPage = "",
    	url		= window.location.hash;

    var app = {
    	init: function () {
    		sections.hideAll();
    		routes.routie();
    	}
    };

	var routes = {

		routie: function () {
			routie ({
				'home': function () {

					var data = {
						welcome: "hallooo!"
					}

					Transparency.render(document.getElementById('home'), data);
					sections.enablePage();
				},

				'bestPractices': function () {
					sections.enablePage();
				},

				'apiData': function () {


					var data = {
						baseUrl : 'http://www.colourlovers.com/api/',
						request : function(base, options){
							return pegasus(base + options);
						}
					};

					var colourloversData = {
						raw : []
					};

					var colourloversRequest = data.request(data.baseUrl, 'colors/random');

					colourloversRequest.then(
					    // success handler
					    function(data, xhr) {
					      // load the list of pokemon into the pokedex, since it contains all the pokemon its the national pokedex.
					      // its not a string, so no need to parse the JSON
					      colourloversData.raw = data;

					      //log to check
					      console.log(colourloversData.raw);
					    },
					    // error handler (optional)
					    function(data, xhr) {
					      console.error(data, xhr.status);
					    }
					);



					var data1 = {
						pageTitle: "API Data inladen"
					}

					Transparency.render(document.getElementById('apiData'), data1);
					sections.enablePage();
				},

				'*': function () {
					sections.enablePage();
				}
			});
		}

	};

	var sections = {

		// function called in the app.innit to hide al pages
		// this is not done in the html because we want the page to be visible if there is no javascript in the browser
		hideAll: function () {

			
			var allPages = document.querySelectorAll(".page"); // saving al the pages from the HTML

			for (var i = 0; i < allPages.length; i++) { // loop through the pages
				allPages[i].classList.add(hidden);
			};

			if (!window.location.hash) {

			}
		},

		enablePage: function () {

			var _pageId;

			thisPage = window.location.hash;
			_pageId = document.querySelector(thisPage);

			
			if (_pageId) {
				_pageId.classList.remove(hidden);

			} 
			else {
				this.notFound();
			}

			if (oldPage) {
				this.disablePage();
			}
			oldPage = thisPage;

		},

		// disabeling page by adding hidden class
		disablePage: function () {

			var _pageId = document.querySelector(oldPage);

			if (_pageId) {
				_pageId.classList.add(hidden);
			}
		},

		// if hash doesn't exist
		notFound: function () {
			window.location.hash = 'notFound';
			this.enablePage();
		}
	};


	app.init();

})();





































