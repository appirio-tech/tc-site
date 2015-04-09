'use strict';

/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */

/*jslint nomen: true*/
/*global angular: true, _: true */
(function(angular) {
  'use strict';
  var submissionUpload = angular.module('tc.submissionUpload');
  submissionUpload.controller('viewSubmissionCtrl', ['ViewSubmissionsService', '$scope', '$q', 'Utils',

    function(ViewSubmissionsService, $scope, $q, Utils) {
      ViewSubmissionsService.getSubmissions($scope.uCtrl.challengeId).then(function(submissions){
        $scope.uCtrl.gridData = [];
        $.each(submissions, function(index, submission) {
          $scope.uCtrl.gridData.push({
            'id' : submission.submissionId,
            'rank' : submission.ranking,
            'date' : Utils.formatDate(submission.submissionDate, 'MMM DD,YYYY hh:mm a z'),
            'type' : submission.submissionType,
            'download' : submission.download,
            'thumbnail' : '//studio.topcoder.com/?module=DownloadSubmission&sbmid=' + submission.submissionId + '&sbt=tiny'
          });
        });
      });
    }
  ]);
}(angular));