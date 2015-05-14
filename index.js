'use strict';

// file deps
var
  Counter = require('./lib/types/Counter'),
  errors = require('./lib/errors');

exports.errors = errors;

exports.forge = function () {
  return Counter.forge();
};
