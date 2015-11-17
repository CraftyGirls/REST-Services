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
    $scope.componentImages = [];

    $scope.dropzoneVisible = true;

    $scope.showCharacterComponentTypes = false;
    
    $scope.showFileUploaders = false;

    $scope.selectedComponentType = -1;

    $scope.selectedAssetType = -1;

    $scope.componentScale = 1;
    
    $scope.componentFilesConfirmed = false;

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
        "Leg": ["Upper Leg", "Lower Leg", "Foot"],
        "Torso": ["Torso"],
        "Head": ["Lower Jaw", "Upper Jaw", "Nose", "Left Pupil", "Right Pupil"],
        "Pelvis": ["Pelvis"]
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
        
        $scope.showFileUploaders = true;
    }

    $scope.uploadFiles = function() {
        $scope.componentImages = [];
        for (var i = 0; i < $scope.componentPartsByType[$scope.selectedComponentType.label].length; i++) {
            $scope.componentImages.push($scope.componentPartsByType[$scope.selectedComponentType.label][i]);
        }
        $scope.componentFilesConfirmed = true;
    }

    function getFileUploadContainer() {
        return angular.element(document.getElementById('file-upload-container'));
    }

    function addFileUploader(componentName) {
        var container = getFileUploadContainer();
        container.append($compile("<span>File for " + componentName + "</span> <div file-uploader id='drop_zone' dropzones='dropzones'></div><br/>")($scope));
    }

    function addDropzone(dropzone) {
        $scope.dropzones.push(dropzone);
    }

    function componentKeyToIndex(key) {
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
                    autoProcessQueue: false,

                    resize: function(file) {

                        var resizeInfo = {
                            srcX: 0,
                            srcY: 0,
                            trgX: 0,
                            trgY: 0,
                            srcWidth: file.width,
                            srcHeight: file.height,
                            trgWidth: file.width,
                            trgHeight: file.height
                        };

                        return resizeInfo;
                    },

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
    .directive('componentBuilder', [
        function() {
            return {

                scope: {
                    components: "=",
                    componentType: "=",
                    componentScale: "="
                },

                template: '<div id="c-wrapper"><canvas id="c" class="component-builder"></canvas></div>',

                link: function(scope, element, attr) {

                    var componentImages = [];

                    // @TODO is there a better way to do this?
                    var componentRelationShips = {
                        "Arm": "Upper Arm>Lower Arm>Hand>OUT",
                        "Leg": "Upper Leg>Lower Leg>Foot>OUT",
                        "Torso": "Torso,Pelvis>OUT,Neck>OUT,Left Arm>OUT,Right Arm>OUT",
                        "Head": "Lower Jaw>Upper Jaw,Upper Jaw>Nose,Upper Jaw>Left Pupil,Upper Jaw>Right Pupil",
                        "Pelvis": "Pelvis,Left Leg>OUT,Right Leg>OUT"
                    };

                    var canvas = new fabric.Canvas('c');
                    canvas.selection = false;
                    canvas.setHeight(720);
                    canvas.setWidth(1280);

                    var inJointGroup = null;

                    // @TODO - Combine these two arrays into one array of objects 
                    var outJoints = [];
                    var outJointLabels = [];

                    var jointId = 0;

                    var shiftDown = false;

                    var canvasWrapper = document.getElementById("c-wrapper");

                    canvasWrapper.tabIndex = 1000;

                    scope.$watch('components', function(value) {

                        clearExisting();

                        var imgElems = $(".dz-image img");
                        var lx = 0.0;
                        for (var i = 0; i < imgElems.length; i++) {
                            var imgInstance = new fabric.Image(imgElems[i], {
                                left: 10 + lx,
                                top: 200,
                            });

                            imgInstance.hasControls = false;
                            //imgInstance.hasBorders = false;

                            canvas.add(imgInstance);
                            componentImages.push(imgInstance);

                            lx += imgInstance.width;
                        }

                        var rels = componentRelationShips[scope.componentType.label];

                        if (rels != undefined) {

                            var sets = rels.split(",");

                            for (var i = 0; i < sets.length; i++) {
                                var parts = sets[i].split(">");
                                console.log(parts);
                                for (var j = 0; j < parts.length - 1; j++) {
                                    addOutJoint(parts[j] + " - " + parts[j + 1]);
                                }
                            }
                        }
                        inJointGroup.moveTo(1000);
                    });

                    scope.$watch('componentScale', function(value) {
                        for (var i = 0; i < componentImages.length; i++) {
                            componentImages[i].scaleX = value;
                            componentImages[i].scaleY = value;
                        }
                        canvas.renderAll();

                    });

                    canvasWrapper.addEventListener("keydowns", function(e) {
                        if (e.shiftKey) {
                            shiftDown = true;
                        }

                    }, false);

                    canvasWrapper.addEventListener("keyup", function(e) {
                        if (e.shiftKey == false) {
                            shiftDown = false;
                        }

                    }, false);

                    // Calculates the joint/image percentages for all components
                    // This is probably overly complicated and can probably be cleaned up/improved
                    function calculateJointPercentages() {
                        var rels = [];

                        if (componentImages.length > 0) {
                            var rootComponentImg = componentImages[0];
                            rels[0] = {
                                joint: {
                                    parent: "IN",
                                    child: scope.components[0]
                                },
                                component: scope.components[0],
                                percentages: calculateJointImgRelationship(inJointGroup, rootComponentImg)
                            }
                            var sets = componentRelationShips[scope.componentType.label].split(",");
                            for (var x = 0; x < sets.length; x++) {
                                var s = 0;
                                var comps = sets[x].split(">");
                                for (var i = 0; i < comps.length - 1;) {
                                    var compName = comps[i + s];
                                    console.log(scope.components);
                                    var imgIdx = scope.components.indexOf(compName);
                                    var jointName = comps[i] + " - " + comps[i + 1];
                                    var jointIdx = outJointLabels.indexOf(jointName) + s;;
                                    if (imgIdx >= 0) {
                                        var componentImg = componentImages[imgIdx];
                                        rels.push({
                                            joint: {
                                                parent: comps[i],
                                                child: comps[i + 1]
                                            },
                                            component: comps[i + s],
                                            percentages: calculateJointImgRelationship(
                                                outJoints[jointIdx], componentImg)
                                        });
                                    }
                                    s++;
                                    if (s == 2) {
                                        i++;
                                        s = 0;
                                    }
                                }
                            }
                        }
                        return rels
                    }

                    // Calculates the relationship between a specific joint and image
                    function calculateJointImgRelationship(joint, img) {
                        var imgXPerc = 0.0;
                        var imgYPerc = 0.0;

                        var ix = img.left;
                        var iy = img.top;
                        var iw = img.width * img.scaleX;
                        var ih = img.height * img.scaleY;

                        var jx = joint.width / 2 + joint.left - ix;
                        var jy = joint.height + joint.top - iy - ih - joint.item(0).height / 2;

                        imgXPerc = jx / iw;
                        imgYPerc = -1 * (jy / ih);

                        return {
                            x: imgXPerc,
                            y: imgYPerc
                        };
                    }

                    /**
                     * Clears out the existing images and out joint objects from
                     * the canvas, as well as empties out the corresponding arrays
                     */
                    function clearExisting() {
                        for (var i = 0; i < outJoints.length; i++) {
                            canvas.remove(outJoints[i]);
                        }
                        outJoints = [];
                        outJointLabels = [];
                        for (var i = 0; i < componentImages.length; i++) {
                            canvas.remove(componentImages[i]);
                        }

                        componentImages = [];
                    }

                    function canvasKeyDown(e) {
                        console.log("shift");
                        if (e.shiftKey == true) {
                            shiftDown = true;
                        }
                    }

                    // Creates the circle for an out joint
                    function createOutJoint() {
                        var circ = new fabric.Circle({
                            radius: 5,
                            fill: '#55f',
                            top: 0,
                            left: 0,
                            id: jointId
                        });
                        circ.hasControls = false;
                        circ.hasBorders = false;
                        jointId++;
                        return circ;
                    }

                    // Creates the circle for an in joint
                    function createInJoint() {
                        var circ = new fabric.Circle({
                            radius: 5,
                            fill: '#f55',
                            top: 0,
                            left: 0,
                            id: jointId
                        });
                        circ.hasControls = false;
                        circ.hasBorders = false;
                        jointId++;
                        return circ;
                    }


                    function addOutJoint(labelText) {
                        var joint = createOutJoint();

                        var label = new fabric.Text(labelText, {
                            left: 0,
                            top: 0,
                            stroke: null,
                            fill: "#000000",
                            fontSize: 20,
                            backgroundColor: "#ffffff"
                        });

                        // This puts the center of the joint at the group's 0,0
                        joint.left = -joint.width / 2;
                        joint.top = -joint.height / 2;

                        label.left = -label.width / 2;
                        label.top = -label.height - joint.height;

                        var group = new fabric.Group([joint, label], {
                            top: 50,
                            left: 120 + (120 * outJoints.length)
                        });
                        group.hasControls = false;
                        group.hasBorders = false;
                        canvas.add(group);

                        outJoints.push(group);
                        outJointLabels.push(labelText);
                    }

                    function addInJoint() {
                        var joint = createInJoint();

                        var label = new fabric.Text("In Joint", {
                            left: 0,
                            top: 0,
                            stroke: null,
                            fill: "#000000",
                            fontSize: 20,
                            backgroundColor: "#ffffff"
                        });

                        joint.left = -joint.width / 2;
                        joint.top = -joint.height / 2;

                        label.left = -label.width / 2;
                        label.top = -label.height - joint.height;

                        var group = new fabric.Group([joint, label], {
                            left: 50,
                            top: 50
                        });
                        group.hasControls = false;
                        group.hasBorders = false;
                        canvas.add(group);
                        inJointGroup = group;
                    }

                    function deleteOutJoint(joint) {
                        canvas.remove(joint);
                        outJoints.splice(indexOfJoint(outJoints, joint), 1);
                    }

                    addInJoint();

                    var outJointrect = new fabric.Rect({
                        left: 2,
                        top: 8,
                        fill: '#55f',
                        width: 20,
                        height: 20,
                        rx: 5,
                        ry: 5
                    });

                    function indexOfJoint(array, value) {
                        for (var i = 0; i < array.length; i++) {
                            if (array[i].id == value.id) {
                                return i;
                            }
                        }
                        return -1;
                    }

                    canvas.on({
                        'mouse:down': function(e) {
                            if (e.target) {
                                if (shiftDown == true) {
                                    if (indexOfJoint(outJoints, e.target) >= 0) {
                                        deleteOutJoint(e.target);
                                    }
                                }
                                else {
                                    e.target.opacity = 0.5;
                                    canvas.renderAll();
                                }
                            }
                        },
                        'mouse:up': function(e) {
                            if (e.target) {
                                e.target.opacity = 1;
                                canvas.renderAll();
                            }
                            canvas.renderAll();
                            calculateJointPercentages();
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