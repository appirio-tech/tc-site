/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * Controller for the my challenges widget
 */
(function () {

  /**
   * Create my challenges controller
   */
  angular
    .module('myDashboard')
    .controller('MyChallengesCtrl', MyChallengesCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  MyChallengesCtrl.$inject = ['$scope', 'ChallengeService'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService services to access the challenges api
   * @constructor
   */
  function MyChallengesCtrl($scope, ChallengeService) {
    var vm = this;

    // activate controller
    activate();

    function activate() {
      // Fetch my active
      return ChallengeService.getMyActiveChallenges()
        .then(function(data) {
          vm.myChallenges = data;
      });
    }
  }


})();