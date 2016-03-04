'use strict';

angular.module('scenarioEditor.roomView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/roomView', {
                templateUrl: '/scenario/roomView/',
                controller: 'roomCtrl'
            });
    }])
    
    .controller('roomCtrl', ['$scope', 'roomService', 'charService', 'itemService',
        function($scope, roomService, charService, itemService) {

		$scope.editVisible = false;

        $scope.selectedChar = null;
        $scope.selectedItem = null;

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

		$scope.currentRoom = function(){
            return roomService.getCurrentRoom();
        };

        $scope.rooms = function(){
            return roomService.getRooms();
        };

        $scope.addSelectedChar = function(){
            if($scope.selectedChar != null){
                $scope.currentRoom().characters.push($scope.selectedChar);
            }
        };

        $scope.charactersForCurrentRoom = function(){
            var charObjs = [];
            if(roomService.getCurrentRoom() != null) {
                for (var i = 0; i < roomService.getCurrentRoom().characters.length; i++) {
                    charObjs.push(charService.getById(roomService.getCurrentRoom().characters[i]));
                }
            }
            return charObjs;
        };

        $scope.getUnusedCharacters = function(){
            var allIds  = charService.getIds();
            var usedIds = [0];
            for(var i = 0; i < roomService.getRooms().length; i++){
                for(var j = 0; j < roomService.getRooms()[i].characters.length; j++){
                    usedIds.push(roomService.getRooms()[i].characters[j]);
                }
            }
            for(var x = 0; x < usedIds.length; x++){
                var idx = allIds.indexOf(usedIds[x]);
                allIds.splice(idx, 1);
            }
            var chars = [];
            for(var c = 0; c < allIds.length; c++){
                chars.push(charService.getById(allIds[c]));
            }
            if($scope.selectedChar == null && chars.length > 0){
                $scope.selectedChar = chars[0].id;
            }
            return chars;
        };


        $scope.addSelectedItem = function(){
            if($scope.selectedItem != null){
                $scope.currentRoom().items.push($scope.selectedItem);
            }
        };

        $scope.itemsForCurrentRoom = function(){
            var itemObjs = [];
            if(roomService.getCurrentRoom() != null) {
                for (var i = 0; i < roomService.getCurrentRoom().items.length; i++) {
                    itemObjs.push(itemService.getById(roomService.getCurrentRoom().items[i]));
                }
            }
            return itemObjs;
        };

        $scope.getUnusedItems = function(){
            var items = itemService.getUnusedItems();
            if (items.length > 0) {
                $scope.selectedItem = items[0].id;
            }
            return items;
        };

        $scope.onTypeChange = function(){
            $scope.currentRoom().size = roomService.getRoomTypeOptions()[$scope.currentRoom().furnitureTypes][0]; 
        }
            
        $scope.roomSizes = function(){
            if($scope.currentRoom() != null && $scope.currentRoom() != undefined){
                return roomService.getRoomTypeOptions()[$scope.currentRoom().furnitureTypes];
            }else{
                return roomService.getRoomTypeOptions()['RANDOM'];
            }
        }
        
        $scope.roomTypes = function(){
            return roomService.getRoomTypeOptions();
        }
    }]);
