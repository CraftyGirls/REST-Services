'use strict';

angular.module('scenarioEditor.manageView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/manageView', {
            templateUrl: '/scenario/manageView/',
            controller: 'manageCtrl'
        });
    }])

    .controller('manageCtrl', ['$scope', '$http', 'triggerService', 'scenarioService', 'charService', function ($scope, $http, triggerService, scenarioService, charService) {

        $scope.pendingTrigger = null;
        $scope.triggerPending = false;

        $scope.fetchTriggers = function () {
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

        $scope.scenario = function () {
            return scenarioService.scenario();
        };

        $scope.scenarioTypes = function(){
            return SCENARIO_TYPES;
        };

        $scope.submitTrigger = function () {
            if ($scope.pendingTrigger.id == -1) {
                for (var i = 0; i < triggerService.triggers().length; i++) {
                    if ($scope.pendingTrigger.type == triggerService.triggers()[i].type) {
                        $scope.$emit('showMessage', ['Trigger Name Must Be Unique', 'danger']);
                        return;
                    }
                }
                triggerService.createTrigger($scope.pendingTrigger);
            } else {
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
            if ($scope.pendingTrigger != null && $scope.pendingTrigger) {
                $scope.pendingTrigger = null;
                $scope.triggerPending = false;
            }
        };

        $scope.editTrigger = function (trigger) {
            $scope.pendingTrigger = trigger;
            $scope.triggerPending = true;
        };

        $scope.getDependsOnOptions = function(arg, trigger){
            var options = [];
            if(arg.dataType == "CHARACTER_STATE"){
                for(var i = 0; i < trigger.args.length; i++){
                    if(trigger.args[i].dataType == "CHARACTER"){
                        options.push(trigger.args[i]);
                    }
                }
            }
            return options;
        };

        $scope.showDependsOn = function(arg){
            return arg.dataType == "CHARACTER_STATE";
        }
    }]);