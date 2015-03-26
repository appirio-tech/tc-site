/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * Controller for the upcoming srms widget
 */
(function () {

  /**
   * Create upcoming srm widget controller
   */
  angular
    .module('myDashboard')
    .controller('UpcomingSRMsCtrl', UpcomingSRMsCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  UpcomingSRMsCtrl.$inject = ['$scope', 'SRMService'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param SRMServices services to access topcoder API for SRM data
   * @constructor
   */
  function UpcomingSRMsCtrl($scope, SRMService) {
    var vm = this;

    // activate controller
    activate();

    function activate() {
      // Fetch the future srms scheduled
      return SRMService.getSRMSchedule()
        .then(function(data) {
          vm.upcomingSRMs = data;
      });
    }
  }


})();