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
  BlogPostCtrl.$inject = ['$scope', 'AuthService', 'BlogService'];

  /**
   * BlogPost Controller implementation
   *
   * @param $scope
   * @param BlogService service to access and parse blog RSS feed
   * @constructor
   */
  function BlogPostCtrl($scope, AuthService, BlogService) {
    var vm = this;

    // activate controller
    if (AuthService.isLoggedIn === true) {
      activate();
    } else {
      return false;
    }

    function activate() {
      return BlogService.getBlogFeed()
        .then(function(data) {
          vm.blogPosts = data;
      });
    }
  }

})();