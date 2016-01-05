'use strict';

angular.module('scenarioEditor.manageView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/manageView', {
            templateUrl: '/scenario/manageView/',
            controller: 'manageCtrl'
        });
    }])

    .controller('manageCtrl', ['$scope', '$http', function ($scope, $http) {

    }]);