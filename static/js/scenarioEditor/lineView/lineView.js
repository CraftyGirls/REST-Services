'use strict';

angular.module('scenarioEditor.lineView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/lineView', {
    templateUrl: '../../../../templates/scenarioEditor/lineView/lineView.html',
    controller: 'LineCtrl'
  });
}])

.service('lineService', function () {
	var lineData = [
		{'id':0,'character':'','text':''}
	];

	var currLine = 0;

	return {
		lines:function () {
			return lineData;
		},
		addLine:function () {
			currLine++;
			lineData.push({'id':currLine,'character':'',text:''});
		},
		deleteLine:function (character) {
			lineData.splice(lineData.indexOf(character),1);
		}
	};
})

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

.controller('LineCtrl', ['$scope', 'lineService', 'charService', function($scope, lineService, charService) {
	$scope.getLines = function () {
		return lineService.lines();
	};

	$scope.addLine = function () {
		return lineService.addLine();
	};

	$scope.deleteLine = function (id) {
		return lineService.deleteLine(id);
	};

	$scope.getChars = function () {
		return charService.chars();
	};

}]);