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
  WelcomeBackCtrl.$inject = ['$scope', 'ProfileService', 'PHOTO_LINK_LOCATION'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function WelcomeBackCtrl($scope, ProfileService, PHOTO_LINK_LOCATION) {
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

          if (profile && profile.photoLink !== '') {
            if (profile.photoLink.indexOf('//') != -1){
              $scope.photoLink = profile.photoLink;
            } else {
              $scope.photoLink = PHOTO_LINK_LOCATION + profile.photoLink;
            }
          } else {
            $scope.photoLink = PHOTO_LINK_LOCATION + '/i/m/nophoto_login.gif';  
          }

          ProfileService.getMyActiveDevChallenges()
            .then(function(data) {
              console.log("The data:");
              console.log(data);
            });
        });
    });


  }


})();