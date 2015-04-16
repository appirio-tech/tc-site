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
    vm.addIdentityChangeListener = addIdentityChangeListener;
    vm.removeIdentityChangeListener = removeIdentityChangeListener;

    // activate controller
    activate();

    function activate() {
      // try to get user's identity from browser (local storage or cookie)
      vm.user = ProfileService.getLocalIdentity();
      if (!vm.user) { // if identity not found in browser, fetch it from api
        if (AuthService.isLoggedIn) {
          ProfileService.getIdentity().then(function(data) {
            vm.user = data;
            vm.loading = false;
            // call all identity change listeners
            for (var name in idenityListeners) {
              var listener = idenityListeners[name];
              if (typeof listener == 'function') {
                listener.call(data);
              }
            };
          });
        }
      }
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

    // stores all listeners for identity change
    var idenityListeners = {};

    /**
     * Adds the provided listener for identity change event. If listener already exists, it does not update it.
     * Caller has to remove it first and then add new one in such cases.
     *
     * @param name String name of the listener, it is used to uniquely identify a listener
     * @param listener function callback to be called when identity change happens
     */
    function addIdentityChangeListener(name, listener) {
      if (!idenityListeners[name]) {
        idenityListeners[name] = listener;
      }
    }

    /**
     * Removes the listener, identified by given name, for identity change event.
     *
     * @param name String name of the listener, it is used to uniquely identify a listener
     */
    function removeIdentityChangeListener(name) {
      if (idenityListeners[name]) {
        delete idenityListeners[name];
      }
    }

  }


})();