'use strict';

global.expect = require('chai').expect;
global.CompoundCounter = require('../');
global.BitUtil = require('../lib/utils/BitUtil');

describe('Unit tests', function () {

  require('./Counter')();
  require('./Field')();

  describe('back and forth', function () {

    var
      counter;

    beforeEach(function () {
      counter = CompoundCounter.forge();
    });

    it('Counter#set Field#set', function () {

      counter.set(65535);

      expect(counter.get()).to.equal(0);

      counter
        .field('lo', 255)
        .field('hi', 31);

      expect(counter.lo.get()).to.equal(0);
      expect(counter.hi.get()).to.equal(0);
      expect(counter.get()).to.equal(0);

      counter.lo.set(128);
      counter.hi.set(16);

      expect(counter.lo.get()).to.equal(128);
      expect(counter.hi.get()).to.equal(16);
      expect(counter.get()).to.equal(4224);
    });
  });
});
