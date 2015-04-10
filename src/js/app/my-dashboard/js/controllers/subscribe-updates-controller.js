/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author vikas
 * @version 1.0
 *
 * Controller for subscribe for updates widget
 */
(function () {

  /**
   * Create my dashboard controller
   */
  angular
    .module('myDashboard')
    .controller('SubscribeUpdatesCtrl', SubscribeUpdatesCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  SubscribeUpdatesCtrl.$inject = ['$scope', '$http', '$location', 'AuthService'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @constructor
   */
  function SubscribeUpdatesCtrl($scope, $http, $location, AuthService) {
    var vm = this;
    vm.title = "Subscribe to Updates";
    vm.loggedIn = AuthService.validate();
    vm.email = null;
    // as of now not able to bind the url to view, so it is hard coded in view too
    vm.feedBlitzUrl = 'https://www.feedblitz.com/f/f.fbz?AddNewUserDirect';
    vm.feedBlitzFormName = 'FeedBlitz_0fd529537e2d11e392f6002590771251';
    vm.feedBlitzPublisher = 34610190;
    vm.feedBlitzFeedId = 926643;
    vm.subscribe = subscribe;

    // activate controller
    activate();

    function activate() {
      // nothing to do yet
    }

    function subscribe() {
      var params = {
        EMAIL: vm.email,
        PUBLISHER: vm.feedBlitzPublisher,
        FEEDID: vm.feedBlitzFeedId
      };
      $http.post(vm.feedBlitzUrl, params, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).
        success(function(data, status, headers, config) {
          console.log("subscribed");
        }).
        error(function(data, status, headers, config) {
          console.log("error in subscription");
        });
    }

  }


})();