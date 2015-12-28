'use strict';

angular.module('scenarioEditor.roomView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/roomView', {
                templateUrl: '/scenario/roomView/',
                controller: 'roomCtrl'
            });
    }])
    
    .controller('roomCtrl', ['$scope', 'roomService', 'charService', function($scope, roomService, charService) {
		$scope.editVisible = false;

        $scope.selectedChar = null;

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
                var unusedChar = $scope.getUnusedCharacters();
                if(unusedChar.length > 0){
                    $scope.selectedChar = unusedChars[0].id;
                }else{
                    $scope.selectedChar = null;
                }
            }
        };

        $scope.charactersForCurrRoom = function(){
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
            var usedIds = [];
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
            return chars;
        }
    }]);
