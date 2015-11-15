'use strict';

angular.module('scenarioEditor.charView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/charView', {
            templateUrl: '/scenario/charView/',
            controller: 'CharCtrl'
        });
    }])

    .controller('CharCtrl', ['$scope', 'charService', 'convoService', function($scope, charService, convoService) {
        $scope.editVisible = false;

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
            return charService.addStateToChar(character,$scope.stateId);
        };

        $scope.deleteState = function (character,state) {
            character.states.splice(character.states.indexOf(state),1);
        };

        $scope.editBodyPart = function (name) {
            $scope.editBodyPartVisible = true;
            $scope.currBodyPart = name;
        };

        $scope.closeBodyPart = function () {
            $scope.editBodyPartVisible = false;
        };
    }])
    

