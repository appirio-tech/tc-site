/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';

/**
 * This filter enable conditional statment for angular expression.
 * usage: {{ expression | iif : value1 : value2}}
 */
tc.filter('iif', function () {
  return function (input, trueValue, falseValue) {
    return input ? trueValue : falseValue;
  };
});