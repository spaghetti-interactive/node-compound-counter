'use strict';

// file deps
var
  TypeUtil = require('../utils/TypeUtil'),
  ArgumentTypeError = require('../errors').ArgumentTypeError;

exports.DEFAULT = Math.round;

exports.set = function (delegate) {
  if ( ! TypeUtil.isFunction(delegate)) {
    throw new ArgumentTypeError('Wrong type for argument 1, delegate. Function expected.');
  }
  this._roundDelegate = delegate;
  return this;
};

exports.get = function () {
  return this._roundDelegate;
};
