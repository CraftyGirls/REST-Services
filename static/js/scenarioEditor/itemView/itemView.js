'use strict';

angular.module('scenarioEditor.itemView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/itemView', {
            templateUrl: '/scenario/itemView/',
            controller: 'itemCtrl'
        });
    }])

    .controller('itemCtrl', ['$scope', '$http', 'itemService', 'textureService', function ($scope, $http, itemService, textureService) {
        $scope.editVisible = false;

        $scope.itemTextures = [];

        $scope.itemQuery = {};
        $scope.itemQuery.name = null;
        $scope.itemQuery.tags = null;

        $scope.textureUrl = "";

        $scope.getItems = function () {
            return itemService.items();
        };

        $scope.addItem = function () {
            itemService.addItem();
        };

        $scope.editItem = function (item) {
            itemService.editItem(item);
            $scope.editVisible = true;
            $scope.textureUrl = "";
            if (item.texture != -1) {
                $scope.selectTexture(item.texture, item);
            }
        };

        $scope.currentItem = function () {
            return itemService.getCurrentItem();
        };

        $scope.addEffect = function () {
            itemService.addEffect($scope.currentItem());
        };

        $scope.addArg = function (trigger) {
            trigger.addArg();
        };

        $scope.editTexture = function () {
            getItemTextures(null, null);
        };

        $scope.selectTexture = function (texture, item) {
            console.log(texture);
            textureService.getTextureById(texture).then(
                function (tex) {
                    $scope.textureUrl = tex.imageUrl;
                    item.texture = tex.id;
                },
                function (response) {

                }
            );
        };

        $scope.queryChanged = function () {
            getItemTextures($scope.itemQuery.tags, $scope.itemQuery.name);
        };

        $scope.updateArg = function (argParent, input, oldKey) {
            console.log(input);
            var newKey = document.getElementById(input).value;
            // Work with json to maintain property order
            var asJson = JSON.stringify(argParent.args);
            asJson = asJson.replace(oldKey, newKey);
            argParent.args = JSON.parse(asJson);
        };

        function getItemTextures(tags, name) {
            var params = {};
            if (tags != null && tags.length > 0) {
                params["tags"] = tags;
            }
            if (name != null && name.length > 0) {
                params["name"] = name;
            }
            $http.get("/scenario/service/item", {
                    params: params
                })
                .then(function success(response) {
                        $scope.itemTextures = response.data;
                    },
                    function failure(response) {
                        if (response.status == 404) {
                            $scope.itemTextures = [];
                        }
                    }
                );
        }

    }]);