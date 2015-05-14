  'use strict';

module.exports = function () {

  describe('Field', function () {

    var
      errors = CompoundCounter.errors;

    var
      counter;

    beforeEach(function () {
      counter = CompoundCounter.forge();
    });

    it('#setRoundDelegate #getRoundDelegate', function () {

      counter.field('single', 1);

      var
        field = counter.single,
        delegate = function () {};

      expect(field.setRoundDelegate).to.throw(errors.ArgumentTypeError);

      field.setRoundDelegate(delegate);
      expect(field.getRoundDelegate()).to.equal(delegate);
    });

    describe('#set', function () {

      var
        field;

      beforeEach(function () {
        counter.field('single', 1);
        field = counter.single;

        field
          .on('change', function (value) {
            expect(value).to.equal(field.get());
          });
      })

      it('should round', function () {

        field.set(1.2);
        expect(field.get()).to.equal(1);
      });

      it('should emit error with NotAnIntegerError', function () {

        var
          delegate = function (value) { return value; };

        field
          .setRoundDelegate(delegate)
          .on('error', function (error) {
            expect(error).to.be.an.instanceof(errors.NotAnIntegerError);
          })
          .set(1.2);
      });

      it('should emit error with NotAPositiveIntegerError', function () {

        field
          .on('error', function (error) {
            expect(error).to.be.instanceof(errors.NotAPositiveIntegerError);
          })
          .set(-1);
      });

      it('should emit error with OverflowError', function () {

        field
          .on('error', function (error) {
            expect(error).to.be.instanceof(errors.OverflowError);
          })
          .set(2);
      });
    });
  });
}
