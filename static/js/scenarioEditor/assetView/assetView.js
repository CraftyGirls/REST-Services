'use strict';

angular.module('scenarioEditor.assetView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/assetView', {
                templateUrl: '/scenario/assetView/',
                controller: 'assetCtrl'
            });
    }])
    
    .controller('assetCtrl', ['$scope', function($scope) {
      
      
    }]);
