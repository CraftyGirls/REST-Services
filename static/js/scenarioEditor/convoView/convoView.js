'use strict';

angular.module('scenarioEditor.convoView', ['ngRoute', 'scenarioServices'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/convoView', {
    templateUrl: '/scenario/convoView/',
    controller: 'ConvoCtrl'
  });
}])

.controller('ConvoCtrl', ['$scope', 'convoService', function($scope, convoService) {
	
	$scope.editVisible = false;
	
	$scope.getConvos = function () {
    return convoService.conversations();
  };

  $scope.addConvo = function () {
    convoService.addConversation();
  };
  
  $scope.addLine = function (dialogue) {
    convoService.addLine(dialogue)
  }

  $scope.editConvo = function (convo) {
    convoService.editConversation(convo);
    $scope.editVisible = true;
  };

  $scope.deleteConvo = function (convo) {
    convoService.deleteConversation(convo);
    if(convoService.conversations().length == 0){
      $scope.editVisible = false;
    }
  };
  
  $scope.addDialogue = function(convo){
    convoService.addDialogue(convo)
  }
  
  $scope.getCurrentCovnversation = function(){
    return convoService.getCurrentCovnversation();
  }
  
  $scope.addTrigger = function(dialogue) {
    convoService.addTrigger(dialogue);
  }
  
  $scope.addArg = function(trigger) {
    convoService.addArg(trigger);
  }

}])

.directive('dialogue', function() {
  return {
    templateUrl: function(elem, attr){
      return '/scenario/dialogue';
    }
  };
});

