'use strict';

angular.module('scenarioEditor.lineView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/lineView', {
    templateUrl: '/scenario/lineView/',
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
			lineData.push({'id':currLine,'character':'','text':''});
		},
		deleteLine:function (character) {
			lineData.splice(lineData.indexOf(character),1);
		}
	};
})

.service('charService', function () {
	var charData = [];

	var charId = 0;

	var currChar = 0;

	return {
		chars:function () {
			return charData;
		},
		addChar:function () {
			charId++;
			charData.push({'id':charId,'name':'','states':[] });
		},
		deleteChar:function (character) {
			charData.splice(charData.indexOf(character),1);
		},
		editChar:function (character) {
			currChar = character.id;
		},
		getCurrChar:function () {
			return currChar;
		},
		addStateToChar:function (character,id) {
			charData[charData.indexOf(character)].states.push({'id':id,'name':'','convoId':0});
		},
		getStatesLength:function (character) {
			return charData[charData.indexOf(character)].states.length;
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