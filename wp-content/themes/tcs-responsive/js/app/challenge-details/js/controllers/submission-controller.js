var glob;
/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: ecnu_haozi
 * version 1.0
 *
 * TODO:
 * - Bring up to style guide standards
 * - Get rid of prototyping and instead directly create methods
 *   on the controller, which is a little more readable
 */
'use strict';
var sub;

(function() {

  angular
    .module('challengeDetails')
    .controller('SubmissionCtrl', SubmissionCtrl);

  SubmissionCtrl.$inject = ['TEMPLATE_URL', '$scope', 'SubmissionServices'];

  /**
   * The controller function. The parameters are injected.
   * @TEMPLATE_URL the template directory path to construct the patial file location.
   * @$scope the $scope of this controller.
   * @SubmissionServices the service related to challenge submission view.
   */
  function SubmissionCtrl(TEMPLATE_URL, $scope, SubmissionServices) {
    var vm = this;

    vm.init = init;
    vm.pagination = pagination;
    vm.formatDate = formatDate;
    vm.hasSubmission = hasSubmission;
    vm.selectPreview = selectPreview;
    vm.viewSubmission = viewSubmission;
    vm.loadImages = loadImages;

    vm.init(TEMPLATE_URL, SubmissionServices);

    $scope.$watch('challenge', function(){
      glob = $scope.challenge;
      if ($scope.challenge) {
        if (!$scope.challenge.submissionsViewable || $scope.challenge.submissionsViewable == 'false') {
          $scope.challenge.submissionsViewable = false;
        } else {
          $scope.challenge.submissionsViewable = true;
        }
        vm.submissionsViewable = $scope.challenge.submissionsViewable;

        if (vm.hasSubmission($scope.challenge.submissions)) {
          vm.submissionPagedItems = vm.pagination($scope.challenge.submissions);
        }
        if (vm.hasSubmission($scope.challenge.checkpoints)) {
          vm.checkPointPagedItems = vm.pagination($scope.challenge.checkpoints);
        }
      }
    });

    /**
     * Check the given object contains non-empty submissions.
     * @submissions the array of submissions.
     * @viewAll the flag to indicate whether to use pagination or not.
     */
    function pagination(submissions, viewAll) {
      var subCtrl = this;
      var pagedItems = [];
      var count = -1;
      var pageSize = this.pageSize;

      if (viewAll) {
        pageSize = submissions.length;
      }

      for (var i = 0; i < submissions.length; i++) {
        if (i % pageSize === 0) {
          pagedItems.push([]);
          count++;
        }
        var submission = submissions[i];
        submission.formattedDate = this.formatDate(submission.submissionTime);
        submission.downloadUrl = "http://studio.topcoder.com/?module=DownloadSubmission&sbmid=" + submission.submissionId;
        submission.gridViewImg = "http://studio.topcoder.com/studio.jpg?module=DownloadSubmission&sbmid=" + submission.submissionId + "&sbt=small&sfi=1";

        /**
         * The downloadCouter and viewCounter is mock data.
         */
        submission.downloadCounter = subCtrl.mockDownloadCounter;
        submission.viewCounter = subCtrl.mockViewCounter;

        pagedItems[count].push(submission);
      }
      return pagedItems;
    }

    /**
     * Convert the date with format like 'Sep 09,2013 12:29 EDT'
     * @date the date to format.
     */
    function formatDate(date) {
      //some function is passing in undefined timezone_string variable causing js errors,
      // so check if undefined and set default:
      if (typeof timezone_string === 'undefined') {
        var timezone_string = "America/New_York"; // lets set to TC timezone
      }
      return moment(date).tz(timezone_string).format("MMM DD,YYYY HH:mm z");
    };


    /**
     * Check the given object contains non-empty submissions.
     * @submissions the array of submissions.
     */
    function hasSubmission(submissions) {
      return $.isArray(submissions) && submissions.length > 0;
    };


    /**
     * The init function.
     * @TEMPLATE_URL the template directory path to construct the patial file location.
     * @SubmissionServices the service related to challenge submission view.
     */
    function init(TEMPLATE_URL, SubmissionServices) {

      // display 3 rows, 4 columns, and thus 12 submissions in total.
      this.column = 4;
      this.pageSize = 12;
      this.submissionViewAll = false;
      this.checkPointViewAll = false;
      this.singleViewMode = false;
      this.submissionCurrentPage = 0;
      this.checkPointCurrentPage = 0;
      this.SubmissionServices = SubmissionServices;
      this.stockArtThreshold = 3;

      //init mock data.
      this.mockDownloadCounter = 40;
      this.mockViewCounter = 290;
      this.mockPreviewTotal = 4;
    };

    /**
     * Select the preview in a single submission.
     * @index the index to select.
     */
    function selectPreview(index){
      var subCtrl = this;
      subCtrl.selectedPreview = index;
    };

    /**
     * The method is triggered when view a single submission.
     * @submission the submission to view.
     * @isFromResultSubmission [optional] if the submission object is from challenge result
     */
    function viewSubmission(submission, isFromResultSubmission) {
      var subCtrl = this;
      if (isFromResultSubmission) {
        submission = findSubmission(submission);
      }
      if (!subCtrl.submissionsViewable || typeof submission === 'undefined' || submission === null) return;
      /*
       * Currently API does not provide us the total number of images,
       * so we don't know what is max value FileIndex.numOfImages field
       * or something like that will be available on
       * https://api.topcoder.com/v2/design/challenges/result/30042826 later.
       * just hardcode it for now.
       */
      submission.previewTotal = subCtrl.mockPreviewTotal;

      submission.previewList = subCtrl.loadImages(submission.previewTotal, 'small', submission.submissionId);

      submission.fullPreviewList = subCtrl.loadImages(submission.previewTotal, 'full', submission.submissionId);

      subCtrl.SubmissionServices.getSubmissionInfo().then(function(submissionInfo){
        subCtrl.submissionInfo = submissionInfo;
      });

      subCtrl.singleViewSubmission = submission;
      subCtrl.selectPreview(0);
      subCtrl.singleViewMode = true;
    }

    /**
     * Use submitter and submissionTime to find submission object of a result submission
     * @resultSubmission submission of challenge result
     */
    function findSubmission(resultSubmission) {
      var submissions = $scope.challenge.submissions;
      if (hasSubmission(submissions)) {
        for (var i = 0; i < submissions.length; i++) {
          if (submissions[i].submitter === resultSubmission.handle && submissions[i].submissionTime === resultSubmission.submissionDate) {
            return submissions[i];
          }
        }
      }
      return null;
    }

    /**
     *Preload the images.
     * @total the total size of the images.
     * @type the type of the images to preload.
     * @id the id indicate whose images to preload.
     */
    function loadImages(total, type, id){
      var subCtrl = this;
      var images = [];
      for (var i = 1; i <= total; i++) {
        images.push(
          'http://studio.topcoder.com/?module=DownloadSubmission&'+
          'sbmid='+ id +
          '&sbt='+ type +
          '&sfi=' + i);
      }
      return images;
    }
  }

})();
