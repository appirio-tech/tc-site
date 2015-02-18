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
  MyChallengesCtrl.$inject = ['$scope'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function MyChallengesCtrl($scope) {
    $scope.message = "My Challenges";
  }


})();