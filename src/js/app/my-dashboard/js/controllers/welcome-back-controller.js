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
  WelcomeBackCtrl.$inject = ['$scope', 'ProfileService', 'ChallengeService', 'PHOTO_LINK_LOCATION'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ProfileService services to access profile information via API
   * @param ChallengeService services to access challenge info via API
   * @param PHOTO_LINK_LOCATION base link for user photo
   * @constructor
   */
  function WelcomeBackCtrl($scope, ProfileService, ChallengeService, PHOTO_LINK_LOCATION) {
    // default rating collor
    $scope.ratingColor = "color: #999999";

    // fetch user info to get handle
    app.getHandle(function() {
      ProfileService.getUserProfile(app.handle)
        .then(function(profile) {
          $scope.profile = profile;

          var highestRating = 0;

          // Find user's highest rating to set color to the handle
          angular.forEach($scope.profile.ratingSummary, function(value, key) {
            if (highestRating < value.rating) {
              highestRating = value.rating;
              $scope.ratingColor = value.colorStyle;
            }
          });

          // Parse user picture link to build photo url
          if (profile && profile.photoLink) {
            if (profile.photoLink.indexOf('//') != -1){
              $scope.photoLink = profile.photoLink;
            } else {
              $scope.photoLink = PHOTO_LINK_LOCATION + profile.photoLink;
            }
          } else {
            $scope.photoLink = PHOTO_LINK_LOCATION + '/i/m/nophoto_login.gif';  
          }

        });

        // Get active challenges in ordor to populate user's active challenges and review opportunities
        ChallengeService.getMyActiveChallenges()
          .then(function(data) {
            console.log(data);

            $scope.myActiveChallenges = data;

            var ctOpenChallenges = 0;
            var ctReviewChallenges = 0;

            angular.forEach($scope.myActiveChallenges, function(challenge) {
              if(challenge.roles && challenge.roles.indexOf("Submitter") != -1) {
                ctOpenChallenges++
              }
              
              if(challenge.roles && challenge.roles.indexOf("Reviewer") != -1) {
                ctReviewChallenges++
              }
            });

            $scope.myOpenChallengesCount = ctOpenChallenges;
            $scope.reviewOpportunities = ctReviewChallenges;
          });
    });


  }


})();