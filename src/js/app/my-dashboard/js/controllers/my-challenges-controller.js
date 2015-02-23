(function () {

  /**
   * Create controller Challenge Details
   */
  angular
    .module('myDashboard')
    .controller('MyChallengesCtrl', MyChallengesCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  MyChallengesCtrl.$inject = ['$scope', 'ChallengeService'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function MyChallengesCtrl($scope, ChallengeService) {
    ChallengeService.getMyActiveChallenges()
      .then(function(data) {
        $scope.myChallenges = data;
      });
  }


})();