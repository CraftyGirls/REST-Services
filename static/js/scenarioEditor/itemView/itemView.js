'use strict';

angular.module('scenarioEditor.itemView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/itemView', {
            templateUrl: '/scenario/itemView/',
            controller: 'itemCtrl'
        });
    }])

    .controller('itemCtrl', ['$scope', '$http', 'itemService', function($scope, $http, itemService) {
        $scope.editVisible = false;

        $scope.itemTextures = [];

        $scope.itemQuery      = {};
        $scope.itemQuery.name = null;
        $scope.itemQuery.tags = null;

        $scope.getItems = function () {
            return itemService.items();
        };

        $scope.addItem = function () {
            itemService.addItem();
        };

        $scope.editItem = function (item) {
            itemService.editItem(item);
            $scope.editVisible = true;
        };

        $scope.currentItem = function(){
            return itemService.getCurrentItem();
        };

        $scope.addEffect = function(){
            itemService.addEffect($scope.currentItem());
        };

        $scope.addArg = function(trigger){
            trigger.addArg();
        };

        $scope.editTexture = function(){
            getItemTextures(null, null);
        };

        $scope.selectTexture = function(item){
            $scope.currentItem().texture = item.texture;
        };

        $scope.queryChanged = function(){
            getItemTextures($scope.itemQuery.tags, $scope.itemQuery.name);
        };

        function getItemTextures(tags, name){
            var params = {};
            if(tags != null && tags.length > 0){
                params["tags"] = tags;
            }
            if(name != null && name.length > 0){
                params["name"] = name;
            }
            $http.get("/scenario/service/item", {
                    params : params
                })
                .then(function success(response){
                        $scope.itemTextures = response.data;
                        console.log("here");
                    },
                    function failure(response){
                        console.log("Failure");
                    }
                );
        }

    }]);