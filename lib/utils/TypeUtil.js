'use strict';

function is(type) {
  return function (object) {
    return toString.call(object) === '[object '+type+']';
  };
}

exports.isFunction = is('Function');
exports.isString = is('String');
exports.isNumber = is('Number');
