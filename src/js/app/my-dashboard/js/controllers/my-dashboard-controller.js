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
  MyDashboardCtrl.$inject = ['$scope'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @constructor
   */
  function MyDashboardCtrl($scope) {
    var vm = this;
    vm.title = "My Dashboard";
    vm.getTemplateURL = getTemplateURL;

    // activate controller
    activate();

    function activate() {
      // nothing to do yet
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