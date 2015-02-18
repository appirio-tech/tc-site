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
  WelcomeBackCtrl.$inject = ['$scope', 'ProfileService'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function WelcomeBackCtrl($scope, ProfileService) {
    $scope.ratingColor = "color: #999999";

    app.getHandle(function() {
      ProfileService.getUserProfile(app.handle)
        .then(function(data) {
          $scope.profile = data;

          var highestRating = 0;

          angular.forEach($scope.profile.ratingSummary, function(value, key) {
            if (highestRating < value.rating) {
              highestRating = value.rating;
              $scope.ratingColor = value.colorStyle;
            }
          });
        });
    });


  }


})();