/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * Controller for the blog post widget
 */
(function () {

  /**
   * Create blog post controller controller
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
   * BlogPost Controller implementation
   *
   * @param $scope
   * @param BlogService service to access and parse blog RSS feed
   * @constructor
   */
  function BlogPostCtrl($scope, BlogService) {
    BlogService.getBlogFeed()
      .then(function(data) {
        $scope.blogPosts = data;
      });
  }

})();