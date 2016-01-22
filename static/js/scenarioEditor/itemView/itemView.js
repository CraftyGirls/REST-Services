'use strict';

angular.module('scenarioEditor.itemView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/itemView', {
            templateUrl: '/scenario/itemView/',
            controller: 'itemCtrl'
        });
    }])

    .controller('itemCtrl', ['$scope', '$http', 'itemService', 'textureService', 'triggerService', function ($scope, $http, itemService, textureService, triggerService) {
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
            textureService.getTextureById(texture).then(
                function (tex) {
                    $scope.textureUrl = "/scenario/service/gitlab_asset?asset=" + tex.imageUrl;
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
                        var correctedData = response.data;
                        for (var j = 0; j < correctedData.length; j++) {
                            if (correctedData[j].texture != null) {
                                var url = correctedData[j].texture.imageUrl;
                                url = '/scenario/service/gitlab_asset?asset=' + url;
                                correctedData[j].texture.imageUrl = url;
                            }
                        }
                        $scope.itemTextures = correctedData;
                    },
                    function failure(response) {
                        if (response.status == 404) {
                            $scope.itemTextures = [];
                        }
                    }
                );
        }

        function validateTriggers() {
            triggerService.fetchTriggers(function (){
                var errors = [];
                for (var i = 0; i < itemService.items().length; i++) {
                    for (var j = 0; j < itemService.items()[i].effects.length; j++) {
                        if (itemService.items()[i].effects[j].id == -1) {
                            triggerService.assignIdByName(itemService.items()[i].effects[j]);
                        }
                        var messages = triggerService.validateLocalTrigger(itemService.items()[i].effects[j], itemService.items()[i].effects);
                        for(var x = 0; x < messages.length; x++){
                            messages[x] = itemService.items()[i].name + " -> Effects -> " + messages[x];
                        }
                        errors = errors.concat(messages);
                    }
                    for (var k = 0; k < itemService.items()[i].pickupEffects.length; k++) {
                        if (itemService.items()[i].pickupEffects[k].id == -1) {
                            triggerService.assignIdByName(itemService.items()[i].pickupEffects[k]);
                        }
                        var messages = triggerService.validateLocalTrigger(itemService.items()[i].pickupEffects[k], itemService.items()[i].pickupEffects);
                        for(var x = 0; x < messages.length; x++){
                            messages[x] = itemService.items()[i].name + " -> Pickup Effects -> " + messages[x];
                        }
                        errors =  errors.concat(messages);
                    }
                }
                for(var i = 0; i < errors.length; i++){
                    $scope.$emit('showMessage', [errors[i], 'danger']);
                }
            });
        }
        validateTriggers();
    }]);