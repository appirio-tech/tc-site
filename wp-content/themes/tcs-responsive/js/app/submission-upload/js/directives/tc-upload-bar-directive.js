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
   * This directive watch on the uploading status, and animate the loading bar according to it.
   * There are four uploading status: uploading, success, fail and none. the status is stored in
   * uCtrl.uploadState in angular scope.
   */
  .directive('tcUploadBar', ['SubmitService',
    function(SubmitService) {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          //The loader represents the loader bar, the percentage represents the percentage text.
          var loader = element.find('.loader');
          var percentage = element.find('.percentage');
          var cancelButton = element.find('#cancelUpload');

          cancelButton.click(function() {
            SubmitService.cancel();
            scope.$apply(function() {
              scope.uCtrl.setUploadState('none');
            });
          });

          scope.$watch('uCtrl.uploadState', function(state) {
            switch (state) {
              case 'uploading':
                ajaxFileUpload();
                break;
              case 'success':
                ajaxFileUploadSuccess();
                break;
              case 'fail':
                ajaxFileUploadFailed();
                break;
              case 'none':
                loader.stop();
                break;
              default:
            }
          });

          function ajaxFileUpload() {
            //To restore loader bar from the previous animation.
            loader.removeAttr('style');
            animate(loader, "90%", 5000);
          }

          function ajaxFileUploadSuccess() {
            loader.stop();
            animate(loader, "100%", 2000);
          }

          function ajaxFileUploadFailed() {
            loader.stop();
            animate(loader, "100%", 500);
          }

          function animate(loader, width, duration) {
            loader.animate({
              width: width
            }, {
              duration: duration,
              step: function(width) {
                if (parseInt(width) > 50) {
                  percentage.css({
                    color: '#fff'
                  });
                } else {
                  percentage.removeAttr('style');
                }
                percentage.html(parseInt(width) + '%');
              }
            });
          }
        }
      }
    }
  ]);
})();