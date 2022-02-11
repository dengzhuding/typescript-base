import assert from 'assert';
import ZipCodeValidator from '../src/demo-16-ZipCodeValidator'

describe('ZipCodeValidator', function () {
  describe('isAcceptable()', function () {
    it('为 true', function () {
      assert.equal(true, new ZipCodeValidator().isAcceptable('12345'))
    })
  })

})