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
        $scope.animations = [
            "WAVE",
            "DANCE_1",
            "DANCE_2",
            "CROSS_ARMS",
            "SICK_1",
            "IDLE_TALK_1",
            "IDLE_TALK_2",
            "IDLE_TALK_3",
            "WALK_1",
            "WALK_2",
            "DRUNK_WALK_1",
            "DRUNK_WAVE_1",
            "FLAILING",
            "SWAY",
            "JUMPING_JACKS",
            "BUTLER",
            "DEAD"
        ];

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
            $scope.updateTexture(charService.getCurrChar(), $scope.currBodyPart, component.jsonRepresentation);
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
                                    try {
                                        if($scope.charToImgMap.hasOwnProperty(char.id) && $scope.charToImgMap[char.id].hasOwnProperty(component)){
                                            $scope.charToImgMap[char.id][component].push(texture);
                                        }
                                    }catch (err){
                                        //console.log(err);
                                    }
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
            jointService.getJoint(charService.getCurrChar().getComponentForType(component));
        };

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
                        var correctedData = response.data;
                        $scope.componentSets = correctedData;
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

        $scope.clearComponent = function(component){
            charService.getCurrChar().getComponentForType(component).src = "";
            $scope.charToImgMap[charService.getCurrChar().id][component] = [];
        };
        
        $scope.getVoices = function(){
            var voices = {
                1 : 'Male - "EEEE"',
                2 : 'Male - "AHH"',
                3 : 'Male - "ooawh"',
                4 : 'High Pitch Male - "AH" like a bird',
                5 : 'Male - "Ahh" like at the dentist, fast',
                6 : 'Low Male - "ooo" dumb sounding',
                7 : 'Male - "Ehh" dumb sounding, like you\'ve moved your tounge to the back of your throat',
                8 : 'Low Male - "Ooeh" dumb sounding',
                9 : 'Low Male - "Ah" dumb sounding',
                10 : '"Wuaaah" - kinda sounds like a duck quack',
                11 : '"Khaah" - kinda sounds like a duck quack kinda',
                12 : 'Low Male - "eh" dumb sounding',
                13 : '"Ueeeeh" - kinda sounds like a duck quack',
                14 : 'Cat - "Wuuhh" ',
                15 : 'Cat - "Neeeeuh"',
                16 : 'Cat- "Neeh"',
                17 : 'Cat- "Meow"',
                18 : 'Low Male - "Boum"',
                19 : 'Male - "Buaop"',
                20 : 'Male - Kinda sounds like a seal "arf"',
                21 : 'Low Male - "Orw"',
                22 : 'Male - "Oowh"',
                23 : 'Male - "Arl"',
                24 : 'High Male - "Mah"',
                25 : 'High Male -  "Mowh"',
                26 : 'Male - "Ehh" - sounds annoyed',
                27 : 'Male - "Grrrrah" - sounds annoyed/mad',
                28 : 'Male - "Uhh" - sounds dumb/scared',
                29 : 'High Robot - 1 beep',
                30 : 'High Robot - Wobbly Squeek + fade down',
                31 : 'High Robot - Wobbly Squeek + fade up',
                32 : 'Robot - Extra Wobble',
                33 : 'High Robot  - Bing',
                34 : 'Robot - Bing',
                35 : 'Lower Robot - Bing',
                36 : 'Low Robot - Boop',
            }
            
            
            return voices;
        }

        for(var i = 0; i < charService.chars().length; i++){
            $scope.updateTextures(charService.chars()[i]);
            
        }

    }]);

