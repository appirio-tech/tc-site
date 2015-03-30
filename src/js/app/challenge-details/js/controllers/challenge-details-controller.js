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

  /**
   * Create controller Challenge Details
   */
  angular
    .module('challengeDetails')
    .controller('CDCtrl', ChallengeDetailCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  ChallengeDetailCtrl.$inject = ['$scope', 'ChallengeService', '$q', '$cookies', '$location', '$interval', '$timeout', 'isLC', 'lcDiscussionURL', 'DiscussionService'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function ChallengeDetailCtrl($scope, ChallengeService, $q, $cookies, $location, $interval, $timeout, isLC, lcDiscussionURL) {

    // set challengeId and challengeType from the url
    challengeId = $location.path().split("/")[2];
    challengeType = $location.search().type;

    var vm = this;
    // default review style
    vm.reviewStyle = "";
    vm.reviewStyleTooltip = "";

    vm.callComplete = false;
    vm.scope = $scope;

    vm.isLC = isLC;
    vm.lcDiscussionURL = lcDiscussionURL;
    vm.lcSiteUrl = lcSiteUrl;
    vm.lcChallengeId = challengeId;

    // Global variable available from ng-page-challenge-details.php
    vm.challengeType = challengeType;
    vm.siteURL = siteURL;

    vm.isLoggedIn = typeof $cookies.tcjwt !== 'undefined' && typeof $cookies.tcsso !== 'undefined';
    vm.delayAction = typeof $cookies.tcDelayChallengeAction !== 'undefined';
    if (vm.delayAction) {
      vm.tcDoAction = $cookies.tcDelayChallengeAction.split('|');
    }
    vm.activeTab = 'details';
    if (window.location.hash == '#viewRegistrant' || window.location.hash == '#/viewRegistrant') vm.activeTab = 'registrants';
    else if (window.location.hash == '#winner' || window.location.hash == '#/winner') vm.activeTab = 'results';
    else if (window.location.hash == '#submissions' || window.location.hash == '#/submissions') vm.activeTab = 'submissions';
    // update global var activeTab
    activeTab = vm.activeTab;
    vm.numCheckpointSubmissions = -1;
    vm.checkpointData = false;
    vm.checkpointResults = false;
    vm.numberOfPassedScreeningSubmissions = 0;
    vm.numberOfPassedScreeningUniqueSubmitters = 0;
    vm.numberOfUniqueSubmitters = 0;
    vm.checkpointPassedScreeningSubmitterPercentage = 0;
    vm.checkpointPassedScreeningSubmissionPercentage = 0;

    $interval(function () {
      if (vm.challenge && vm.challenge.currentPhaseRemainingTime) {
        vm.challenge.currentPhaseRemainingTime -= 5;
      }
    }, 5000);

    // Methods
    vm.registerToChallenge = registerToChallenge;

    // functions
    $scope.round = Math.round;
    $scope.range = rangeFunction;
    $scope.max = maxFunction;

    $scope.showRegistrants = function () {
      var current = $('a.active').attr('href');
      $(current).hide();
      $("#viewRegistrant").fadeIn();
      $('a.active').removeClass('active');
      $('a[href="#viewRegistrant"]').addClass('active');

      $('#mainContent').attr('class', '').addClass('splitLayout').addClass('currentTab-viewRegistrant');

      updateTabForNonResults();
    };

    var handlePromise = $q.defer();
    //The handle is needed to enable the buttons
    app
        .getHandle(function (handle) {
          handlePromise.resolve(handle);
        }
    );

    handlePromise
        .promise
        .then(function (handle) {
          vm.handle = handle;
          initChallengeDetail(handle, vm, ChallengeService);
        }
    );

    /**
     *
     * @param x
     * @param y
     * @returns {*}
     */
    function maxFunction(x, y) {
      return x > y ? x : y;
    }

    /**
     *
     * @param from
     * @param to
     * @returns {Array}
     */
    function rangeFunction(from, to) {
      var ans = [];
      for (var i = from; i < to; i++) {
        ans.push[i];
      }
      return ans;
    }

    /**
     *
     * @param handle
     * @param vm
     * @param ChallengeService
     */
    function initChallengeDetail(handle, vm, ChallengeService) {
      ChallengeService
          .getChallenge(challengeId)
          .then(function (challenge) {
            processChallenge(challenge, handle, vm, ChallengeService);
            vm.callComplete = true;
            $timeout(function () {
              window.prerenderReady = true;
            }, 100);
            $('#cdNgMain').show();
          });

    }

    function updateChallengeDetail() {
      ChallengeService
          .getChallenge(challengeId)
          .then(function (challenge) {
            processChallenge(challenge, vm.handle, vm, ChallengeService);
          });
    }

    /**
     * Register to challenge
     */
    function registerToChallenge() {

      if (app.isLoggedIn()) {
        ChallengeService
            .registerToChallenge(challengeId)
            .then(
            function (data) {
              if (data["message"] === "ok") {
                showModal("#registerSuccess");
                //check if auto registered through delayAction cookie
                if (vm.delayAction && vm.tcDoAction[0] == 'register' && vm.tcDoAction[1] == vm.challenge.challengeId) {
                  //delete cookie
                  document.cookie = 'tcDelayChallengeAction=; path=/; domain=.' + tcconfig.domain + '; expires=' + new Date(0).toUTCString();
                }
                updateChallengeDetail();
              } else if (data["error"]["details"] === "You should agree with all terms of use.") {
                window.location = siteURL + "/challenge-details/terms/" + vm.challenge.challengeId + "?challenge-type=" + challengeType + '&lc=' + isLC;
              } else if (data["error"]["details"]) {
                showError(data["error"]["details"]);
              }
            }
        );
      } else {
        //set register Delay cookie for auto register when user returns to page
        //angularjs $cookies is too basic and does not support setting any cookie options such as expires, so must use jQuery method here
        $.cookie.raw = true;
        $.cookie('tcDelayChallengeAction', 'register|' + vm.challenge.challengeId + '|' + encodeURIComponent(vm.challenge.challengeName), {
          expires: 31,
          path: '/',
          domain: '.' + tcconfig.domain
        });
        $('.actionLogin').click();
      }


    };

    /**
     *
     * @param template
     * @returns {string}
     */
    $scope.getTemplateURL = function (template) {
      return base_url + '/js/app/challenge-details/partials/' + template;
    }

  }

  /**
   * Prepare data for template
   *
   * @param challenge
   * @param vm
   * @param ChallengeService
   */
  function processChallenge(challenge, handle, vm, ChallengeService) {

    // Global variable available from ng-page-challenge-details.php
    challengeName = challenge.challengeName;
    vm.isDesign = (challengeType === 'design');
    vm.allowDownloads = challenge.currentPhaseName === 'Registration' || challenge.currentPhaseName === 'Submission';

    ChallengeService
      .getDocuments(challengeId, challengeType)
      .then(function(data) {
        if (data && !data.error) {
          challenge.Documents = data.Documents;
        }
      });


    if ((challenge.currentPhaseName != 'Stalled' && challenge.checkpointSubmissionEndDate && challenge.checkpointSubmissionEndDate != '') || (challenge.checkpoints && challenge.checkpoints.length > 0)) {
      ChallengeService
        .getCheckpointData(challengeId)
        .then(function(data) {
        if (data && !data.error) {
          vm.checkpointData = data;
          vm.checkpointResults = data.checkpointResults;
          //set variables for design challenge checkpoint results
          if (vm.isDesign) {
            vm.numCheckpointSubmissions = data.numberOfPassedScreeningSubmissions;
            vm.numberOfPassedScreeningSubmissions = data.numberOfPassedScreeningSubmissions;
            vm.numberOfPassedScreeningUniqueSubmitters = data.numberOfPassedScreeningUniqueSubmitters;
            vm.numberOfUniqueSubmitters = data.numberOfUniqueSubmitters;
            vm.checkpointPassedScreeningSubmitterPercentage = Math.floor((vm.numberOfPassedScreeningUniqueSubmitters / vm.numberOfUniqueSubmitters) * 100);
            vm.checkpointPassedScreeningSubmissionPercentage = Math.floor((vm.numberOfPassedScreeningSubmissions / vm.numCheckpointSubmissions) * 100);
          }
        }
      });
    }

    //Bugfix refactored-challenge-details-40: format currency values with comma delimiters
    if (typeof challenge.reliabilityBonus === 'number') {
      challenge.reliabilityBonus = challenge.reliabilityBonus.format();
    }
    //loop over prizes and format number values
    for (var i = 0; i < challenge.prize.length; i++) {
      challenge.prize[i] = challenge.prize[i].format();
    }

    vm.scope.challenge = vm.challenge = challenge;

    var regList = challenge.registrants.map(function(x) { return x.handle; });
    var submitters = challenge.registrants.map(function(x) {
      if (x.submissionDate.length > 0) {
        return x.handle;
      }
    });

    var provisionalNumFinalSubmitters = challenge.registrants.filter(function(x) {
      return x.submissionDate.length > 0;
    }).length;
    var submissionMap = challenge.submissions.map(function(x) { return x.handle; });

    // this are the buttons for registration and submission
    vm.challenge.registrationDisabled = true;
    vm.challenge.submissionDisabled   = true;
    // button for peer review for challenges with reviewType === PEER
    vm.challenge.peerReviewDisabled   = true;

    vm.challenge.url = window.location.href;

    // If is not registered, then enable registration
    if (((moment(challenge.phases[0].scheduledStartTime)) < moment() && (moment(challenge.registrationEndDate)) > moment()) && regList.indexOf(handle) == -1 && challenge.currentStatus == 'Active') {
      vm.challenge.registrationDisabled = false;
    }

    vm.isRegistered = true;
    if (regList.indexOf(handle) == -1) {
      vm.isRegistered = false;
    }

    //check autoRegister (terms link register) and DelayAction cookie status
    if (autoRegister) {
      autoRegister = false;
      vm.registerToChallenge();
    } else if (vm.delayAction) {
      if (typeof challengeId !== 'undefined' && vm.tcDoAction[0] === 'register' && vm.tcDoAction[1] === challengeId) {
        //check if registration still open
        if (!vm.challenge.registrationDisabled) {
          vm.registerToChallenge();
        } else {
          //can no longer register, delete cookie
          document.cookie = 'tcDelayChallengeAction=; path=/; domain=.' + tcconfig.domain + '; expires=' + new Date(0).toUTCString();
        }
      }
    }

    // If is not submited, then enable submission
    if (((moment(challenge.submissionEndDate)) > moment()) && regList.indexOf(handle) > -1) {
      vm.challenge.submissionDisabled = false;
    }

    var currentDate = new Date();
    if(challenge.challengeCommunity == 'design' && challenge.checkpointSubmissionEndDate && vm.isLoggedIn && regList.indexOf(handle) > -1 && new Date(challenge.currentPhaseEndDate) > new Date(challenge.checkpointSubmissionEndDate)){
      //checkpoint phase
      if(currentDate.getTime() < new Date(challenge.checkpointSubmissionEndDate)) {
        challenge.currentPhaseEndDate = challenge.checkpointSubmissionEndDate;
        challenge.currentPhaseName = 'Checkpoint';
      } else if( currentDate.getTime() < new Date(challenge.submissionEndDate)){ //past checkpoint - submission phase
        challenge.currentPhaseEndDate = challenge.submissionEndDate;
        challenge.currentPhaseName = 'Submission';
      }
    }

    if (challenge.currentPhaseEndDate) {
      var endPhaseDate = new Date(challenge.currentPhaseEndDate);
      vm.challenge.currentPhaseRemainingTime = Math.max((endPhaseDate.getTime()-currentDate.getTime())/1000, 0) || -1;
    }
    else vm.challenge.currentPhaseRemainingTime = -1;

    vm.challenge.registrants.map(function(x) {
      if (submissionMap[x.handle]) x.submissionStatus = submissionMap[x.handle].submissionStatus;
    });

    vm.reliabilityBonus = challenge.reliabilityBonus;
    vm.inSubmission     = challenge.currentPhaseName.indexOf('Submission') >= 0;
    vm.inScreening      = challenge.currentPhaseName.indexOf('Screening') >= 0;
    vm.inReview         = challenge.currentPhaseName.indexOf('Review') >= 0;
    vm.hasFiletypes     = ((typeof challenge.filetypes) !== 'undefined') && challenge.filetypes.length > 0;
    vm.numRegistrants   = challenge.numberOfRegistrants;
    vm.numSubmissions   = challenge.numberOfSubmissions;
    vm.numCheckpointSubmissions = challenge.numberOfCheckpointSubmissions;
    vm.isPeerReviewed = vm.challenge.reviewType === 'PEER';

    // update peer review button flag
    if (handle && vm.isPeerReviewed && vm.inReview && submitters.indexOf(handle) != -1) {
      vm.challenge.peerReviewDisabled = false;
    }
    // challenge review style
    if (vm.challenge.reviewType == 'PEER') {
      vm.reviewStyle = 'Peer Review';
      vm.reviewStyleTooltip = 'Your peers performs a thorough review based on scorecards.';
    } else {
      vm.reviewStyle = 'Community Review Board';
      vm.reviewStyleTooltip = 'Community Review Board performs a thorough review based on scorecards.';
    }

    vm.hasCheckpoints = vm.numCheckpointSubmissions > 0;
    if (vm.numSubmissions == 0 && !vm.hasCheckpoints && provisionalNumFinalSubmitters > 0) {
      vm.numSubmissions = provisionalNumFinalSubmitters;
    }
    vm.submissionNumberString = function() {
      if (vm.results || !vm.hasCheckpoints) return '(' + vm.numSubmissions + ')';
      return '';
    }

    // Result section, if status completed
    vm.submissions = false;
    if (challenge.currentStatus != 'Draft' && (challenge.currentPhaseName != 'Stalled' || challenge.currentStatus == 'Completed') && (challenge.currentStatus == 'Completed' || challenge.currentPhaseEndDate == '')) {
      ChallengeService
        .getResults(challengeId)
        .then(function(results) {
          vm.results = results;
          vm.firstPlaceSubmission = results.firstPlaceSubmission;
          vm.secondPlaceSubmission = results.secondPlaceSubmission;
          vm.submissions = results.submissions;
          //set variables for design challenge results
          if (vm.isDesign) {
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
            vm.finalSubmittersPassedScreening = resultPassingHandles.filter(function(element, elIndex, arr){
              return arr.indexOf(element) == elIndex;
            }).length;

            //push all submitter handles to new array
            var resultHandles = [];
            results.results.forEach(function(el){
              resultHandles.push(el.handle);
            });
            //get number of unique final submitters regardless of screening status
            vm.numFinalSubmitters = resultHandles.filter(function(element, elIndex, arr){
              return arr.indexOf(element) == elIndex;
            }).length;

            vm.numFinalSubmissions = results.numSubmissions;
            vm.finalSubmissionsPassedScreening = results.submissionsPassedScreening;
            vm.finalPassedScreeningSubmitterPercentage = Math.floor((vm.finalSubmittersPassedScreening / vm.numFinalSubmitters) * 100);
            vm.finalPassedScreeningSubmissionPercentage = Math.floor((vm.finalSubmissionsPassedScreening / vm.numFinalSubmissions) * 100);
          }
          vm.initialScoreSum = 0;
          vm.finalScoreSum = 0;
          vm.submissions.map(function(x) {
            vm.initialScoreSum += x.initialScore;
            vm.finalScoreSum += x.finalScore;
          });

          vm.winningSubmissions = [];
          var winnerMap = {};
          for (var i = 0; i < vm.submissions.length; i++) {
            if (challenge.prize[i] && vm.submissions[i].submissionStatus != 'Failed Review') {
              vm.winningSubmissions.push(vm.submissions[i]);
              winnerMap[vm.submissions[i].handle] = true;
            }
          }
          vm.challenge.registrants.map(function(x) {
            if (winnerMap[x.handle]) x.winner = true;
          });
          if (vm.winningSubmissions.length == 0) vm.firstPlaceSubmission = false;
          if (vm.winningSubmissions.length < 2) vm.secondPlaceSubmission = false;
        }
      );
    }
  }

})();
