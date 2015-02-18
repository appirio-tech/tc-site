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
  WelcomeBackCtrl.$inject = ['$scope'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function WelcomeBackCtrl($scope) {
    $scope.message = "Welcome Back";

  }


})();