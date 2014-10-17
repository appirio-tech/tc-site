'use strict';

/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */

/*jslint nomen: true*/
/*global angular: true, _: true */
(function() {

  angular
    .module('tc.shared.directives.tcNumberOnly', [])
  /**
   * The directive Check the input during $parsers' parse phase, and eliminate
   * improper inputs(those are not numbers).
   * The ng-model is required. The usage is simple:
   *
   * <ANY_ELEMENT ng-model tc-number-only></ANY_ELEMENT>
   *
   */
  .directive('tcNumberOnly', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {

        modelCtrl.$parsers.push(function(inputValue) {

          var transformedInput = inputValue.replace(/[^0-9]/g, '');

          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      }
    };
  });
})();