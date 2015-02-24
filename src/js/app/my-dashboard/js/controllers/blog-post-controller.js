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
  BlogPostCtrl.$inject = ['$scope', 'BlogService'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService
   * @constructor
   */
  function BlogPostCtrl($scope, BlogService) {
    BlogService.getBlogFeed()
      .then(function(data) {
        $scope.blogPosts = data;
      });
  }


})();