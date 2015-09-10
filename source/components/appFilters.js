angular.module("appFilters",[])
.filter("contactFilter", function () {
	return function (contacts, searchString, searchError) {
        var contactResults = [];
        if (angular.isArray(contacts) && searchString) {
			for (var i = 0; i < contacts.length; i++) {
				if (contacts[i].fname.toLowerCase().indexOf(searchString.toLowerCase()) == 0 || contacts[i].lname.toLowerCase().indexOf(searchString.toLowerCase()) == 0) {
					contactResults.push(contacts[i]);
				}
			}
			return contactResults;
        } else {
			return contacts;
        }
	}
})
.filter("capitalize", function () {
	return function (value) {
        if (angular.isString(value) && value) {
			var newValue = value[0].toUpperCase() + value.slice(1).toLowerCase();
			return newValue;
        } else {
			return value;
        }
	}
});