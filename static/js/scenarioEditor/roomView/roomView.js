'use strict';

angular.module('scenarioEditor.roomView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/roomView', {
                templateUrl: '/scenario/roomView/',
                controller: 'roomCtrl'
            });
    }])
    
    .controller('roomCtrl', ['$scope', 'roomService', function($scope, roomService) {
		$scope.editVisible = false;
	
		$scope.getRooms = function () {
		    return roomService.rooms();
		};

	 	$scope.addRoom = function () {
			roomService.addRoom();
	  	};

	  	$scope.editRoom = function (room) {
    		roomService.editRoom(room);
    		$scope.editVisible = true;
  		};      
      
    }]);
