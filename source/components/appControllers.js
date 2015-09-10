angular.module('app')
	.controller('MyController', function ($scope, $mdBottomSheet, $mdDialog, $mdToast, $location, $http) {
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
		$http(config).then(function (response) {
			$scope.contacts = response.data;
		});
		$scope.avatarData = [
			{ "value": "images/anonymous.png", "title": "anonymous" },
			{ "value": "images/male.png", "title": "male" },
			{ "value": "images/female.png", "title": "female" }
		]
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
			var tmpContact = { "fname": undefined, "lname": undefined, "phone1": undefined, "phone2": undefined, "email": undefined, "bday": undefined, "website": undefined, "avatar": undefined, "isFav": false };
			if (!$scope.isExistingContact(newContact)) {
				for (var key in tmpContact) {
					if (tmpContact.hasOwnProperty(key)) {
						if (newContact[key] !== undefined && newContact[key] !== null) {
							if (key === "bday") {
								tmpContact[key] = JSON.parse(JSON.stringify(newContact[key]));
							} else {
								tmpContact[key] = newContact[key];
							}

						}
					}
				}
				$scope.currentContact = tmpContact;
				$scope.contacts.push(tmpContact);
				$location.path("/viewContact");
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
						.content('Contact already exists')
						.ariaLabel('Contact already exists')
						.ok('OK')
					);
			}
		};
		$scope.updateContact = function (newContact) {
			var tmpContact = {};
			for (var i = 0; i < $scope.contacts.length; i++) {
				if ($scope.contacts[i].fname.toLowerCase() === $scope.currentContact.fname.toLowerCase() && $scope.contacts[i].lname.toLowerCase() === $scope.currentContact.lname.toLowerCase()) {
					tmpContact = $scope.contacts[i];
					$scope.contacts.splice(i, 1);
					break;
				}
			}
			for (var key in tmpContact) {
				if (tmpContact.hasOwnProperty(key)) {
					if (newContact[key] !== undefined && newContact[key] !== null) {
						tmpContact[key] = newContact[key];
					}
				}
			}
			$scope.contacts.push(tmpContact);
			$location.path("/viewContact");
			$mdToast.show(
				$mdToast.simple()
					.content('Contact saved successfully!')
					.position('top right')
					.hideDelay(7000)
				);
		};
		$scope.selectedTabIndex = 1;
		$scope.errors = {};
		$scope.currentContact = {};
		$scope.addNewContact = function () {
			$scope.currentContact = {};
			$location.path("/addContact")
		};
		$scope.goBack = function () {
			$location.path("/");
		};
		$scope.viewContact = function (contact) {
			$scope.currentContact = contact;
			$location.path("/viewContact");
		};
		$scope.editContact = function (contact) {
			$scope.currentContact = contact;
			$location.path("/editContact");
		};
	});