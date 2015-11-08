'use strict';

angular.module('scenarioEditor.convoView', ['ngRoute', 'scenarioServices'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/convoView', {
    templateUrl: '/scenario/convoView/',
    controller: 'ConvoCtrl'
  });
}])

  .controller('ConvoCtrl', ['$scope', 'convoService', function($scope, convoService) {
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
    };
  
    $scope.deleteConvo = function (convo) {
      convoService.deleteConversation(convo);
    };
    
    $scope.addDialogue = function(convo){
      convoService.addDialogue(convo)
    }
    
    $scope.getCurrentCovnversation = function(){
      return convoService.getCurrentCovnversation();
    }

  }])
  
  .directive('dialogue', function() {
    return {
      templateUrl: function(elem, attr){
        return '/scenario/dialogue';
      }
    };
  });
  