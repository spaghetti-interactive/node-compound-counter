'use strict';

var
  pow = Math.pow,
  floor = Math.floor,
  log2 = Math.log2 || function (x) {
    return Math.log(x) / Math.LN2;
  };

exports.getMaxValue = function (length) {
  return pow(2, length) - 1;
};

exports.getLength = function (value) {
  return floor(log2(value) + 1);
};
