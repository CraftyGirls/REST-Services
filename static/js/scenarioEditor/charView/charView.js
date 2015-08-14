'use strict';

angular.module('scenarioEditor.charView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/charView', {
    templateUrl: 'charView/charView.html',
    controller: 'CharCtrl'
  });
}])

.service('convoService', function () {
    var convoData = [
        {'id':0,'name':'Conversation 0'}
    ];

    var currConversation = 0;

    return {
        conversations:function () {
            return convoData;
        },
        addConversation:function () {
            currConversation++;
            convoData.push({'id':currConversation,'name':'Conversation '+currConversation});
        },
        editConversation:function (convo) {
            //TODO: Make this work
        },
        deleteConversation:function (convo) {
          convoData.splice(convoData.indexOf(convo),1);
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
			charData.push({'id':charId,'name':'','states':[]});
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

.controller('CharCtrl', ['$scope', 'charService', 'convoService', function($scope, charService, convoService) {
	$scope.editVisible = false;

	$scope.stateId = 0;

	$scope.currBodyPart = "";
	$scope.editBodyPartVisible = false;

	$scope.getChars = function () {
		return charService.chars();
	};

	$scope.addChar = function () {
		return charService.addChar();
	};

	$scope.deleteChar = function (chara) {
		return charService.deleteChar(chara);
	};

	$scope.editChar = function (chara) {
		$scope.editVisible = true;
		$scope.stateId = charService.getStatesLength(chara);
		return charService.editChar(chara);
	};

	$scope.getCurrChar = function () {
		return charService.getCurrChar();
	};

	$scope.getConvos = function () {
		return convoService.conversations();
	};

	$scope.getStates = function (character) {
		return character.states;
	};

	$scope.addState = function (character) {
		$scope.stateId++;
		return charService.addStateToChar(character,$scope.stateId);
	};

	$scope.deleteState = function (character,state) {
		character.states.splice(character.states.indexOf(state),1);
	};

	$scope.editBodyPart = function (name) {
		$scope.editBodyPartVisible = true;
		$scope.currBodyPart = name;
	}

	$scope.closeBodyPart = function () {
		$scope.editBodyPartVisible = false;
	}


}]);