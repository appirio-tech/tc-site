/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @author vikas.agarwal@appirio.com
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
  MemberProgramCtrl.$inject = ['$scope', 'AuthService', 'MemberCertService', 'SWIFT_PROGRAM_ID'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @constructor
   */
  function MemberProgramCtrl($scope, AuthService, MemberCertService, SWIFT_PROGRAM_ID) {
    var vm = this;
    vm.loading = true;
    vm.loadingMessage = "";
    vm.program = null;
    vm.registration = null;
    vm.registerUser = registerUser;

    // parent dashboard controller
    var db = $scope.$parent.vm;

    // activate controller
    if (AuthService.isLoggedIn === true) {
      db.addIdentityChangeListener("memberprogram", function(identity) {
        activate();
      });
      if (db.user) {
        activate();
      }
    } else {
      return false;
    }

    function activate() {
      vm.loading = true;
      vm.loadingMessage = "Checking your program status";
      // gets member's registration status for the event
      return MemberCertService.getMemberRegistration(db.user.uid, SWIFT_PROGRAM_ID).then(function(data) {
        var result = data.result;
        var content = result ? result.content : null;
        if (content) {
          vm.registration = content;
        } else {
          vm.registration = null;
        }
        vm.loading = false;
      });
    }

    function registerUser() {
      vm.loading = true;
      vm.loadingMessage = "Registering for the program";
      return MemberCertService.registerMember(db.user.uid, SWIFT_PROGRAM_ID).then(function(data) {
        var result = data.result;
        var content = result ? result.content : null;
        if (content) {
          vm.registration = content;
        }
        vm.loading = false;
      });
    }
  }


})();