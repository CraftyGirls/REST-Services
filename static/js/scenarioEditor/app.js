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
                template: '<div id="c-wrapper"><canvas id="c" class="component-builder"></canvas></div>',
                link: function(scope, element, attr) {
                  
                    var canvas = new fabric.Canvas('c');
                    canvas.selection = false; 
                  
                    var inJoint  = null;
                    var outJoints = [];
                    var jointId   = 0;
                  
                    var shiftDown = false;
                    
                    var canvasWrapper = document.getElementById("c-wrapper");
                  
                    canvasWrapper.tabIndex = 1000;
                    
                    canvasWrapper.addEventListener("keydown", function(e){
                        if(e.shiftKey){
                            shiftDown = true;
                        }
                        
                    }, false);
                    
                    canvasWrapper.addEventListener("keyup", function(e){
                        if(e.shiftKey == false){
                            shiftDown = false;
                        }
                        
                    }, false);
                    
                    function canvasKeyDown(e){
                        console.log("shift");                       
                        if(e.shiftKey == true){
                            shiftDown = true;
                        }
                    }
                    
                    function createOutJoint(){
                        var circ =  new fabric.Circle({
                            radius: 10,
                            fill: '#55f',
                            top: 100,
                            left: 150,
                            id : jointId
                        });
                        circ.hasControls = false;
                        circ.hasBorders = false;
                        jointId++;
                        return circ;
                    }
                    
                    function createInJoint(){
                        var circ = new fabric.Circle({
                            radius: 10,
                            fill: '#f55',
                            top: 100,
                            left: 50,
                            id : jointId
                        });
                        circ.hasControls = false;
                        circ.hasBorders = false;
                        jointId++;
                        return circ;
                    }
                    
                    function addOutJoint(){
                         var joint = createOutJoint();
                         canvas.add(joint);
                         outJoints.push(joint);
                    }
                    
                    function addInJoint(){
                        var joint = createInJoint();
                        canvas.add(joint);
                        inJoint = joint;
                    }
                    
                    function deleteInJoint(joint){
                        canvas.remove(joint);
                        inJoints.splice(indexOfJoint(inJoints, joint), 1);
                    }
                    
                    function deleteOutJoint(joint){
                        canvas.remove(joint);
                        outJoints.splice(indexOfJoint(outJoints, joint), 1);
                    }
                    
                    addInJoint();
                    addOutJoint();
                    
                    var outJointrect = new fabric.Rect({
                      left: 2,
                      top: 8,
                      fill: '#55f',
                      width: 20,
                      height: 20,
                      rx : 5,
                      ry : 5
                    });
                    
                    outJointrect.hasControls = false;
                    outJointrect.hasBorders = false;
                    outJointrect.selectable = false;
                    canvas.add(outJointrect);
                   
                    var addOutJointButton = new fabric.Text('+', { left: 3, top: 1, stroke:"#f9f9f9", fill:"#f9f9f", fontSize:30 });    
                    addOutJointButton.hasControls = false;
                    addOutJointButton.hasBorders = false;
                    addOutJointButton.selectable = false;
                    canvas.add(addOutJointButton);
                    
                    function indexOfJoint(array, value){
                        for(var i = 0; i < array.length; i++){
                            if(array[i].id == value.id){
                                return i;
                            }
                        }
                        return -1;
                    }

                    canvas.on({
                        'mouse:down': function(e) {
                            if (e.target) {
                                 if(shiftDown == true){
                                    if(indexOfJoint(outJoints, e.target) >= 0){
                                        deleteOutJoint(e.target);
                                    }
                                }else{
                                    e.target.opacity = 0.5;
                                    canvas.renderAll();
                                }
                            }
                        },
                        'mouse:up': function(e) {
                            if (e.target) {
                                e.target.opacity = 1;
                                canvas.renderAll();
                        
                                if(e.target === addOutJointButton || e.target == outJointrect){
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
