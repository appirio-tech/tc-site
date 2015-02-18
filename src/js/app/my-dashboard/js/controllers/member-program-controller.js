(function () {

  /**
   * Create controller Challenge Details
   */
  angular
    .module('myDashboard')
    .controller('MemberProgramCtrl', MemberProgramCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  MemberProgramCtrl.$inject = ['$scope'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function MemberProgramCtrl($scope) {
    $scope.message = "Member Program";
  }


})();