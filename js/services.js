var LastsFM = function ($http) {
	var apiKey = 'a6d554e3ad1bdea8b66cfd8e7aa4cebe';
	var apiURL = 'http://ws.audioscrobbler.com/2.0/?';
	var ajaxFactory = {};
	
	ajaxFactory.getBand = function(bandName) {
		var url = apiURL + 'format=json&method=artist.getinfo&artist=' + bandName+ '&api_key=' + apiKey;
		return $http.get(url);
	}

	ajaxFactory.getTopAlbums = function(bandName) {
		var url = apiURL + 'format=json&method=artist.gettopalbums&artist=' + bandName + '&api_key=' + apiKey;
		return $http.get(url);
	}

	ajaxFactory.getAlbum = function(albumID) {
		var url = apiURL + 'format=json&method=album.getinfo&mbid=' + albumID + '&api_key=' + apiKey;
		return $http.get(url);
	}

	return ajaxFactory;
};	

app.factory('LastFM', ['$http', LastsFM]);