'use strict';

describe('scenarioEditor.version module', function() {
  beforeEach(module('scenarioEditor.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
