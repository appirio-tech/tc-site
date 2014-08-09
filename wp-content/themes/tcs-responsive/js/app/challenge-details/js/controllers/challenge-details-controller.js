/*
 * TODO:
 * - Bring up to style guide standards
 *   - lots of different stuff under this heading:
 *   - move logic out of controllers
 *   - resolve promises correctly
 *   - etc
 * - Eliminate jQuery / move DOM logic to directives
 * - Split into different controllers where applicable
 * - Rename file (all files should be named after the units they contain - 
 *   'controllers.js' is too generic)
 */
(function () {

  angular
    .module('challengeDetails')
    .controller('CDCtrl', ChangeDetailCtrl);

  ChangeDetailCtrl.$inject = ['$scope', 'ChallengeService', '$sce'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @param $sce
   * @constructor
   */
  function ChangeDetailCtrl($scope, ChallengeService, $sce) {
    $scope.callComplete = false;

    $scope.trust = function (x) {
      return $sce.trustAsHtml(x);
    };

    $scope.range = function (from, to) {
      var ans = [];
      for (var i = from; i < to; i++) {
        ans.push[i];
      }
      return ans;
    };

    // @TODO Move to filter
    $scope.max = function (x, y) {
      return x > y ? x : y;
    };

    // Global variable available from ng-page-challenge-details.php
    $scope.challengeType = challengeType;

    $scope.round = Math.round;

    $scope.activeTab = 'details';
    if (window.location.hash == '#viewRegistrant') {
      $scope.activeTab = 'registrants';
    } else if (window.location.hash == '#winner') {
      $scope.activeTab = 'winners';
    } else if (window.location.hash == '#submissions') {
      $scope.activeTab = 'submissions';
    }

    $scope.numCheckpointSubmissions = -1;
    $scope.checkpointData = false;
    $scope.checkpointResults = false;
    $scope.numberOfPassedScreeningSubmissions = false;
    $scope.numberOfPassedScreeningUniqueSubmitters = false;
    $scope.numberOfUniqueSubmitters = false;
    $scope.checkpointPassedScreeningSubmitterPercentage = false;
    $scope.checkpointPassedScreeningSubmissionPercentage = false;

    ChallengeService.getChallenge(challengeId).then(function (challenge) {
      processChallenge(challenge, $scope, ChallengeService);
      $scope.callComplete = true;
    });
  }

  /**
   * Prepare data for template
   *
   * @param challenge
   * @param $scope
   * @param ChallengeService
   */
  function processChallenge(challenge, $scope, ChallengeService) {

    // Global variable available from ng-page-challenge-details.php
    challengeName = challenge.challengeName;
    $scope.isDesign = $scope.challengeType == 'design';

    if (challenge.checkpointSubmissionEndDate && challenge.checkpointSubmissionEndDate != '') {
      ChallengeService.getCheckpointData(challengeId).then(function(data) {
        if (data && !data.error) {
          $scope.checkpointData = data;
          $scope.checkpointResults = data.checkpointResults;
          $scope.numCheckpointSubmissions = data.numberOfSubmissions;
          //set variables for design challenge checkpoint results
          if ($scope.isDesign) {
            $scope.numberOfPassedScreeningSubmissions = data.numberOfPassedScreeningSubmissions;
            $scope.numberOfPassedScreeningUniqueSubmitters = data.numberOfPassedScreeningUniqueSubmitters;
            $scope.numberOfUniqueSubmitters = data.numberOfUniqueSubmitters;
            $scope.checkpointPassedScreeningSubmitterPercentage = Math.floor(($scope.numberOfPassedScreeningUniqueSubmitters / $scope.numberOfUniqueSubmitters) * 100);
            $scope.checkpointPassedScreeningSubmissionPercentage = Math.floor(($scope.numberOfPassedScreeningSubmissions / $scope.numCheckpointSubmissions) * 100);
          }
        }
      });
    }

    challenge.registrationDisabled = true;
    challenge.submissionDisabled   = true;

    ChallengeService.completeStepDisabled(challenge);

    //Bugfix refactored-challenge-details-40: format currency values with comma delimiters
    if (typeof challenge.reliabilityBonus === 'number') {
      challenge.reliabilityBonus = challenge.reliabilityBonus.format();
    }
    //loop over prizes and format number values
    for (var i = 0; i < challenge.prize.length; i++) {
      challenge.prize[i] = challenge.prize[i].format();
    }

    $scope.siteURL   = siteURL;
    $scope.challenge = challenge;

    $scope.reliabilityBonus = challenge.reliabilityBonus;
    $scope.inSubmission     = challenge.currentPhaseName.indexOf('Submission') >= 0;
    $scope.inScreening      = challenge.currentPhaseName.indexOf('Screening') >= 0;
    $scope.inReview         = challenge.currentPhaseName.indexOf('Review') >= 0;
    $scope.hasFiletypes     = (challenge.filetypes != undefined) && challenge.filetypes.length > 0;

    var submissionMap = {};
    $scope.challenge.submissions.map(function(x) {
      submissionMap[x.handle] = x;
    });
    $scope.challenge.registrants.map(function(x) {
      if (submissionMap[x.handle]) x.submissionStatus = submissionMap[x.handle].submissionStatus;
    });

    if (challenge.currentStatus == 'Completed' || challenge.currentPhaseEndDate == '') {
      ChallengeService.getResults(challengeId).then(function(results) {
        $scope.results = results;
        $scope.firstPlaceSubmission = results.firstPlaceSubmission;
        $scope.secondPlaceSubmission = results.secondPlaceSubmission;
        $scope.submissions = results.submissions;
        //set variables for design challenge results
        if ($scope.isDesign) {
          //filter all submitters that passed screening
          var passedScreen = results.results.filter(function(element){
            if (element.submissionStatus !== "Failed Screening") {
              return true;
            }
            return false;
          });
          //push all passing submitter handles to new array
          var resultPassingHandles = [];
          passedScreen.forEach(function(el){
            resultPassingHandles.push(el.handle);
          });
          //get number of unique final submitters that have passed screening
          $scope.finalSubmittersPassedScreening = resultPassingHandles.filter(function(element, elIndex, arr){
            return arr.indexOf(element) == elIndex;
          }).length;

          //push all submitter handles to new array
          var resultHandles = [];
          results.results.forEach(function(el){
            resultHandles.push(el.handle);
          });
          //get number of unique final submitters regardless of screening status
          $scope.numFinalSubmitters = resultHandles.filter(function(element, elIndex, arr){
            return arr.indexOf(element) == elIndex;
          }).length;

          $scope.numFinalSubmissions = results.numSubmissions;
          $scope.finalSubmissionsPassedScreening = results.submissionsPassedScreening;
          $scope.finalPassedScreeningSubmitterPercentage = Math.floor(($scope.finalSubmittersPassedScreening / $scope.numFinalSubmitters) * 100);
          $scope.finalPassedScreeningSubmissionPercentage = Math.floor(($scope.finalSubmissionsPassedScreening / $scope.numFinalSubmissions) * 100);
        }
        $scope.initialScoreSum = 0;
        $scope.finalScoreSum = 0;
        $scope.submissions.map(function(x) {
          $scope.initialScoreSum += x.initialScore;
          $scope.finalScoreSum += x.finalScore;
        });

        $scope.winningSubmissions = [];
        var winnerMap = {};
        for (var i = 0; i < $scope.submissions.length; i++) {
          if (challenge.prize[i] && $scope.submissions[i].submissionStatus != 'Failed Review') {
            $scope.winningSubmissions.push($scope.submissions[i]);
            winnerMap[$scope.submissions[i].handle] = true;
          }
        }
        $scope.challenge.registrants.map(function(x) {
          if (winnerMap[x.handle]) x.winner = true;
        });
        if ($scope.winningSubmissions.length == 0) $scope.firstPlaceSubmission = false;
        if ($scope.winningSubmissions.length < 2) $scope.secondPlaceSubmission = false;
      });
    } else {
      $scope.submissions = false;
    }
  }

})();