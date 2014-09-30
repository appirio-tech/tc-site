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
  .directive('tcValidateFont', ['Utils', function(Utils) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {

        var error = element.children('.error');

        scope.$on('tc-validate', function() {
          var validated = true;

          if (Utils.isBlank(scope.value['site'])) {
            if (!Utils.isBlank(scope.value['name']) || !Utils.isBlank(scope.value['url'])) {
              validated = false;
              error.text('Choose font source from the approved list.');
            }
          } else if (scope.value['site'] === 'Studio Standard Fonts list') {
            if (Utils.isBlank(scope.value['name'])) {
              validated = false;
              error.text('Font name should not be empty.');
            } else {
              scope.value['url'] = 'dummy';
            }
          } else {
            var blankFields = [];
            if (Utils.isBlank(scope.value['name'])) {
              validated = false;
              blankFields.push('Font name');
            }
            if (Utils.isBlank(scope.value['url'])) {
              validated = false;
              blankFields.push('Font URL Source');
            }
            error.text(blankFields.join(', ') + ' should not be empty.');
          }
          if (validated) {
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