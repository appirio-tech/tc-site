/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * Controller for my dashboard page
 */
(function () {

  /**
   * Create my dashboard controller
   */
  angular
    .module('myDashboard')
    .controller('MyDashboardCtrl', MyDashboardCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  MyDashboardCtrl.$inject = ['$scope', '$location', 'store', 'AuthService', 'ProfileService'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @constructor
   */
  function MyDashboardCtrl($scope, $location, store, AuthService, ProfileService) {
    var vm = this;
    vm.title = "My Dashboard";
    vm.user = null;
    vm.loggedIn = AuthService.validate();
    vm.getTemplateURL = getTemplateURL;

    // activate controller
    if (AuthService.isLoggedIn === true) {
      activate();
    } else { // if user is not logged in, return (to avoid extra ajax calls)
      return false;
    }

    function activate() {
      app.addIdentityChangeListener("my-dashboard", function(identity) {
        vm.user = identity;
      });
    }

    /**
     * Gets the url for template files
     * 
     * @param template name of the template html file to retrieve, must be inside the partials folder 
     *        of the app
     */
    function getTemplateURL(template) {
      return base_url + '/js/app/my-dashboard/partials/' + template;
    }

  }


})();