'use strict';

// core deps
var
  util = require('util'),
  EventEmitter = require('events').EventEmitter;

// file deps
var
  TypeUtil = require('../utils/TypeUtil'),
  BitUtil = require('../utils/BitUtil'),
  RoundDelegate = require('../mixins/RoundDelegate'),
  Field = require('./Field'),
  errors = require('../errors');

function Counter() {
  this._length = 0;
  this._value = 0;
  this._fields = [];

  EventEmitter.call(this);
}

util.inherits(Counter, EventEmitter);

Counter.forge = function () {
  return new this();
};

Counter.prototype.field = function (name, maxValue) {

  _validateName.call(this, name);
  _validateValue.call(this, maxValue);

  var
    length = BitUtil.getLength(maxValue),
    offset = this._length,
    field = Field.forge(this, name, length, offset, maxValue);

  this._fields.push(field);
  this[name] = field;
  this._length += length;

  if (this._length > 32) {
    throw new errors.OutOfRangeError('out of range value');
  }

  field._sync(this._value);

  return this;
};

Counter.prototype.set = function (value) {

  var
    round = this.getRoundDelegate() || RoundDelegate.DEFAULT,
    rounded = round.call(null, value);

  if ( ! _validateValue.call(this, rounded, true)) {
    return this;
  }

  this._sync(rounded);

  this._fields.forEach(function (field) {
    field._sync(rounded);
  });

  return this;
};

Counter.prototype.get = function () {
  return this._value;
};

Counter.prototype.setRoundDelegate = RoundDelegate.set;

Counter.prototype.getRoundDelegate = RoundDelegate.get;

Counter.prototype._sync = function (value) {
  this._value = value & BitUtil.getMaxValue(this._length);
  this.emit('change', this._value);
  return this;
};

function _validateName(name) {

  if ( ! TypeUtil.isString(name)) {
    throw new errors.ArgumentTypeError('wrong type for argument 1, name. String expected');
  }

  this._fields.forEach(function (field) {
    if (field.getName() === name) {
      throw new errors.DuplicateError('duplicate field name \''+name+'\'');
    }
  });
}

function _validateValue(value, isEmit) {

  var
    error;

  switch (true) {

    case ( ! TypeUtil.isNumber(value)):
      error = new errors.ArgumentTypeError('wrong type for argument 2, value. Number expected.');
      break;

    case (value % 1 !== 0):
      error = new errors.NotAnIntegerError('value is not an integer');
      break;

    case (BitUtil.getLength(value) > 32):
      error = new errors.OutOfRangeError('out of range value for argument 2, value.');
      break;

    case (value < 0):
      error = new errors.NotAPositiveIntegerError('value is not a positive integer');
      break;

    default:

  }

  if (error) {
    if (isEmit) {
      this.emit('error', error);
    } else {
      throw error;
    }
  } else {
    return ! error;
  }
}

module.exports = Counter;
