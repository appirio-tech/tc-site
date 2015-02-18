(function () {

  /**
   * Create controller Challenge Details
   */
  angular
    .module('myDashboard')
    .controller('MarketingMessageCtrl', MarketingMessageCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  MarketingMessageCtrl.$inject = ['$scope'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function MarketingMessageCtrl($scope) {
    $scope.message = "Marketing Message";
  }


})();