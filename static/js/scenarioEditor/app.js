'use strict';

// Declare app level module which depends on views, and components
var application = angular.module('scenarioEditor', [
        'ngRoute',
        'scenarioEditor.charView',
        'scenarioEditor.lineView',
        'scenarioEditor.convoView',
        'scenarioEditor.assetView',
        'scenarioEditor.roomView',
        'scenarioEditor.itemView',
        'scenarioEditor.version',
        'scenarioServices'
    ])
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.otherwise({
                redirectTo: '/charView'
            });
        }
    ])
    .config(['$interpolateProvider',
        function($interpolateProvider) {
            $interpolateProvider.startSymbol('{$');
            $interpolateProvider.endSymbol('$}');
        }
    ])
    .config(['$httpProvider', 
        function($httpProvider){
            $httpProvider.defaults.xsrfCookieName = 'csrftoken';
            $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        }
    ])
    .directive('ngConfirmClick', [
        function() {
            return {
                link: function(scope, element, attr) {
                    var msg = "Are you sure?";
                    var clickAction = attr.ngClick;
                    element.bind('click', function(event) {
                        if (window.confirm(msg)) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
        }
    ])
    .directive('sweetDelete', [
        function(){
            return {
                scope: {
                    variable : "=",
                    container : "="
                },
                template: '<span class="glyphicon glyphicon-remove clickable" ng-click="sweetDelete()"></span>',
                link: function($scope, iElm, iAttrs, controller) {
                    $scope.sweetDelete = function(){
                        var idx = $scope.container.indexOf($scope.variable);
                        if(idx !== -1){
                            $scope.container = $scope.container.splice(idx, 1);
                        }
                    }
                }
            };
        }
    ])
    .directive('sweetKeyedDelete', [
        function(){
            return {
                scope: {
                    key : "=",
                    container : "="
                },
                transclude: true,
                template: '<span class="glyphicon glyphicon-remove clickable" ng-click="sweetKeyedDelete()"></span>',
                link: function($scope, iElm, iAttrs, controller) {
                    $scope.sweetKeyedDelete = function(){
                        delete $scope.container[$scope.key];
                    }
                }
            };
        }
    ]);
   

var scenarioEditor = angular.module('scenarioEditor');

scenarioEditor.controller('EditorCtrl', ['$scope', '$http', 'convoService', 'charService', 'lineService',
    function($scope, $http, convoService, charService, lineService) {

        // ABSTRACTION LAYER
        $scope.getChars = function() {
            return charService.chars();
        };

        $scope.getConvos = function() {
            return convoService.conversations();
        };

        $scope.getLines = function() {
            return lineService.lines();
        };
        // CHECK FOR CHANGES
        $scope.$watch('getChars()', function() {
            $scope.msg = '*';
            $scope.dlVisible = false;
        }, true);
        $scope.$watch('getConvos()', function() {
            $scope.msg = '*';
            $scope.dlVisible = false;
        }, true);
        $scope.$watch('getLines()', function() {
            $scope.msg = '*';
            $scope.dlVisible = false;
        }, true);

        // SAVE JSON FILE
        $scope.dlVisible = false;
        
        $scope.blockUi = false;

        $scope.save = function(scenario_id) {
            $scope.dataObj = {
                characters: $scope.getChars(),
                conversations: $scope.getConvos()
            };

            console.log(angular.toJson($scope.dataObj));

            $http.post('/scenario/save/<' + scenario_id + '/', angular.toJson($scope.dataObj)).then(function(data) {
                $scope.msg = 'Data saved.';
                $scope.dlVisible = true;
            });

            $scope.msg2 = 'Data sent: ' + $scope.jsonData;
        };

        $scope.loadScript = function(script) {
            $scope.dataObj = angular.fromJson(script);
            convoService.setData($scope.dataObj.conversations);
            charService.setData($scope.dataObj.characters);
        };
        
        $scope.$on('blockUi', function(event, data) {
            $scope.blockUi = data[0];
        });

        angular.element(document).ready(function() {
            $scope.loadScript($("#scenario-script").text());
        });
    }
]);
