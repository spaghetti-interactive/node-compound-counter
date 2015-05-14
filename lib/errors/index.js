'use strict';

// module deps
var
  ErrorFoundry = require('error-foundry-js');

[
  'ArgumentTypeError',
  'NotAnIntegerError',
  'NotAPositiveIntegerError',
  'OverflowError',
  'OutOfRangeError',
  'DuplicateError'
].forEach(function (error) {
  exports[error] = ErrorFoundry.forge(error);
});
