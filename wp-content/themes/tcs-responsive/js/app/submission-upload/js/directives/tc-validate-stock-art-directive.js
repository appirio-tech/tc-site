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
   *The directive is to validate the stock art element when recieving tc-validate message.
   */
  .directive('tcValidateStockArt', [ 'Utils', function(Utils) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {

        var error = element.children('.error');

        scope.$on('tc-validate', function() {
          var blank = false,
            nonBlank = false;
          var blankFields = [];
          var fields = ['photo', 'number', 'url'];
          var fieldsName = ['Photo description', 'Photo URL', 'File number'];
          $.each(fields, function(index, field) {
            if (Utils.isBlank(scope.value[field])) {
              blank = true;
              blankFields.push(fieldsName[index]);
            } else {
              nonBlank = true;
            }
          });
          if (blank && nonBlank) {
            scope.uCtrl.validated = false;
            error.text(blankFields.join(', ') + ' should not be empty.');
            element.addClass('empty');
          } else {
            element.removeClass('empty');
          }
        });
      }
    }
  }]);
})();