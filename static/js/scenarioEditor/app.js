'use strict';

// Declare app level module which depends on views, and components
var application = angular.module('scenarioEditor', [
        'ngRoute',
        'scenarioEditor.charView',
        'scenarioEditor.convoView',
        'scenarioEditor.assetView',
        'scenarioEditor.roomView',
        'scenarioEditor.itemView',
        'scenarioEditor.manageView',
        'scenarioEditor.version',
        'scenarioServices'
    ])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.otherwise({
                redirectTo: '/charView'
            });
        }
    ])
    .config(['$interpolateProvider',
        function ($interpolateProvider) {
            $interpolateProvider.startSymbol('{$');
            $interpolateProvider.endSymbol('$}');
        }
    ])
    .config(['$httpProvider',
        function ($httpProvider) {
            $httpProvider.defaults.xsrfCookieName = 'csrftoken';
            $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        }
    ])
    .directive('ngConfirmClick', [
        function () {
            return {
                link: function (scope, element, attr) {
                    var msg = "Are you sure?";
                    var clickAction = attr.ngClick;
                    element.bind('click', function (event) {
                        if (window.confirm(msg)) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
        }
    ])
    .directive('sweetDelete', [
        function () {
            return {
                scope: {
                    variable: "=",
                    container: "=",
                    confirm: "="
                },
                template: '<span class="glyphicon glyphicon-remove clickable hover-fade" ng-click="sweetDelete()"></span>',
                link: function ($scope, iElm, iAttrs, controller) {
                    $scope.sweetDelete = function () {
                        this.del = function () {
                            var idx = $scope.container.indexOf($scope.variable);
                            if (idx !== -1) {
                                $scope.container = $scope.container.splice(idx, 1);
                            }
                        };

                        if ($scope.confirm == true) {
                            var msg = "Are you sure?";
                            if (window.confirm(msg)) {
                                $scope.$eval(this.del());
                            }
                        } else {
                            this.del();
                        }
                    }
                }
            };
        }
    ])
    .directive('sweetKeyedDelete', [
        function () {
            return {
                scope: {
                    key: "=",
                    container: "="
                },
                transclude: true,
                template: '<span class="glyphicon glyphicon-remove clickable hover-fade" ng-click="sweetKeyedDelete()"></span>',
                link: function ($scope, iElm, iAttrs, controller) {
                    $scope.sweetKeyedDelete = function () {
                        delete $scope.container[$scope.key];
                    }
                }
            };
        }
    ])
    .directive('sweetTriggerArg', ['$compile', 'roomService', 'charService', 'itemService', 'convoService',
        function ($compile, roomService, charService, itemService, convoService) {
            return {
                scope: {
                    type: "@sweetType",
                    trigger: "=sweetTrigger",
                    field: "@sweetField",
                    dependsOn:"@sweetDependsOn"
                },
                transclude: true,
                template: '<div class="row"><div class="col-sm-1 right-justify"><span>{$field$} = </span></div></div>',
                link: function ($scope, iElm, iAttrs, controller) {

                    $scope.getChars = function () {
                        return charService.chars();
                    };

                    $scope.getRooms = function () {
                        return roomService.rooms();
                    };

                    $scope.getItems = function () {
                        return itemService.items();
                    };

                    $scope.getConvos = function () {
                        return convoService.conversations();
                    };

                    $scope.getStates = function(id){
                        return charService.getById(id).states;
                    };

                    $scope.getDependsOnOptions = function(){
                        if($scope.trigger.args[$scope.field].type == 'CHARACTER_STATE'){
                            var charId = $scope.trigger.args[$scope.trigger.args[$scope.field].dependsOn].value;
                            console.log(charId);
                            var char = charService.getById(charId);
                            if(char != null){
                                return char.states;
                            }
                        }
                        return [];
                    };

                    if (!$scope.trigger.args.hasOwnProperty($scope.field)) {
                        $scope.trigger.args[$scope.field] = null;
                    }

                    var input = "";

                    switch ($scope.type) {
                        case 'STRING':
                            input = '<input type="text" ng-model="trigger.args.' + $scope.field + '.value"/>';
                            break;
                        case 'INT' :
                            input = '<input type="number" ng-model="trigger.args.' + $scope.field + '.value"/>';
                            break;
                        case 'FLOAT' :
                            input = '<input type="number" ng-model="trigger.args.' + $scope.field + '.value"/>';
                            break;
                        case 'CHARACTER' :
                            input = '<select ng-options="char.id as char.name for char in getChars()" ng-model="trigger.args.' + $scope.field + '.value">' +
                                '<option selected value="">Select Character</option>' +
                                '</select>';

                            break;
                        case 'ITEM' :
                            input = '<select ng-options="item.id as item.name for item in getItems()" ng-model="trigger.args.' + $scope.field + '.value">' +
                                '<option selected value="">Select Item</option>' +
                                '</select>';
                            break;
                        case 'ROOM' :
                            input = '<select ng-options="room.id as room.name for room in getRooms()" ng-model="trigger.args.' + $scope.field + '.value">' +
                                '<option selected value="">Select Room</option>' +
                                '</select>';
                            break;
                        case 'CONVERSATION' :
                            input = '<select ng-options="convo.id as convo.name for convo in getConvos()" ng-model="trigger.args.' + $scope.field + '.value">' +
                                '<option selected value="">Select Convo</option>' +
                                '</select>';
                            break;
                        case 'CHARACTER_STATE':
                            input = '<select ng-options="state.id as state.name for state in getDependsOnOptions()" ng-model="trigger.args.' + $scope.field + '.value">' +
                                '<option selected value="">Select State</option>' +
                                '</select>';
                    }
                    $(iElm).find(".row").append($compile("<div class='col-sm-1'>" + input + "</div>")($scope));
                }
            }
        }
    ])
    .directive('sweetTriggerSelector', ['$compile', 'triggerService', 'charService', function ($compile, triggerService, charService) {
        return {
            scope: {
                target: "=sweetTarget"
            },
            transculde: true,
            template: "<div class='row'><div class='col-sm-1'><select ng-change='typeChanged()' ng-options='trigger as trigger.type for trigger in getTriggers()' ng-model='selected'></select></div>" +
            "<div class='col-sm-1'><span class='glyphicon glyphicon-plus clickable hover-click' ng-click='addTrigger()'></span></div></div>",
            link: function ($scope, iElm, iAttrs, controller) {

                $scope.getTriggers = function () {
                    return triggerService.triggers();
                };

                $scope.getChars = function(){
                    return charService.chars();
                };

                $scope.addTrigger = function () {
                    var trigger = new Trigger();
                    trigger.type = $scope.selected.type;
                    for (var i = 0; i < $scope.selected.args.length; i++) {
                        trigger.addArg($scope.selected.args[i].field, $scope.selected.args[i].dataType,  $scope.selected.args[i].dependsOn) ;
                    }
                    $scope.target.push(trigger);
                };

                triggerService.fetchTriggers(function () {
                    if ($scope.selected == null) {
                        var trigs = triggerService.triggers();
                        if (trigs.length > 0) {
                            $scope.selected = trigs[0];
                        }
                    }
                });
            }
        }
    }])
    .directive('sweetTags', [function () {
        return {
            scope: {
                target: "=sweetTarget"
            },
            replace:true,
            template:
            "<div>" +
            "<div class='row padded-top-bottom-10'><div class='col-md-6'><strong>Excluded</strong></div></div>" +
            "<div class='row' ng-repeat='tag in target.not track by $index'>" +
            "<div class='col-sm-2'>" +
            "<span>{$target.not[$index]$}<span/>" +
            "</div>" +
            "<div class='col-sm-1'><sweet-delete variable='target.not[$index]' container='target.not'></sweet-delete></div>" +
            "</div>" +
            "<div class='row'><div class='col-sm-11'><input type='text' ng-model='pendingNot'/></div><div class='col-sm-1'><span ng-click='addNot()' class='glyphicon glyphicon-plus clickable hover-fade'></span></div></div>" +
            "<div class='row padded-top-bottom-10'><div class='col-md-6'><strong>Required</strong></div></div>" +
            "<div class='row' ng-repeat='tag in target.required track by $index'>" +
            "<div class='col-sm-2'>" +
            "<span>{$target.required[$index]$}<span/>" +
            "</div>" +
            "<div class='col-sm-1'><sweet-delete variable='target.required[$index]' container='target.required'></sweet-delete></div>" +
            "</div>" +
            "<div class='row'><div class='col-sm-11'><input type='text' ng-model='pendingRequired'/></div><div class='col-sm-1'><span ng-click='addRequired()' class='glyphicon glyphicon-plus clickable hover-fade'></span></div></div>" +
            "<div class='row padded-top-bottom-10'><div class='col-md-6'><strong>Preferred</strong></div></div>" +
            "<div class='row' ng-repeat='tag in target.preferred track by $index'>" +
            "<div class='col-sm-2'>" +
            "<span>{$target.preferred[$index]$}<span/>" +
            "</div>" +
            "<div class='col-sm-1'><sweet-delete variable='target.preferred[$index]' container='target.preferred'></sweet-delete></div>" +
            "</div>" +
            "<div class='row'><div class='col-sm-11'><input type='text' ng-model='pendingPreferred'/></div><div class='col-sm-1'><span ng-click='addPreferred()' class='glyphicon glyphicon-plus clickable hover-fade'></span></div></div>" +
            "</div>",
            link: function ($scope, iElm, iAttrs, controller) {
                $scope.pendingNot = "";
                $scope.pendingPreferred = "";
                $scope.pendingRequired = "";

                $scope.addNot = function () {
                    if ($scope.pendingNot != "" && !exists($scope.pendingNot)) {
                        $scope.target.not.push($scope.pendingNot);
                        $scope.pendingNot = "";
                    }
                };

                $scope.addPreferred = function () {
                    if ($scope.pendingPreferred != "" && !exists($scope.pendingPreferred)) {
                        $scope.target.preferred.push($scope.pendingPreferred);
                        $scope.pendingPreferred = "";
                    }
                };

                $scope.addRequired = function () {
                    if ($scope.pendingRequired != "" && !exists($scope.pendingRequired)) {
                        $scope.target.required.push($scope.pendingRequired);
                        $scope.pendingRequired = "";
                    }
                };

                function exists(val){
                    return(
                           $scope.target.required.indexOf(val) != -1
                        || $scope.target.preferred.indexOf(val) != -1
                        || $scope.target.not.indexOf(val) != -1
                    )
                }
            }
        }
    }]);


var scenarioEditor = angular.module('scenarioEditor');

scenarioEditor.controller('EditorCtrl', ['$scope', '$http', 'convoService', 'charService', 'itemService', 'roomService', 'triggerService', 'scenarioService', 'textureService', 'jointService',
    function ($scope, $http, convoService, charService, itemService, roomService, triggerService, scenarioService, textureService, jointService) {

        // ABSTRACTION LAYER
        $scope.getChars = function () {
            return charService.chars();
        };

        $scope.getConvos = function () {
            return convoService.conversations();
        };

        $scope.getItems = function () {
            return itemService.items();
        };

        $scope.getRooms = function () {
            return roomService.rooms();
        };

        $scope.getTriggers = function () {
            return triggerService.triggers();
        };

        // CHECK FOR CHANGES
        $scope.$watch('getChars()', function () {
            $scope.msg = '*';
            $scope.dlVisible = false;
        }, true);
        $scope.$watch('getConvos()', function () {
            $scope.msg = '*';
            $scope.dlVisible = false;
        }, true);

        // SAVE JSON FILE
        $scope.dlVisible = false;

        $scope.blockUi = false;

        $scope.messages = [];

        $scope.save = function (scenario_id) {

            var errorMessages = [];

            for (var i = 0; i < $scope.getConvos().length; i++) {
                var errors = $scope.getConvos()[i].validate();
                for (var x = 0; x < errors.length; x++) {
                    errors[x] = "Conversations -> " + errors[x];
                }
                errorMessages = errorMessages.concat(errors);
            }

            for (var i = 0; i < $scope.getChars().length; i++) {
                var errors = $scope.getChars()[i].validate();
                for (var x = 0; x < errors.length; x++) {
                    errors[x] = "Characters -> " + errors[x];
                }
                errorMessages = errorMessages.concat(errors);
            }

            for (var i = 0; i < $scope.getItems().length; i++) {
                var errors = $scope.getItems()[i].validate();
                for (var x = 0; x < errors.length; x++) {
                    errors[x] = "Items -> " + errors[x];
                }
                errorMessages = errorMessages.concat(errors);
            }

            for (var i = 0; i < $scope.getRooms().length; i++) {
                var errors = $scope.getRooms()[i].validate();
                for (var x = 0; x < errors.length; x++) {
                    errors[x] = "Rooms -> " + errors[x];
                }
                errorMessages = errorMessages.concat(errors);
            }

            if (errorMessages.length == 0) {
                blockUi(true);

                var assets = [];

                for (var i = 0; i < $scope.getChars().length; i++) {
                    assets.push($scope.getChars()[i]);
                }

                for (var i = 0; i < $scope.getConvos().length; i++) {
                    assets.push($scope.getConvos()[i]);
                }

                for (var i = 0; i < $scope.getItems().length; i++) {
                    assets.push($scope.getItems()[i]);
                }

                for (var i = 0; i < $scope.getRooms().length; i++) {
                    assets.push($scope.getRooms()[i]);
                }

                $scope.dataObj = {
                    name: $scope.scenarioName,
                    description: $scope.scenarioDescription,
                    assets: assets
                };

                console.log(angular.toJson($scope.dataObj));


                $http.post('/scenario/service/update_scenario/' + scenario_id + '/', angular.toJson($scope.dataObj)).then(function (data) {
                    $scope.msg = 'Data saved.';
                    $scope.dlVisible = true;
                }).then(
                    //Success
                    function (response) {
                        blockUi(false);
                        showMessage("Scenario saved successfully", "success");
                    },
                    //Failure
                    function (response) {
                        alert("Error occurred while saving scenario - " + response);
                        blockUi(false);
                    }
                );

                $scope.msg2 = 'Data sent: ' + $scope.jsonData;

            } else {
                for (var i = 0; i < errorMessages.length; i++) {
                    showMessage(errorMessages[i], "danger");
                }
            }
        };

        $scope.clearMessages = function () {
            $scope.messages = [];
        };

        $scope.loadScript = function (script) {
            $scope.dataObj = angular.fromJson(script);

            var chars = [];
            var convos = [];
            var items = [];
            var rooms = [];
            var textures = [];

            for (var i = 0; i < $scope.dataObj.assets.length; i++) {
                if ($scope.dataObj.assets[i].type == "character") {
                    chars.push($scope.dataObj.assets[i]);
                }
                if ($scope.dataObj.assets[i].type == "item") {
                    items.push($scope.dataObj.assets[i]);
                }
                if ($scope.dataObj.assets[i].type == "conversation") {
                    convos.push($scope.dataObj.assets[i]);
                }
                if ($scope.dataObj.assets[i].type == "room") {
                    rooms.push($scope.dataObj.assets[i]);
                }
            }

            convoService.setData(convos);
            charService.setData(chars);
            itemService.setData(items);
            roomService.setData(rooms);
            scenarioService.setData($scope.dataObj);

            /*
             for (var i = 0; i < charService.chars().length; i++) {
             jointService.getJoint(charService.chars()[i].getComponentForType("HEAD").src);
             jointService.getJoint(charService.chars()[i].getComponentForType("TORSO").src);
             jointService.getJoint(charService.chars()[i].getComponentForType("LEFT_ARM").src);
             jointService.getJoint(charService.chars()[i].getComponentForType("RIGHT_ARM").src);
             jointService.getJoint(charService.chars()[i].getComponentForType("RIGHT_LEG").src);
             jointService.getJoint(charService.chars()[i].getComponentForType("LEFT_LEG").src);
             jointService.getJoint(charService.chars()[i].getComponentForType("PELVIS").src);
             }
             */
        };

        $scope.$on('blockUi', function (event, data) {
            if (data.length > 0) {
                blockUi(data[0]);
            }
        });

        $scope.$on('showMessage', function (event, data) {
            if (data.length > 0) {
                var text = data[0];
                var sev = "info";
                if (data.length > 0) {
                    sev = data[1];
                }
                showMessage(text, sev);
            }
        });

        $scope.t = function () {
            return $scope;
        };

        angular.element(document).ready(function () {
            $scope.loadScript($("#scenario-script").text());
        });

        function blockUi(block) {
            if (block === true) {
                $('#ui-blocker').fadeIn();
            } else {
                $('#ui-blocker').fadeOut();
            }
        }

        function showMessage(text, severity) {
            var message = {};
            message.text = text;
            message.severity = severity;
            $scope.messages.push(message);
        }

        function init() {
            triggerService.fetchTriggers();
        }

        init();
    }
]);
