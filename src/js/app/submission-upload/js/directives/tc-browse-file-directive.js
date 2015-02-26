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
   *The directive is to browser file.
   * To facilitate the css design, the file browser template is as follows, which
   * use a <p> tag and <a> tag to replace the original <input type="file">. The <p>
   * tag display file name, the <a> tag is the browse button, and the <input> play
   * the real work in the backend and can't be seen.
   *
   * The exposed classes please see the template.
   *
   * <ANY_ELEMENT tc-browse-file>
   *    <p class="fileNameDisplay fileNameDisplayNoFile">Any text</p>
   *    <a class="fileBrowser" href>Browse</a>
   *    <span class="error">error messages here</span>
   *    <input type="file" class="fileInput">
   * </ANY_ELEMENT>
   */
  .directive('tcBrowseFile', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        var fileNameDisplay = element.children('.fileNameDisplay');
        var fileBrowser = element.children('.fileBrowser');
        var fileInput = element.children('.fileInput');

        fileBrowser.on('click', function() {
          //The class 'empty' toggles the validation results. When starting select a
          //new file, to remove class 'empty' means to hide validation results.
          element.removeClass('empty');
          //Delegate the work to the real file input.
          fileInput.trigger('click');
        });

        fileInput.on('change', function() {
          var path = fileInput.val();
          fileNameDisplay.html(getFileName(path)).removeClass("fileNameDisplayNoFile");
        });

        function getFileName(path) {
          //windows path.
          var lastIndex = path.lastIndexOf('\\');
          var fileName = path.substring(lastIndex + 1);
          //linux path.
          var lastIndex = path.lastIndexOf('/');
          var name2 = path.substring(lastIndex + 1);
          if (fileName.length > name2.length) {
            fileName = name2;
          }
          return fileName;
        }
      }
    }
  });
})();