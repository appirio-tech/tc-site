(function () {

  /**
   * Create controller Challenge Details
   */
  angular
    .module('myDashboard')
    .controller('MyDashboardCtrl', MyDashboardCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  MyDashboardCtrl.$inject = ['$scope'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function MyDashboardCtrl($scope) {
    $scope.getTemplateURL = function (template) {
      return base_url + '/js/app/my-dashboard/partials/' + template;
    }

  }


})();