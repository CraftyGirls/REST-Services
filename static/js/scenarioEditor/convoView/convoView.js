'use strict';

angular.module('scenarioEditor.convoView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/convoView', {
            templateUrl: '/scenario/convoView/',
            controller: 'ConvoCtrl'
        });
    }])

    .controller('ConvoCtrl', ['$scope', 'convoService', 'triggerService', function ($scope, convoService, triggerService) {

        $scope.editVisible = false;

        $scope.getConvos = function () {
            return convoService.conversations();
        };

        $scope.addConvo = function () {
            convoService.addConversation();
            updateConvoOrders();
        };

        $scope.addLine = function (dialogue) {
            dialogue.text.push("");
        };

        $scope.editConvo = function (convo) {
            convoService.editConversation(convo);
            $scope.editVisible = true;
        };

        $scope.deleteConvo = function (convo) {
            convoService.deleteConversation(convo);
            if (convoService.conversations().length == 0) {
                $scope.editVisible = false;
            }
        };

        $scope.addDialogue = function (convo) {
            convoService.addDialogue(convo)
        };

        $scope.getCurrentCovnversation = function () {
            return convoService.getCurrentCovnversation();
        };
        $scope.addOption = function () {
            convoService.addOption(-1, "");
        };

        $scope.updateArg = function (argParent, input, oldKey) {
            var newKey = document.getElementById(input).value;
            // Work with json to maintain property order
            var asJson = JSON.stringify(argParent.args);
            asJson = asJson.replace(oldKey, newKey);
            argParent.args = JSON.parse(asJson);
        };

        $scope.indent = function(convo){
            convo.settings.indentation++;
        }

        $scope.outdent = function(convo){
            if(convo.settings.indentation > 0){
                convo.settings.indentation--;
            }
        }

        $scope.orderUp = function(convo){
            var idx = convoService.conversations().indexOf(convo);
            if(idx > 0){
                var temp = convoService.conversations()[idx - 1];
                convoService.conversations()[idx - 1] = convo;
                convoService.conversations()[idx] = temp;
            }
        }

        $scope.orderDown = function(convo){
            var idx = convoService.conversations().indexOf(convo);
            if(idx < convoService.conversations().length - 1){
                var temp = convoService.conversations()[idx + 1];
                convoService.conversations()[idx + 1] = convo;
                convoService.conversations()[idx] = temp;
            }
        }

        function updateConvoOrders(){
            for(var i = 0; i < convoService.conversations().length; i++){
                convoService.conversations()[i].settings.order = i;
            }
        }

        function validateTriggers() {
            triggerService.fetchTriggers(function () {
                var errors = [];
                for (var i = 0; i < convoService.conversations().length; i++) {
                    for (var x = 0; x < convoService.conversations()[i].dialogue.length; x++) {
                        var trig = convoService.conversations()[i].dialogue[x].triggers;
                        for (var j = 0; j < trig.length; j++) {
                            if (convoService.conversations()[i].dialogue[x].triggers[j].id == -1) {
                                triggerService.assignIdByName(convoService.conversations()[i].dialogue[x].triggers[j]);
                            }
                            var messages = triggerService.validateLocalTrigger(convoService.conversations()[i].dialogue[x].triggers[j], convoService.conversations()[i].dialogue[x].triggers);
                            for (var y = 0; y < messages.length; y++) {
                                messages[y] = convoService.conversations()[i].name + " -> " + convoService.conversations()[i].dialogue[x].name + " -> Triggers -> " + messages[y];
                            }
                            errors = errors.concat(messages);
                        }
                    }
                }
                for (var i = 0; i < convoService.conversations().length; i++) {
                    for (var x = 0; x < convoService.conversations()[i].dialogue.length; x++) {
                        var trig = convoService.conversations()[i].dialogue[x].conditions;
                        for (var j = 0; j < trig.length; j++) {
                            if (convoService.conversations()[i].dialogue[x].conditions[j].id == -1) {
                                triggerService.assignIdByName(convoService.conversations()[i].dialogue[x].conditions[j]);
                            }
                            var messages = triggerService.validateLocalTrigger(convoService.conversations()[i].dialogue[x].conditions[j], convoService.conversations()[i].dialogue[x].conditions);
                            for (var y = 0; y < messages.length; y++) {
                                messages[y] = convoService.conversations()[i].name + " -> " + convoService.conversations()[i].dialogue[x].name + " -> Conditions -> " + messages[y];
                            }
                            errors = errors.concat(messages);
                        }
                    }
                }
                for (var i = 0; i < errors.length; i++) {
                    $scope.$emit('showMessage', [errors[i], 'danger']);
                }
                convoService.resetCurrent();
                $scope.editVisible = false;
            });
        }
        validateTriggers();

    }])

    .directive('dialogue', function () {
        return {
            templateUrl: function (elem, attr) {
                return '/scenario/dialogue';
            }
        };
    });

