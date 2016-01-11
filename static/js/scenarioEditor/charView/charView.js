'use strict';

angular.module('scenarioEditor.charView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/charView', {
            templateUrl: '/scenario/charView/',
            controller: 'CharCtrl'
        });
    }])

    .controller('CharCtrl', ['$scope', '$http', 'charService', 'convoService', 'itemService', function($scope, $http, charService, convoService, itemService) {
        $scope.editVisible = false;

        $scope.currBodyPart = "";
        $scope.editBodyPartVisible = false;

        $scope.nameQuery = null;
        $scope.tagsQuery = null;

        $scope.componentSets = [];

        $scope.selectedItem = null;

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
            $scope.componentSets = [];
            $scope.nameQuery = null;
            $scope.tagsQuery = null;
            $scope.editBodyPartVisible = true;
            $scope.currBodyPart = name;
            $scope.getComponentImages(name, null, null);
        };

        $scope.closeBodyPart = function () {
            $scope.editBodyPartVisible = false;
        };

        $scope.queryChanged = function(){
            $scope.getComponentImages($scope.currBodyPart, $scope.tagsQuery, $scope.nameQuery);
        };

        $scope.selectComponent = function(component){
            charService.getCurrChar().components[$scope.currBodyPart] = component;
            $scope.closeBodyPart();
        };

        $scope.getUnusedItems = function(){
            var items = itemService.getUnusedItems();
            if (items.length > 0) {
                $scope.selectedItem = items[0].id;
            }
            return items;
        };

        $scope.addSelectedItem = function(){
            if($scope.selectedItem != null){
                $scope.getCurrChar().items.push($scope.selectedItem);
            }
        };

        $scope.itemsForCurrentChar = function(){
            var itemObjs = [];
            if(charService.getCurrChar() != null) {
                for (var i = 0; i < charService.getCurrChar().items.length; i++) {
                    itemObjs.push(itemService.getById(charService.getCurrChar().items[i]));
                }
            }
            return itemObjs;
        };

        $scope.getComponentImages = function(setType, tags, name){
            var params = {};
            if(setType != null && setType.length > 0){
                var s = setType;
                var splitSetType = setType.split("_");
                if(splitSetType.length > 1){
                    s = splitSetType[1];
                }
                params["setType"] = s;
            }
            if(tags != null && tags.length > 0){
                params["tags"] = tags;
            }
            if(name != null && name.length > 0){
                params["name"] = name;
            }
            $http.get("/scenario/service/component_set", {
                params : params
            })
            .then(function success(response){
                    $scope.componentSets = response.data;
                },
                function failure(response){
                    console.log("Failure");
                }
            );
        };
    }]);

