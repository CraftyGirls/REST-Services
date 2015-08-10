'use strict';

angular.module('scenarioEditor.charView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/charView', {
    templateUrl: 'charView/charView.html',
    controller: 'CharCtrl'
  });
}])

.service('charService', function () {
	var charData = [
		{'id':0,'name':'','other':''}
	];

	var currChar = 0;

	return {
		chars:function () {
			return charData;
		},
		addChar:function () {
			currChar++;
			charData.push({'id':currChar,'name':'',other:''});
		},
		deleteChar:function (character) {
			charData.splice(charData.indexOf(character),1);
		}
	};
})

.controller('CharCtrl', ['$scope', 'charService', function($scope, charService) {
	$scope.getChars = function () {
		return charService.chars();
	};

	$scope.addChar = function () {
		return charService.addChar();
	};

	$scope.deleteChar = function (id) {
		return charService.deleteChar(id);
	};

}]);