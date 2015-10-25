angular.module('app')
  .directive("addToFav", function () {
    return function (scope, element, attrs) {
      var iconElem = element.find('i');
      var buttonElem = element.find('button');
      buttonElem.on("click", function (e) {
        e.preventDefault();
        var iconText = iconElem.text();
        iconElem.text(iconText === 'star_border' ? 'star' : 'star_border');
        scope.$apply(function () {
          scope.tmpContact.isFav = (iconText === 'star_border' ? true : false);
        })
      })
    }
  });