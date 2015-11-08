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
        function ($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/charView'});
        }])
    .config(['$interpolateProvider',
        function ($interpolateProvider) {
            $interpolateProvider.startSymbol('{$');
            $interpolateProvider.endSymbol('$}');
        }]);

var scenarioEditor = angular.module('scenarioEditor');

scenarioEditor.controller('EditorCtrl', ['$scope', '$http', 'convoService', 'charService', 'lineService',
    function ($scope, $http, convoService, charService, lineService) {

        // ABSTRACTION LAYER
        $scope.getChars = function () {
            return charService.chars();
        };

        $scope.getConvos = function () {
            return convoService.conversations();
        };

        $scope.getLines = function () {
            return lineService.lines();
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
        $scope.$watch('getLines()', function () {
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
            
            console.log( angular.toJson($scope.dataObj));

            $http.post('/scenario/save/<' + scenario_id + '/', angular.toJson($scope.dataObj)).then(function (data) {
                $scope.msg = 'Data saved.';
                $scope.dlVisible = true;
            });

            $scope.msg2 = 'Data sent: ' + $scope.jsonData;
        };

        $scope.loadScript = function(script){
            $scope.dataObj = angular.fromJson(script);
            convoService.setData($scope.dataObj.conversations);
            charService.setData($scope.dataObj.characters);
        };

        angular.element(document).ready(function () {
            $scope.loadScript($("#scenario-script").text());
        });
    }
]);
