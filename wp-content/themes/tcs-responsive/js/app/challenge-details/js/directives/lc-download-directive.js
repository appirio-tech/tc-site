'use strict';

/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

/*jslint nomen: true*/
/*global angular: true, _: true */
(function () {
  angular
    .module('lc.directives.download', ['lc.services.download'])

    .directive('lcDownload', ['DownloadService', '$window',
      function (DownloadService, $window) {
        return {
          restrict: 'E',
          scope: {
            challengeId: '=',
            fileId: '=',
            documentName: '=',
            submissionId: '='
          },
          controller: function($scope) {
            $scope.download = function() {
              DownloadService.getDownloadUrl($scope.challengeId, $scope.fileId)
                .then(function(result) {
                  if (result.content.url) {
                    $window.location.href= result.content.url;
                  }
                  $window.alert("error while attempting to download the file");
                });
            };

            $scope.downloadSubmission = function($scope) {
              DownloadService.getSubmissionFileUrl($scope.challengeId, $scope.submissionId, $scope.fileId)
                .then(function(result) {
                  $window.location.href= result.url;
                });
            };
          },
          template: '<a href="javascript:;" data-ng-click="download()">{{documentName}}</a>'
        }
      }
    ])

})();