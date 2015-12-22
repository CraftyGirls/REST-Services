'use strict';

angular.module('scenarioEditor.itemView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/itemView', {
                templateUrl: '/scenario/itemView/',
                controller: 'itemCtrl'
            });
    }])
    
    .controller('itemCtrl', ['$scope', 'itemService', function($scope, itemService) {
  		$scope.editVisible = false;
	
		$scope.getItems = function () {
		    return itemService.items();
		};

	 	$scope.addItem = function () {
			itemService.addItem();
	  	};

	  	$scope.editItem = function (item) {
    		itemService.editItem(item);
    		$scope.editVisible = true;
  		};
    }])