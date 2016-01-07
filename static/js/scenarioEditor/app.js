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
                    field: "@sweetField"
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
                    }
                    $(iElm).find(".row").append($compile("<div class='col-sm-1'>" + input + "</div>")($scope));
                }
            }
        }
    ])
    .directive('sweetTriggerSelector', ['$compile', 'triggerService', function ($compile, triggerService) {
        return {
            scope: {
                target: "=sweetTarget"
            },
            template: "<select ng-options='trigger as trigger.func for trigger in getTriggers()' ng-model='selected'></select>" +
            "<span class='glyphicon glyphicon-plus clickable hover-click' ng-click='addTrigger()'></span>",
            link: function ($scope, iElm, iAttrs, controller) {

                $scope.getTriggers = function () {
                    return triggerService.triggers();
                };

                $scope.addTrigger = function () {
                    var trigger = new Trigger();
                    trigger.func = $scope.selected.func;
                    for (var i = 0; i < $scope.selected.args.length; i++) {
                        trigger.addArg($scope.selected.args[i].field, $scope.selected.args[i].dataType);
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
    }]);

var scenarioEditor = angular.module('scenarioEditor');

scenarioEditor.controller('EditorCtrl', ['$scope', '$http', 'convoService', 'charService', 'itemService', 'roomService', 'triggerService',
    function ($scope, $http, convoService, charService, itemService, roomService, triggerService) {

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
            blockUi(true);
            $scope.dataObj = {
                characters: $scope.getChars(),
                conversations: $scope.getConvos(),
                items: $scope.getItems(),
                rooms: $scope.getRooms()
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
        };

        $scope.clearMessages = function () {
            $scope.messages = [];
        };

        $scope.loadScript = function (script) {
            $scope.dataObj = angular.fromJson(script);
            convoService.setData($scope.dataObj.conversations);
            charService.setData($scope.dataObj.characters);
            itemService.setData($scope.dataObj.items);
            roomService.setData($scope.dataObj.rooms);
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
