'use strict';

/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

/*jslint nomen: true*/
/*global angular: true, _: true */
(function (angular) {
  angular
    .module('lc.directives', [])

    .directive('lcDownload', ['DownloadService', '$window',
      function (DownloadService, $window) {
        return {
          restrict: 'E',
          scope: {
            challengeId: '=',
            fileId: '=',
            documentName: '='
          },
          controller: function($scope) {
            console.log($scope);
            $scope.download = function() {
              DownloadService.getDownloadUrl($scope.challengeId, $scope.fileId)
                .then(function(result) {
                  $window.location.href= result.url;
                });
            }
          },
          template: '<a href="javascript:;" data-ng-click="download()">{{documentName}}</a>'
        }
      }
    ])

})(angular);