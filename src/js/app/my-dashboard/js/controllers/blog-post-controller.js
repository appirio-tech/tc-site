(function () {

  /**
   * Create controller Challenge Details
   */
  angular
    .module('myDashboard')
    .controller('BlogPostCtrl', BlogPostCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  BlogPostCtrl.$inject = ['$scope'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function BlogPostCtrl($scope) {
    $scope.message = "Blog Post";
  }


})();