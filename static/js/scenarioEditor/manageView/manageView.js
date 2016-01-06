'use strict';

angular.module('scenarioEditor.manageView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/manageView', {
            templateUrl: '/scenario/manageView/',
            controller: 'manageCtrl'
        });
    }])

    .controller('manageCtrl', ['$scope', '$http', 'triggerService', function ($scope, $http, triggerService) {

        $scope.pendingTrigger = null;
        $scope.triggerPending = false;

        $scope.fetchTriggers = function(){
          triggerService.fetchTriggers();
        };

        $scope.triggers = function () {
            return triggerService.triggers();
        };

        $scope.dataTypes = function () {
            return triggerService.dataTypes();
        };

        $scope.addTrigger = function () {
            $scope.pendingTrigger = new TriggerResource();
            $scope.triggerPending = true;
        };

        $scope.submitTrigger = function () {
            if($scope.pendingTrigger.id == -1){
                triggerService.createTrigger($scope.pendingTrigger);
            }else {
                triggerService.updateTrigger($scope.pendingTrigger);
            }
            $scope.triggerPending = false;
            $scope.pendingTrigger = null;
        };

        $scope.addArgument = function () {
            if ($scope.pendingTrigger != null) {
                $scope.pendingTrigger.args.push(new TriggerArgumentResource());
            }
        };

        $scope.deleteTrigger = function (trigger) {
            triggerService.deleteTrigger(trigger);
            if($scope.pendingTrigger != null && $scope.pendingTrigger){
                $scope.pendingTrigger = null;
                $scope.triggerPending = false;
            }
        };

        $scope.editTrigger = function (trigger) {
            $scope.pendingTrigger = trigger;
            $scope.triggerPending = true;
        }
    }]);