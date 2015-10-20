'use strict';

angular.module('scenarioEditor.roomView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/roomView', {
                templateUrl: '/scenario/roomView/',
                controller: 'roomCtrl'
            });
    }])
    
    .controller('roomCtrl', ['$scope', function($scope) {
      
      
    }]);
