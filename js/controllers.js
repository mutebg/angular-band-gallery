

app.controller('HomeCtrl', function( $scope, $location ){
	$scope.bands = 'Pink Floyd\nRadiohead\nMuse\nNirvana';
	$scope.nextPage = function() {
		$location.url('/gallery/' + encodeURIComponent( $scope.bands ) );
	}
});


app.controller('GalleryCtrl', function($scope, $routeParams, $q, LastFM){
	var routeBands = decodeURIComponent($routeParams.bands);
	$scope.bandsList = routeBands.split("\n");
	$scope.bands = [];
	$scope.loading = true;
	$scope.currentPage = 0;

	console.profile('load');

	var requests = [];
	var bands = [];
	for( var i = 0; i < $scope.bandsList.length; i++ ) {
		var bandName = $scope.bandsList[i];

		var bandReq = LastFM.getBand(bandName).then( function(resp){
			var band = {
				name: 	resp.data.artist.name,
				bio: 	resp.data.artist.bio.summary,
				image: 	resp.data.artist.image[4]['#text'],
				yearFrom: resp.data.artist.bio.yearformed,
				url: 	resp.data.artist.url,
				albums: []
			}
			return band;
		});


		var albumReq  = LastFM.getTopAlbums(bandName).then( function(resp){
			var albums = [];
			angular.forEach(resp.data.topalbums.album, function(value, key) {
				albums.push({
					name: value.name,
					image: value.image[2]['#text'],
					url: value.url,
					id: value.mbid
				});

			});
			return albums.slice(0, 5);
		});

		requests.push(bandReq);
		requests.push(albumReq);
	}

	$q.all( requests ).then( function(data){
		var k = 0;
		var bands = [];
		for(var i = 0; i < data.length; i++) {
			if ( i % 2 == 0 ) {
				bands[k] = data[i];
			} else if ( i % 2 == 1 ) {
				bands[k].albums = data[i];
				k++;
			}
		}
		console.profileEnd('load');
		$scope.bands = bands;
		$scope.loading = false;
		$scope.initNav();
	});


	$scope.moveTo = function(index) {
		window.scrollTo(0, document.querySelector('#band-' + index ).offsetTop);
	}

	
	$scope.initNav = function() {

		var containerHeight = window.innerHeight;
		var scrollTop = 0;
		window.onscroll = function() {
			scrollTop = document.body.scrollTop;
			var delimiter = Math.floor( scrollTop / containerHeight );
			$scope.currentPage = delimiter;
			$scope.$apply();
		}
	}
	
});

app.controller('BioCtrl', function($scope, $routeParams, LastFM){
	var bandName = decodeURIComponent($routeParams.band);
	$scope.band = {};
	var bandReq = LastFM.getBand(bandName).then( function(resp){
		var band = {
			name: 	resp.data.artist.name,
			bio: 	resp.data.artist.bio.content,
			image: 	resp.data.artist.image[4]['#text']
		}
		$scope.band = band;
	});
});

app.controller('AlbumCtrl', function($scope, $routeParams, LastFM){
	var albumID = $routeParams.id;
	$scope.album = {};
	LastFM.getAlbum(albumID).then( function(resp){
		$scope.album = resp.data.album;
		$scope.albumImage = $scope.album.image[4]['#text'];
	});

	$scope.time = function(secs) {
		var minutes = Math.floor( secs / 60);
		var seconds = secs - minutes * 60;

		var str = "" + seconds;
		var pad = "00";
		seconds = pad.substring(0, pad.length - str.length) + str

		return minutes + ':' + seconds;
	}
});