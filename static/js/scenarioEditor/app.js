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
    .directive('ngConfirmClick', [
        function() {
            return {
                link: function(scope, element, attr) {
                    var msg = "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click', function(event) {
                        if (window.confirm(msg)) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
        }
    ])
    .directive('componentBuilder', [
        function() {
            return {
                template: '<canvas id="c" class="component-builder"></canvas>',
                link: function(scope, element, attr) {
                    function createInJoint(){
                        var circ = new fabric.Circle({
                            radius: 10,
                            fill: '#f55',
                            top: 100,
                            left: 50
                        });
                        circ.hasControls = false;
                        circ.hasBorders = false;
                        return circ;
                    }
                    
                    function createOutJoint(){
                        var circ =  new fabric.Circle({
                            radius: 10,
                            fill: '#55f',
                            top: 100,
                            left: 150
                        });
                        circ.hasControls = false;
                        circ.hasBorders = false;
                        return circ;
                    }
                    
                    function addOutJoint(){
                         canvas.add(createOutJoint());
                    }
                    
                    var canvas = new fabric.Canvas('c');
                    
                    canvas.add(createInJoint());
                    canvas.add(createOutJoint());
                    
                    var rect = new fabric.Rect({
                      left: 2,
                      top: 6,
                      fill: '#eeeeee',
                      width: 30,
                      height: 30,
                      rx : 5,
                      ry : 5
                    });
                    
                    rect.hasControls = false;
                    rect.hasBorders = false;
                    rect.selectable = false;
                    canvas.add(rect);
                    
                  
                    var addOutJointButton = new fabric.Text('+', { left: 5, top: 0 });    
                    addOutJointButton.hasControls = false;
                    addOutJointButton.hasBorders = false;
                    addOutJointButton.selectable = false;
                    canvas.add(addOutJointButton);
                  
                    canvas.on({
                        'mouse:down': function(e) {
                            if (e.target) {
                                e.target.opacity = 0.5;
                                canvas.renderAll();
                            }
                        },
                        'mouse:up': function(e) {
                            if (e.target) {
                                e.target.opacity = 1;
                                canvas.renderAll();
                        
                                if(e.target == addOutJointButton){
                                    addOutJoint();
                                }
                            }
                        },
                        'object:moved': function(e) {
                            e.target.opacity = 0.5;
                        },
                        'object:modified': function(e) {
                            e.target.opacity = 1;
                        }
                    });
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

        angular.element(document).ready(function() {
            $scope.loadScript($("#scenario-script").text());
        });
    }
])
