angular.module('app')
	.controller('MyController', function ($scope, $mdBottomSheet, $mdDialog, $mdToast, $location, $http, $anchorScroll, localStorageService) {
		var config = {
			method: 'GET',
			url: '../contacts.json',
			transformResponse: function (data) {
				var newData = [];
				data = angular.fromJson(data);
				for(var i=0; i < data.length; i++) {
					newData[i] = data[i];
					newData[i].bday = new Date(data[i].bday);
				}
				return newData;
			}
		};
		$scope.getContacts = function() {
			if(localStorageService.get("contacts")) {
				var data = angular.fromJson(angular.fromJson(localStorageService.get("contacts")));
				for(var i=0; i < data.length; i++) {
					data[i].bday = new Date(data[i].bday);
				}
				$scope.contacts = data;
			} else {
				$http(config).then(function (response) {
					$scope.contacts = response.data;
					localStorageService.set("contacts", angular.toJson(response.data));
				});
			}
		};
		$scope.getContacts();
		$scope.avatarData = [
			{ "value": "images/anonymous.png", "title": "anonymous" },
			{ "value": "images/male.png", "title": "male" },
			{ "value": "images/female.png", "title": "female" }
		];
		$scope.openBottomSheet = function ($event) {
			$scope.selectedTabIndex = 1;
			$mdBottomSheet.show({
				template: '<md-input-container><input ng-model="searchContactString" placeholder="Search contacts by name"></md-input-container>',
				parent: "#tabs",
				scope: $scope,
				preserveScope: true
			}).then(function (clickedItem) {
				$scope.searchContactString = '';
			});
		};
		$scope.isExistingContact = function (newContact) {
			var contactFound = false;
			for (var i = 0; i < $scope.contacts.length; i++) {
				if ($scope.contacts[i].fname.toLowerCase() === newContact.fname.toLowerCase() && $scope.contacts[i].lname.toLowerCase() === newContact.lname.toLowerCase()) {
					contactFound = true;
					break;
				}
			}
			return contactFound;
		};
		$scope.addContact = function (newContact) {
			if (!$scope.isExistingContact(newContact)) {
				$scope.contacts.push(newContact);
				localStorageService.set("contacts", angular.toJson($scope.contacts));
				$location.path("/viewContact");
				$anchorScroll();
				$mdToast.show(
					$mdToast.simple()
						.content('Contact added successfully!')
						.position('top right')
						.hideDelay(7000)
					);
			} else {
				$mdDialog.show(
					$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('ERROR!')
						.content('Contact ' + newContact.fname + ' ' + newContact.lname + ' already exists')
						.ariaLabel('Contact already exists')
						.ok('OK')
					);
			}
		};
		$scope.updateContact = function (newContact) {
			if (($scope.currentContact.fname.toLowerCase() !== newContact.fname.toLowerCase() || $scope.currentContact.lname.toLowerCase() !== newContact.lname.toLowerCase()) && ($scope.isExistingContact(newContact))) {
				$mdDialog.show(
					$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('ERROR!')
						.content('Contact ' + newContact.fname + ' ' + newContact.lname + ' already exists')
						.ariaLabel('Contact already exists')
						.ok('OK')
					);
			} else {
				for (var i = 0; i < $scope.contacts.length; i++) {
					if ($scope.contacts[i].fname.toLowerCase() === $scope.currentContact.fname.toLowerCase() && $scope.contacts[i].lname.toLowerCase() === $scope.currentContact.lname.toLowerCase()) {
						$scope.contacts.splice(i, 1);
						break;
					}
				}
				$scope.contacts.push(newContact);
				localStorageService.set("contacts", angular.toJson($scope.contacts));
				$scope.currentContact = angular.copy(newContact);
				$location.path("/viewContact");
				$anchorScroll();
				$mdToast.show(
					$mdToast.simple()
						.content('Contact saved successfully!')
						.position('top right')
						.hideDelay(7000)
				);

			}
		};
		$scope.deleteContact = function (tmpContact) {
			for (var i = 0; i < $scope.contacts.length; i++) {
				if ($scope.contacts[i].fname.toLowerCase() === $scope.tmpContact.fname.toLowerCase() && $scope.contacts[i].lname.toLowerCase() === $scope.tmpContact.lname.toLowerCase()) {
					$scope.contacts.splice(i, 1);
					break;
				}
			}
			localStorageService.set("contacts", angular.toJson($scope.contacts));
			$location.path("/");
			$anchorScroll();
			$mdToast.show(
				$mdToast.simple()
					.content('Contact deleted successfully!')
					.position('top right')
					.hideDelay(7000)
			);
		};
		$scope.selectedTabIndex = 1;
		$scope.errors = {};
		$scope.currentContact = {};
		$scope.tmpContact = {};
		$scope.addNewContact = function () {
			$scope.currentContact = {};
			$location.path("/addContact")
		};
		$scope.goBack = function () {
			$location.path("/");
		};
		$scope.viewContact = function (contact) {
			$scope.currentContact = angular.copy(contact);
			$location.path("/viewContact");
		};
		$scope.editContact = function () {
			$scope.tmpContact = angular.copy($scope.currentContact);
			$location.path("/editContact");
		};
	});