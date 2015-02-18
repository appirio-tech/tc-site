(function () {

  /**
   * Create controller Challenge Details
   */
  angular
    .module('myDashboard')
    .controller('HelpfulLinksCtrl', HelpfulLinksCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  HelpfulLinksCtrl.$inject = ['$scope'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function HelpfulLinksCtrl($scope) {
    $scope.message = "Helpful Links";
  }


})();