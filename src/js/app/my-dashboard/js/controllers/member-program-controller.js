/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * Controller for the member program widget
 */
(function () {

  /**
   * Create member program widget
   */
  angular
    .module('myDashboard')
    .controller('MemberProgramCtrl', MemberProgramCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  MemberProgramCtrl.$inject = ['$scope', 'AuthService', 'MemberCertService'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @constructor
   */
  function MemberProgramCtrl($scope, AuthService, MemberCertService) {
    var vm = this;
    vm.loading = true;
    vm.loadingMessage = "";
    vm.program = null;
    vm.registration = null;
    vm.registerUser = registerUser;

    // activate controller
    if (AuthService.isLoggedIn === true) {
      activate();
    } else {
      return false;
    }

    function activate() {
      vm.loading = true;
      vm.loadingMessage = "Checking your program status";
      // gets member's registration status for the event
      return MemberCertService.getMemberRegistration(22688955).then(function(data) {
        var result = data.result;
        var content = result ? result.content : null;
        //console.log(content);
        if (content && content.length > 0) {
          vm.registration = content[0];
          vm.loading = false;
          //console.log(vm.registration);
        }
      });
    }

    function registerUser() {
      vm.loading = true;
      vm.loadingMessage = "Registering for the program";
      return MemberCertService.registerMember(22688955, 3445).then(function(data) {
        var result = data.result;
        var content = result ? result.content : null;
        //console.log(content);
        if (content && content.length > 0) {
          vm.registration = content[0];
          vm.loading = false;
          //console.log(vm.registration);
        }
      });
    }
  }


})();