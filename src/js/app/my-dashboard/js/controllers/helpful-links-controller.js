/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * Controller for the helpful links widget
 */
 (function () {

  /**
   * Create helpful links controller
   */
  angular
    .module('myDashboard')
    .controller('HelpfulLinksCtrl', HelpfulLinksCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  HelpfulLinksCtrl.$inject = ['$scope', '$location', 'MAIN_URL', 'COMMUNITY_URL', 'REVIEW_APP_URL', 'FORUMS_APP_URL', 'HELP_APP_URL'];

  /**
   * Helpful links controller implementation
   *
   * @param $scope
   * @constructor
   */
  function HelpfulLinksCtrl($scope, $location, MAIN_URL, COMMUNITY_URL, REVIEW_APP_URL, FORUMS_APP_URL, HELP_APP_URL) {
    var vm = this;
    vm.communityBaseUrl = $location.protocol() + ":" + COMMUNITY_URL;
    vm.mainUrl = MAIN_URL;
    vm.reviewAppUrl = $location.protocol() + "://" + REVIEW_APP_URL;
    vm.forumsAppUrl = $location.protocol() + "://" + FORUMS_APP_URL;
    vm.helpAppUrl = $location.protocol() + "://" + HELP_APP_URL;
    // widget heading
    this.message = "Helpful Links";
    
    //activate controller
    activate();

    function activate() {
      // nothing to do yet
    }
  }


})();