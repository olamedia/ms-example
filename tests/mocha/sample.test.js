const { describe, it } = require('mocha');

const { assert } = require('chai');// require('assert');

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      const missingValue = 4;
      const arrayWithMissingValue = [1, 2, 3];

      const actualResult = arrayWithMissingValue.indexOf(missingValue);

      assert.equal(actualResult, -1);
    });
  });
});
