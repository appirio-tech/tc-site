(function () {

  /**
   * Create controller Challenge Details
   */
  angular
    .module('myDashboard')
    .controller('SRMGadgetCtrl', SRMGadgetCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  SRMGadgetCtrl.$inject = ['$scope'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function SRMGadgetCtrl($scope) {
    $scope.message = "SRM Schedule";
  }


})();