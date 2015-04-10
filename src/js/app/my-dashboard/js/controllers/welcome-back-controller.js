/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * Controller for the welcome back widget
 */
 (function () {

  /**
   * Create welcome back widget controller
   */
  angular
    .module('myDashboard')
    .controller('WelcomeBackCtrl', WelcomeBackCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  WelcomeBackCtrl.$inject = ['$scope', '$location', 'AuthService', 'ProfileService', 'ChallengeService', 'PHOTO_LINK_LOCATION', 'COMMUNITY_URL'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param $location location service
   * @param ProfileService services to access profile information via API
   * @param ChallengeService services to access challenge info via API
   * @param PHOTO_LINK_LOCATION base link for user photo
   * @param COMMUNITY_URL base link for community site
   * @constructor
   */
  function WelcomeBackCtrl($scope, $location, AuthService, ProfileService, ChallengeService, PHOTO_LINK_LOCATION, COMMUNITY_URL) {
    var vm = this;
    vm.communityBaseUrl = $location.protocol() + ":" + COMMUNITY_URL;
    // default rating collor
    vm.ratingColor = "color: #999999";
    // flag to determine visibility of upload photo link
    vm.showUploadPhotoLink = false;
    // url for the upload photo link
    vm.uploadPhotoLink = null;
    // count of member stats/metrices to be shown in profile header
    vm.statsToShow = 2;

    // activate controller
    if (AuthService.isLoggedIn === true) {
      activate();
    } else { // if user is not logged in, return (to avoid extra ajax calls)
      return false;
    }

    function activate() {
      // fetch user info to get handle
      app.getHandle(function() {
        ProfileService.getUserProfile(app.handle)
          .then(function(profile) {
            vm.profile = profile;

            var highestRating = 0;

            // Find user's highest rating to set color to the handle
            angular.forEach(vm.profile.ratingSummary, function(value, key) {
              if (highestRating < value.rating) {
                highestRating = value.rating;
                vm.ratingColor = value.colorStyle;
              }
            });

            vm.showUploadPhotoLink = false;
            // Parse user picture link to build photo url
            if (profile && profile.photoLink) {
              if (profile.photoLink.indexOf('//') != -1){
                vm.photoLink = profile.photoLink;
              } else {
                vm.photoLink = PHOTO_LINK_LOCATION + profile.photoLink;
              }
            } else {
              vm.photoLink = PHOTO_LINK_LOCATION + '/i/m/nophoto_login.gif';  
              vm.uploadPhotoLink = $location.protocol + ":" + communityBaseUrl + '/tc?module=MyHome';
              vm.showUploadPhotoLink = true;
            }

            // calculates the count of metrices to be shown in profile header
            if (vm.profile.overallEarning > 0) { // earnings should be shown
              vm.statsToShow = 3;
            } else { // earnings should not be shown
              vm.statsToShow = 2;
            }

          });

          // Get active challenges in ordor to populate user's active challenges and review opportunities
          ChallengeService.getMyActiveChallenges()
            .then(function(data) {
              console.log(data);

              vm.myActiveChallenges = data;

              var ctOpenChallenges = 0;
              var ctReviewChallenges = 0;

              angular.forEach(vm.myActiveChallenges, function(challenge) {
                if(challenge.roles && challenge.roles.indexOf("Submitter") != -1) {
                  ctOpenChallenges++
                }
                
                if(challenge.roles && challenge.roles.indexOf("Reviewer") != -1) {
                  ctReviewChallenges++
                }
              });

              vm.myOpenChallengesCount = ctOpenChallenges;
              vm.reviewOpportunities = ctReviewChallenges;
              console.log(vm);
            });
      });
    }

  }


})();