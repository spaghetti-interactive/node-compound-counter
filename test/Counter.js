'use strict';

module.exports = function () {

  describe('Counter', function () {

    var
      errors = CompoundCounter.errors;

    var
      counter;

    beforeEach(function () {
      counter = CompoundCounter.forge();
    });

    it('#setRoundDelegate #getRoundDelegate', function () {

      var
        delegate = function () {};

      expect(counter.setRoundDelegate).to.throw(errors.ArgumentTypeError);

      counter.setRoundDelegate(delegate);
      expect(counter.getRoundDelegate()).to.equal(delegate);
    });

    describe('#field', function () {

      it('should throw an ArgumentTypeError', function () {

        expect(counter.field).to.throw(errors.ArgumentTypeError);
        expect(function () {
          counter.field('single');
        }).to.throw(errors.ArgumentTypeError);
      });

      it('should throw a DuplicateError', function () {
        expect(function () {
          counter.field('single', 1);
          counter.field('single', 1);
        }).to.throw(errors.DuplicateError);
      });

      it('should throw a NotAnIntegerError', function () {
        expect(function () {
          counter.field('single', 1.2);
        }).to.throw(errors.NotAnIntegerError);
      });

      it('should throw an OutOfRangeError', function () {
        expect(function () {
          counter.field('single', BitUtil.getMaxValue(33));
        }).to.throw(errors.OutOfRangeError);
      });

      it('should throw a NotAPositiveInteger', function () {
        expect(function () {
          counter.field('single', -1);
        }).to.throw(errors.NotAPositiveInteger);
      });

      it('should throw an OutOfRangeError', function () {
        expect(function () {
          counter.field('least', BitUtil.getMaxValue(20));
          counter.field('most', BitUtil.getMaxValue(16));
        }).to.throw(errors.OutOfRangeError);
      });
    });

    describe('#set', function () {

      it('should round', function () {

        counter
          .field('single', 2)
          .on('change', function (value) {
            expect(value).to.equal(counter.get());
          });

        counter.set(1.2);

        expect(counter.get()).to.equal(1);
      });
    });
  });
}
