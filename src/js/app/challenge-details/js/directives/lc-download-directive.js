'use strict';

/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

/*jslint nomen: true*/
/*global angular: true, _: true */
(function () {
  angular
    .module('lc.directives.download', ['lc.services.download'])

    .directive('lcDownload', ['DownloadService', '$window', '$log',
      function (DownloadService, $window, $log) {
        return {
          restrict: 'E',
          scope: {
            challengeId: '=',
            fileId: '=',
            documentName: '=',
            submissionId: '='
          },
          controller: function($scope) {
            $scope.download = function () {
              if ($scope.submissionId) {
                DownloadService.getSubmissionUrl($scope.challengeId, $scope.submissionId, $scope.fileId)
                  .then(function (result) {
                    if (result.content && result.content.url) {
                      $window.location.href = result.content.url;
                    } else {
                      $log.error(result);
                      $window.alert("error while attempting to download the file");
                    }
                  });
              } else {
                DownloadService.getDownloadUrl($scope.challengeId, $scope.fileId)
                  .then(function (result) {
                    if (result.content && result.content.url) {
                      $window.location.href = result.content.url;
                    } else {
                      $log.error(result);
                      $window.alert("error while attempting to download the file");
                    }
                  });
              }
            };
          },
          template: '<a href="javascript:;" data-ng-click="download()">{{documentName}}</a>'
        }
      }
    ])

})();