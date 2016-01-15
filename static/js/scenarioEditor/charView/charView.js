'use strict';

angular.module('scenarioEditor.charView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/charView', {
            templateUrl: '/scenario/charView/',
            controller: 'CharCtrl'
        });
    }])

    .controller('CharCtrl', ['$scope', '$http', 'charService', 'convoService', 'itemService', 'jointService', 'textureService', function ($scope, $http, charService, convoService, itemService, jointService, textureService) {
        $scope.editVisible = false;

        $scope.currBodyPart = "";
        $scope.editBodyPartVisible = false;

        $scope.nameQuery = null;
        $scope.tagsQuery = null;

        $scope.componentSets = [];

        $scope.selectedItem = null;

        $scope.charToImgMap = {};

        $scope.getChars = function () {
            return charService.chars();
        };

        $scope.addChar = function () {
            charService.addChar();
            var char = charService.chars()[charService.chars().length - 1];
            $scope.charToImgMap[char.id] = {
                HEAD: [],
                LEFT_ARM: [],
                RIGHT_ARM: [],
                TORSO: [],
                PELVIS: [],
                LEFT_LEG: [],
                RIGHT_LEG: []
            }
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
            return charService.addStateToChar(character, $scope.stateId);
        };

        $scope.deleteState = function (character, state) {
            character.states.splice(character.states.indexOf(state), 1);
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

        $scope.queryChanged = function () {
            $scope.getComponentImages($scope.currBodyPart, $scope.tagsQuery, $scope.nameQuery);
        };

        $scope.selectComponent = function (component) {
            $scope.updateTexture(charService.getCurrChar(), component.setType, component.jsonRepresentation);
        };

        $scope.updateTexture = function(char, component, jsonUrl){

            charService.setComponentSourceForType(char, $scope.currBodyPart, jsonUrl);

            if(jsonUrl != "" && jsonUrl != undefined) {
                jointService.getJoint(jsonUrl).then(
                    // Success
                    function (joint) {
                        for (var i = 0; i < joint.textures.length; i++) {
                            textureService.getTextureById(joint.textures[i].id).then(
                                function (texture) {
                                    $scope.charToImgMap[char.id][component].push(texture);
                                },
                                function (response) {
                                }
                            )
                        }
                    },
                    // Failure
                    function (response) {

                    }
                );
                $scope.closeBodyPart();
            }
        };

        $scope.updateTextures = function(char){
            $scope.updateTexture(char, "HEAD", char.getComponentForType("HEAD").src);
            $scope.updateTexture(char, "TORSO", char.getComponentForType("TORSO").src);
            $scope.updateTexture(char, "LEFT_ARM", char.getComponentForType("LEFT_ARM").src);
            $scope.updateTexture(char, "RIGHT_ARM", char.getComponentForType("RIGHT_ARM").src);
            $scope.updateTexture(char, "PELVIS", char.getComponentForType("PELVIS").src);
            $scope.updateTexture(char, "LEFT_LEG", char.getComponentForType("LEFT_LEG").src);
            $scope.updateTexture(char, "RIGHT_LEG", char.getComponentForType("RIGHT_LEG").src);
        };

        $scope.getTexturesForComponent = function (char, component) {
            if (char != null) {
                console.log(char);
                if (!$scope.charToImgMap.hasOwnProperty(char.id)) {
                    $scope.charToImgMap[char.id] = {
                        HEAD: [],
                        LEFT_ARM: [],
                        RIGHT_ARM: [],
                        TORSO: [],
                        PELVIS: [],
                        LEFT_LEG: [],
                        RIGHT_LEG: []
                    }
                }
                return $scope.charToImgMap[char.id][component];
            } else {
                return [];
            }
        };

        $scope.getTextureUrlsForComponent = function (component) {
            console.log("HERE");
            jointService.getJoint(charService.getCurrChar().getComponentForType(component));
        };

        $scope.$watch(
         'charToImgMap', function(){
                console.log("HERE");;
            }
        );

        $scope.getUnusedItems = function () {
            var items = itemService.getUnusedItems();
            if (items.length > 0) {
                $scope.selectedItem = items[0].id;
            }
            return items;
        };

        $scope.addSelectedItem = function () {
            if ($scope.selectedItem != null) {
                $scope.getCurrChar().items.push($scope.selectedItem);
            }
        };

        $scope.itemsForCurrentChar = function () {
            var itemObjs = [];
            if (charService.getCurrChar() != null) {
                for (var i = 0; i < charService.getCurrChar().items.length; i++) {
                    itemObjs.push(itemService.getById(charService.getCurrChar().items[i]));
                }
            }
            return itemObjs;
        };

        $scope.getComponentImages = function (setType, tags, name) {
            var params = {};
            if (setType != null && setType.length > 0) {
                var s = setType;
                var splitSetType = setType.split("_");
                if (splitSetType.length > 1) {
                    s = splitSetType[1];
                }
                params["setType"] = s;
            }
            if (tags != null && tags.length > 0) {
                params["tags"] = tags;
            }
            if (name != null && name.length > 0) {
                params["name"] = name;
            }
            $http.get("/scenario/service/component_set", {
                    params: params
                })
                .then(function success(response) {
                        $scope.componentSets = response.data;
                    },
                    function failure(response) {
                        console.log("Failure");
                    }
                );
        };

        $scope.getChars = function(){
          return charService.chars();
        };

        $scope.$watch('getChars()', function () {
            for (var i = 0; i < charService.chars().length; i++) {
                $scope.updateTextures(charService.chars()[i]);
            }
        });
    }]);

