(function () {

  /**
   * Create controller Challenge Details
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
   * @param ChallengeService
   * @constructor
   */
  function WelcomeBackCtrl($scope, ProfileService, ChallengeService, PHOTO_LINK_LOCATION) {
    $scope.ratingColor = "color: #999999";

    app.getHandle(function() {
      ProfileService.getUserProfile(app.handle)
        .then(function(profile) {
          $scope.profile = profile;

          var highestRating = 0;

          angular.forEach($scope.profile.ratingSummary, function(value, key) {
            if (highestRating < value.rating) {
              highestRating = value.rating;
              $scope.ratingColor = value.colorStyle;
            }
          });

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