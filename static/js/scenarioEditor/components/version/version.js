'use strict';

angular.module('scenarioEditor.version', [
  'scenarioEditor.version.interpolate-filter',
  'scenarioEditor.version.version-directive'
])

.value('version', '0.1');
