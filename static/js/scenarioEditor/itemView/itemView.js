'use strict';

angular.module('scenarioEditor.itemView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/itemView', {
                templateUrl: '/scenario/itemView/',
                controller: 'itemCtrl'
            });
    }])
    
    .controller('itemCtrl', ['$scope', function($scope) {
      
    }])