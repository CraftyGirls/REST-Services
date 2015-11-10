'use strict';

angular.module('scenarioEditor.assetView', ['ngRoute', 'scenarioServices'])

    .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/assetView', {
                templateUrl: '/scenario/assetView/',
                controller: 'assetCtrl'
            });
    }])
    
    .controller('assetCtrl', ['$scope', function($scope) {
      
      
    }])
    // Directive for dropzone file uploader
    .directive('fileUploader', function () {
        return {
            restrict: 'AE',
            template: '<div ng-transclude></div>',
            transclude: true,
            scope: {
                dropzone: '=',
                dropzoneConfig: '=',
                eventHandlers: '='
            },
            link: function(scope, element, attrs, ctrls) {
                try { Dropzone }
                catch (error) {
                    throw new Error('Dropzone.js not loaded.');
                }
                var dropzone = new Dropzone(element[0], { url: "/scenario/upload_asset/"});
                
                dropzone.on("success", function(file, response){
                    console.log(file);
                    console.log(response);
                });

                if (scope.eventHandlers) {
                    Object.keys(scope.eventHandlers).forEach(function (eventName) {
                        dropzone.on(eventName, scope.eventHandlers[eventName]);
                    });
                }
                scope.dropzone = dropzone;
            }
        };
    })