'use strict';

angular.module('scenarioEditor.convoView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/convoView', {
    templateUrl: '/scenario/convoView/',
    controller: 'ConvoCtrl'
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

.controller('ConvoCtrl', ['$scope', 'convoService', function($scope, convoService) {
	$scope.getConvos = function () {
    return convoService.conversations();
  };

  $scope.addConvo = function () {
    convoService.addConversation();
  };

  $scope.editConvo = function (convo) {
    convoService.editConversation(convo);
  };

  $scope.deleteConvo = function (convo) {
    convoService.deleteConversation(convo);
  };

}]);