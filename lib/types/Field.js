'use strict';

// core deps
var
  util = require('util'),
  EventEmitter = require('events').EventEmitter;

// file deps
var
  BitUtil = require('../utils/BitUtil'),
  RoundDelegate = require('../mixins/RoundDelegate'),
  errors = require('../errors');

function Field(counter, name, length, offset, maxValue) {
  this._counter = counter;
  this._name = name;
  this._length = length;
  this._offset = offset;
  this._maxValue = maxValue;
  this._value = 0;

  EventEmitter.call(this);
}

util.inherits(Field, EventEmitter);

Field.forge = function (counter, name, length, offset, maxValue) {
  return new this(counter, name, length, offset, maxValue);
};

Field.prototype.getName = function () {
  return this._name;
};

Field.prototype.set = function (value) {

  var
    round = this.getRoundDelegate() || this._counter.getRoundDelegate() || RoundDelegate.DEFAULT,
    rounded = round.call(null, value);

  if ( ! _validate.call(this, rounded)) {
    return this;
  }

  this._value = rounded;
  this.emit('change', rounded);

  _syncCounter.call(this);
  return this;
};

Field.prototype.add = function (value) {
  this.set(this.get() + value);
  return this;
};

Field.prototype.subtract = function (value) {
  this.set(this.get() - value);
  return this;
};

Field.prototype.multiply = function (value) {
  this.set(this.get() * value);
  return this;
};

Field.prototype.divide = function (value) {
  this.set(this.get() / value);
  return this;
};

Field.prototype.get = function () {
  return this._value;
};

Field.prototype.setRoundDelegate = RoundDelegate.set;

Field.prototype.getRoundDelegate = RoundDelegate.get;

Field.prototype._sync = function (cValue) {

  var
    length = this._length,
    offset = this._offset;

  var
    tmp;

  tmp = cValue >> offset;
  tmp = tmp & BitUtil.getMaxValue(length);

  this._value = tmp;
  this.emit('change', tmp);

  return this;
};

function _syncCounter() {

  var
    value = this._value,
    length = this._length,
    offset = this._offset,
    counter = this._counter,
    cValue = counter.get();

  var
    tmp;

  tmp = cValue >> (length + offset);
  tmp = (tmp << length) + value;
  tmp = (tmp << offset) + (cValue & BitUtil.getMaxValue(offset));

  counter._sync(tmp);
}

function _validate(value) {

  if (value % 1 !== 0) {
    this.emit('error', new errors.NotAnIntegerError('value is not an integer'));
    return false;
  }

  if (value < 0) {
    this.emit('error', new errors.NotAPositiveIntegerError('value is not a positive integer'));
    return false;
  }

  if (value > this._maxValue) {
    this.emit('error', new errors.OverflowError('value is greater than '+this._maxValue));
    return false;
  }

  return true;
}

module.exports = Field;
