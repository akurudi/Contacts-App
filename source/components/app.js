var app = angular.module('app', ['ngMaterial', 'ngRoute', 'ngMessages', 'appFilters']);
app.config(function ($mdThemingProvider, $routeProvider) {
	$mdThemingProvider.theme('default').primaryPalette('cyan').accentPalette('red');
	$routeProvider.when("/", {
		templateUrl: "views/allContacts.html"
	});
	$routeProvider.when("/addContact", {
		templateUrl: "views/addContact.html"
	});
	$routeProvider.when("/viewContact", {
        templateUrl: "views/viewContact.html"
	});
	$routeProvider.when("/editContact", {
        templateUrl: "views/editContact.html"
	});
	$routeProvider.otherwise({
		redirectTo: "/"
	});
});