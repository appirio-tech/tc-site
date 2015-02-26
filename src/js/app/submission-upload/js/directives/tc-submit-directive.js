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
   * The directive is to upload submissions when the submit button is clicked, able for both develop and design
   * competitions. It delegates to SubmitService to perform the real work.
   *
   * The applied DOM:
   * <a id="submit" class="btn" tc-submit>Submit</a>
   */
  .directive('tcSubmit', ['SubmitService',
    function(SubmitService) {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          element.on('click', function() {
            if (!scope.uCtrl.termsAgreed) {
              //simply ignore if terms not agreed.
              return;
            }
            if (!app.isLoggedIn()) {
              //ignore if not logged in.
              $('.actionLogin').click();
              return;
            }
            /*
             * Before sending a upload post request, the client side  will do some validations. Those elements who
             * listen to message 'tc-validate' will perform validation  and the result is colleceted in
             * scope.uCtrl.validated.
             */

            //set flag 'uCtrl.validated' before validation.
            scope.uCtrl.validated = true;

            //notify those elements who need validation to validate
            scope.$broadcast('tc-validate');

            //after validation the result stores in flag 'uCtrl.validated'
            if (scope.uCtrl.validated) {
              scope.uCtrl.setUploadState('uploading');

              var promise;
              if (scope.uCtrl.challengeType === 'develop') {
                promise = SubmitService.submitDevelop(
                  scope.uCtrl.challengeId,
                  scope.uCtrl.submission_file
                );
              } else {
                promise = SubmitService.submitDesign(
                  scope.uCtrl.challengeId,
                  scope.uCtrl.submission_file,
                  scope.uCtrl.source_file,
                  scope.uCtrl.preview_file,
                  scope.uCtrl.rank,
                  scope.uCtrl.comment,
                  scope.uCtrl.fonts,
                  scope.uCtrl.stockArts,
                  scope.uCtrl.type
                );
              }
              promise.then(function(data) {
                if (data.submissionId) {
                  scope.uCtrl.setUploadState('success');
                } else {
                  scope.uCtrl.setUploadState('fail');
                  //This modal '#registerFailed' is out of submission-upload angular app(at the footer of page),
                  //so use jQuery manipulation.
                  if (data.error && data.error.details) {
                    $("#registerFailed .failedMessage").text(data.error.details);
                  } else {
                    $("#registerFailed .failedMessage").text("The submission could not be uploaded.");
                  }
                  showModal("#registerFailed");
                }
              });
            }
          });
        }
      };
    }
  ]);
})();