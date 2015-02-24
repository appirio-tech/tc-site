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
  SRMGadgetCtrl.$inject = ['$scope', 'SRMService'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function SRMGadgetCtrl($scope, SRMService) {
    SRMService.getSRMSchedule()
      .then(function(data) {
        $scope.upcomingSRMs = data;
      });
  }


})();