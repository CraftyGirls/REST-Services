'use strict';

angular.module('scenarioEditor.lineView', ['ngRoute', 'scenarioServices'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/lineView', {
    templateUrl: '/scenario/lineView/',
    controller: 'LineCtrl'
  });
}])

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