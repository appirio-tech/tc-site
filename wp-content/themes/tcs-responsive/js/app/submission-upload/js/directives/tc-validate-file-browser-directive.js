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
   * The directive is to validate the file browser when recieving message 'tc-validate'.
   */
  .directive('tcValidateFileBrowser', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        var error = element.children('.error');
        var fileInput = element.children('.fileInput');

        scope.$on('tc-validate', function() {
          var url = fileInput.val();
          var typeString = fileInput.data('type');
          var validated = true;
          if (url === '') {
            error.text('Please upload a submission first');
            validated = false;
          } else if (typeString) {
            var type = typeString.split(',');
            var ext = url.split('.').pop().toLowerCase();
            if ($.inArray(ext, type) == -1) {
              //bugfix: if wrong file type, show correct error message
              if (type.length > 1) {
                //display error if multiple file formats available
                error.text('Uploaded submissions must be in one of the following file formats: .' + type.join(', .'));
              } else {
                //display error if only one file format is available
                error.text('Uploaded submissions must be in .' + type[0] + ' format only');
              }
              validated = false;
            }
          }

          scope.uCtrl[attr.tcValidateFileBrowser + '_file'] = fileInput.prop('files')[0];

          if (validated) {
            element.removeClass('empty');
          } else {
            scope.uCtrl.validated = false;
            element.addClass('empty');
          }
        });
      }
    }
  });
})();