/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';

/**
 * The base controller, responsible to cache request.
 */
var BaseCtrl = function ($scope) {
  this.cache = {};
  //data science tab caches sub tracks directly.
  this.cache['dataScience'] = {};

  var baseCtrl = this;

  $scope.$watch('coder', function () {
    //If coder is not found, then no need to issue further rest apis.
    if($scope.coder !== undefined && jQuery.isEmptyObject($scope.coder)){
      location.href = '/404.php';
	  // set its data to empty.
      baseCtrl.cache['develop'] = {};
      baseCtrl.cache['design'] = {};
      baseCtrl.cache['dataScience']['algorithm'] = {};
      baseCtrl.cache['dataScience']['marathon'] = {};
    }	
  });
};

/**
 * Register the controller into Angular <code>tc</code> module.
 */
tc.controller('BaseCtrl', BaseCtrl);