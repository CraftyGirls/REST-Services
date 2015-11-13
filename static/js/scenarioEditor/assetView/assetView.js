'use strict';

angular.module('scenarioEditor.assetView', ['ngRoute', 'scenarioServices'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/assetView', {
        templateUrl: '/scenario/assetView/',
        controller: 'assetCtrl'
    });
}])

.controller('assetCtrl', ['$scope', '$compile', function($scope, $compile) {

    $scope.dropzones = [];

    $scope.dropzoneVisible = true;
    $scope.showCharacterComponentTypes = false;

    $scope.selectedComponentType = -1;

    $scope.selectedAssetType = -1;

    // Make this a serverside resource later on
    $scope.assetTypes = [{
        id: -1,
        label: 'Select Asset Type'
    }, {
        id: 1,
        label: 'Character Component'
    }];


    $scope.componentTypes = [{
        id: -1,
        label: 'Select Component Type'
    }, {
        id: 1,
        label: 'Leg'
    }, {
        id: 2,
        label: 'Arm'
    }, {
        id: 3,
        label: 'Torso'
    }, {
        id: 4,
        label: 'Head'
    }, {
        id: 5,
        label: 'Pelvis'
    }];

    $scope.componentPartsByType = {
        "Arm": ["Uppper Arm", "Lower Arm", "Hand"],
        "Leg": ["Upper Leg", "Lower Leg", "Foot"]
    }

    $scope.onAssetTypeChange = function() {
        switch ($scope.selectedAssetType.label) {
            case 'Character Component': // Character Component
                $scope.showCharacterComponentTypes = true;
                break;
        }
    }

    $scope.onComponentTypeChange = function() {
    
        var componentParts = $scope.componentPartsByType[$scope.selectedComponentType.label];
        
        $(getFileUploadContainer()).empty();
        $scope.dropzones = [];

        for (var i = 0; i < componentParts.length; i++) {
            addFileUploader(componentParts[i]);
        }
        
        $("#upload-files").click(function(){
            for(var i = 0; i < $scope.dropzones.length; i++){
                $scope.dropzones[i].processQueue();
            }
        })
    }

    function getFileUploadContainer() {
        return angular.element(document.getElementById('file-upload-container'));
    }

    function addFileUploader(componentName) {
        var container = getFileUploadContainer();
        container.append($compile("<span>File for " + componentName + "</span> <div file-uploader id='drop_zone' dropzones='dropzones'></div><br/>")($scope));
    }
    
    function addDropzone(dropzone){
        $scope.dropzones.push(dropzone);
    }
    
    function componentKeyToIndex(key){
        return $scope.selectedComponentType.indexOf(key);
    }
}])

// Directive for dropzone file uploader
.directive('fileUploader', function() {
    return {
        restrict: 'AE',
        template: '<div ng-transclude></div>',
        transclude: true,
        scope: {
            dropzone: '=',
            dropzoneConfig: '=',
            eventHandlers: '=',
            dropzones: "=dropzones"
        },
        
        link: function(scope, element, attrs, ctrls) {
            try {
                Dropzone
            }

            catch (error) {
                throw new Error('Dropzone.js not loaded.');
            }

            var dropzone = new Dropzone(element[0], {
                url: "/scenario/upload_asset/",
                
                autoProcessQueue : false,
                
                init: function() {
                    this.on("addedfile", function() {
                        if (this.files[1] != null) {
                            this.removeFile(this.files[0]);
                        }
                    });
                }
            });

            dropzone.on("success", function(file, response) {
                console.log(file);
                console.log(response);
            });

            if (scope.eventHandlers) {
                Object.keys(scope.eventHandlers).forEach(function(eventName) {
                    dropzone.on(eventName, scope.eventHandlers[eventName]);
                });
            }
            
            scope.dropzones.push(dropzone);
        }
    };
})