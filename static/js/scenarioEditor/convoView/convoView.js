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

        function validateTriggers() {
            triggerService.fetchTriggers(function () {
                var errors = [];
                for (var i = 0; i < convoService.conversations().length; i++) {
                    for (var x = 0; x < convoService.conversations()[i].dialogue.length; x++) {
                        var trig = convoService.conversations()[i].dialogue[x].triggers;
                        console.log(trig);
                        for (var j = 0; j < trig.length; j++) {
                            if (convoService.conversations()[i].dialogue[x].triggers[j].id == -1) {
                                triggerService.assignIdByName(convoService.conversations()[i].dialogue[x].triggers[j]);
                            }
                            var messages = triggerService.validateLocalTrigger(convoService.conversations()[i].dialogue[x].triggers[j], convoService.conversations()[i].dialogue[x].triggers);
                            for (var x = 0; x < messages.length; x++) {
                                messages[x] = convoService.conversations()[i].name + " -> " + convoService.conversations()[i].dialogue[x].name + " -> Triggers -> " + messages[x];
                            }
                            errors = errors.concat(messages);
                        }
                    }
                }
                for (var i = 0; i < convoService.conversations().length; i++) {
                    for (var x = 0; x < convoService.conversations()[i].dialogue.length; x++) {
                        var trig = convoService.conversations()[i].dialogue[x].conditions;
                        console.log(trig);
                        for (var j = 0; j < trig.length; j++) {
                            if (convoService.conversations()[i].dialogue[x].conditions[j].id == -1) {
                                conditionservice.assignIdByName(convoService.conversations()[i].dialogue[x].conditions[j]);
                            }
                            var messages = conditionservice.validateLocalTrigger(convoService.conversations()[i].dialogue[x].conditions[j], convoService.conversations()[i].dialogue[x].conditions);
                            for (var x = 0; x < messages.length; x++) {
                                messages[x] = convoService.conversations()[i].name + " -> " + convoService.conversations()[i].dialogue[x].name + " -> Conditions -> " + messages[x];
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

