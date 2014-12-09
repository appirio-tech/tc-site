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
    .directive('lcSubmit', ['lcSubmitService',
      function(lcSubmitService) {
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
                  promise = lcSubmitService.getUploadUrl(
                    scope.uCtrl.challengeId,
                    scope.uCtrl.submission_file
                  );
                }

                promise.then(function(data) {
                  scope.uCtrl.uploadUrl = data.url;
                  scope.uCtrl.submissionId = data.submissionId;

                  console.log(data);

                  var s3put = lcSubmitService.putToS3(data.url, scope.uCtrl.submission_file);

                  s3put
                    .success(function(data, status, headers, config) {
                      scope.uCtrl.setUploadState('success');
                      console.log(data);
                      console.log(status);
                      console.log(headers);
                      console.log(config);
                    })
                    .error(function(data, status, headers, config) {
                      scope.uCtrl.setUploadState('fail');
                      console.log(data);
                      console.log(status);
                      console.log(headers);
                      console.log(config);

                      if (data.error && data.error.details) {
                        $("#registerFailed .failedMessage").text(data.error.details);
                      } else {
                        $("#registerFailed .failedMessage").text("The submission could not be uploaded.");
                      }
                      showModal("#registerFailed");
                    });
                });
              }
            });
          }
        };
      }
    ]);
})();