(function () {
    'use strict';
    
    // making some variables
    var hidden  = "hidden",
    	thisPage = window.location.hash,
    	oldPage = "",
    	url		= window.location.hash,
		movieData = {
			Title: "Title",
			Year: "Year",
			Genre: "N/A",
			Plot: "Plot"
		},
		searchedMovies = [];




	// start the web app
    var app = {
    	init: function () {
    		sections.hideAll();
    		routes.routie();
    	}
    };

    // routie routes
	var routes = {
		routieDirectives: function () {

		},
		
		routie: function () {
			var self = this;
			routie ({
				'home': function () {
					var data = { welcome: "hallooo!"};
					self.templateRender('home', data);
		    		mobileGesture.home();
					sections.enablePage();
				},
				'movieFinder': function () {
					self.templateRender('movieFinder', movieData);
					sections.enablePage();
					mobileGesture.movieFinder();
					getMovie.searchEngine();
				},
				'searchedMovies' : function () {
					getMovie.getLocalStorage();

					var _underscoreMovieData = _.groupBy(searchedMovies, 'Type');
					var _above = _.where(searchedMovies, {Rated: "PG-13"});

					self.templateRender('searchedMovies', _underscoreMovieData);
					self.templateRender('above', _above);

					mobileGesture.searchedMovies();

					sections.enablePage();
				},
				'info': function () {

					var directives = {
				    	Poster: {
				    		src: function (params) {
				    			return this.Poster;
				   			}
				   		},
				   	};
				   	self.templateRender('info', movieData, directives);
					sections.enablePage();
				},
				'*': function () {
					sections.enablePage();
				}
			});
		},
		templateRender: function (id, data, directives) {
			var el = document.getElementById(id);
			if (directives) {
				Transparency.render(el, data, directives);
			} else {
				Transparency.render(el, data);
			}
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
				window.location.hash = '#home';
			}
		},

		enablePage: function () {
			var _pageId;
			thisPage = window.location.hash;

			if (thisPage) {
				_pageId = document.querySelector(thisPage);
				_pageId.classList.remove(hidden);
			}
			
			if (oldPage) {
				this.disablePage();
			}
			oldPage = thisPage;

		},

		// disabeling page by adding hidden class
		disablePage: function () {

			var _pageId;
			if (oldPage && oldPage !== thisPage) {
				_pageId = document.querySelector(oldPage);
			}

			if (_pageId) {
				_pageId.classList.add(hidden);
			}
		}
	};

	var getMovie = {
		dataRequest: function (searchQuery) {

			var self = this;
			var urlData = {
				baseUrl : '//www.omdbapi.com/?t=',
				searchQuery: searchQuery.split(' ').join('+'), // http://stackoverflow.com/questions/441018/replacing-spaces-with-underscores-in-javascript
				urlOptions: '&y=&plot=full&r=json',
				request : function(base, searchQuery, urlOptions){
					return pegasus(base + searchQuery + urlOptions);
				}
			};

			var movieRequest = urlData.request(urlData.baseUrl, urlData.searchQuery, urlData.urlOptions);

			// https://github.com/Wasknijper/MWD-WebAppFromScratch/blob/gh-pages/week2-opdrachten/static/app.js
			// with help from Maaike Hek
			movieRequest.then( // promise
			    // success handler
			    function(data, xhr) {
			    	loader.toggleOn();
			    	setTimeout(function(){ // Timout om Spinner te showen!!!
				    	movieData = data;
				    	// console.log(movieData);
				    	self.enterData();
				    	self.saveToLocalStorage();
			    	}, 1000);
			    },
			    // error handler (optional)
			    function(data, xhr) {
			      console.error(data, xhr.status);
			      loader.toggleOff();
			    }
			);
		},
		searchEngine: function () {
			var _searchForm = document.querySelector('form');
			var _searchField = document.getElementById('searchField');
			var _searchQuery = "";
			var self = this;
			_searchForm.onsubmit = function (event) {
				event.preventDefault();

				_searchQuery = _searchField.value;
				self.dataRequest(_searchQuery);
			};
		},
		enterData: function () {

	    	loader.toggleOff();

			var directives = {
		    	Poster: {
		    		src: function (params) {
		    			return this.Poster;
		   			}
		   		},
		    	link: {
		    		src: function (params) {
		    			return "#info/" + this.imdbID;
		   			}
		   		}
		   	};
			routes.templateRender('dataSection', movieData, directives);
		},
		saveToLocalStorage : function () {

			this.getLocalStorage();
			searchedMovies.push(movieData);
			localStorage.setItem("searchedMovies", JSON.stringify(searchedMovies));
		},
		getLocalStorage : function () {

			if (localStorage.searchedMovies) {
				searchedMovies = JSON.parse(localStorage.searchedMovies);
				// console.table(searchedMovies);
			};

		}

	}


	var loader = {
		toggleOn: function () {
			document.getElementById('loadXhr').classList.remove('hidden');
			document.getElementById('dataSection').classList.add('hidden');
		},
		toggleOff: function () {
			document.getElementById('loadXhr').classList.add('hidden');
			document.getElementById('dataSection').classList.remove('hidden');
		}
	};

	var mobileGesture = {
		home: function () {

			var _homePage = document.getElementById('home');

			// create a simple instance
			// by default, it only adds horizontal recognizers
			var mc = new Hammer(_homePage);

			// listen to events...
			mc.on("panleft", function(ev) {
			    window.location.hash = "movieFinder";
			});
			mc.on("panright", function(ev) {
			    window.location.hash = "_searchedMovies";
			});
		},
		movieFinder: function () {

			var _movieFinder = document.getElementById('movieFinder');

			// create a simple instance
			// by default, it only adds horizontal recognizers
			var mc = new Hammer(_movieFinder);

			// listen to events...
			mc.on("panleft", function(ev) {
			    window.location.hash = "searchedMovies";
			});
			mc.on("panright", function(ev) {
			    window.location.hash = "home";
			});
		},
		searchedMovies: function () {

			var _searchedMovies = document.getElementById('searchedMovies');

			// create a simple instance
			// by default, it only adds horizontal recognizers
			var mc = new Hammer(_searchedMovies);

			// listen to events...
			mc.on("panleft", function(ev) {
			    window.location.hash = "home";
			});
			mc.on("panright", function(ev) {
			    window.location.hash = "movieFinder";
			});
		}
	};


	app.init();

})();




































