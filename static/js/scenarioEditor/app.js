'use strict';

// Declare app level module which depends on views, and components
var application = angular.module('scenarioEditor', [
        'ngRoute',
        'scenarioEditor.charView',
        'scenarioEditor.convoView',
        'scenarioEditor.assetView',
        'scenarioEditor.roomView',
        'scenarioEditor.itemView',
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
    ]);

var scenarioEditor = angular.module('scenarioEditor');

scenarioEditor.controller('EditorCtrl', ['$scope', '$http', 'convoService', 'charService', 'itemService', 'roomService',
    function ($scope, $http, convoService, charService, itemService, roomService) {

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
                function(response){
                    blockUi(false);
                    showMessage("Scenario saved successfully", "success");
                },
                //Failure
                function(response){
                    alert("Error occured while saving scenario - " + response);
                    blockUi(false);
                }
            );

            $scope.msg2 = 'Data sent: ' + $scope.jsonData;
        };

        $scope.clearMessages = function(){
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
            if(data.length > 0){
                blockUi(data[0]);
            }
        });

        $scope.$on('showMessage', function (event, data) {
            if(data.length > 0){
                var text = data[0];
                var sev  = "info";
                if(data.length > 0){
                    sev = data[1];
                }
                showMessage(text, sev);
            }
        });

        angular.element(document).ready(function () {
            $scope.loadScript($("#scenario-script").text());
        });

        function blockUi(block){
          if(block === true){
                $('#ui-blocker').fadeIn();
          }else {
                $('#ui-blocker').fadeOut();
          }
        }

        function showMessage(text, severity){
             var message = {};
            message.text = text;
            message.severity = severity;
            $scope.messages.push(message);
        }
    }
]);
