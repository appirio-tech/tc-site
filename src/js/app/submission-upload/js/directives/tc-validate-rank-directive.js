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
    .module('tc.submissionUpload')

  /**
   * The directive is to validate the font element when recieving tc-validate message.
   */
  .directive('tcValidateRank', ['Utils', function(Utils) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {

        var error = element.children('.error');

        scope.$on('tc-validate', function() {
          if (!Utils.isBlank(scope.uCtrl.rank)) {
            element.removeClass('empty');
          } else {
            scope.uCtrl.validated = false;
            element.addClass('empty');
          }
        });
      }
    }
  }]);
})();