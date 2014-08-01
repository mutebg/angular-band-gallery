var app = angular.module('music', ['ngRoute', 'ngSanitize', 'ngAnimate']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
    	when('/', {
    		templateUrl: 'js/views/home.html',
    		controller: 'HomeCtrl'
    	}).
        when('/gallery/:bands', {
            templateUrl: 'js/views/gallery.html',
            controller: 'GalleryCtrl'
        }).
        when('/bio/:band', {
            templateUrl: 'js/views/bio.html',
            controller: 'BioCtrl'
        }).
        when('/album/:id', {
            templateUrl: 'js/views/album.html',
            controller: 'AlbumCtrl'
        }).
    	otherwise({
    		redirectTo: '/'
    	});
}]);

app.directive('ngBack', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('click', function() {
                history.back();
                scope.$apply();
            });
        }
    };
});

