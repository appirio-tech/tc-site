/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * ProfileService. Factory to access topcoder api for profile information
 */
(function () {

  angular
    .module('myDashboard.services')
    .factory('MemberCertService', ProfileService);

  ProfileService.$inject = ['Restangular3'];

  /**
   * SRMService 
   * @param Restangular to access the REST api
   * @constructor
   */
  function ProfileService(Restangular) {
    var service = Restangular.withConfig(function(RestangularConfigurer) {
    });

    /**
     * getMemberRegistration Retrieves the registration status of the member for the given program
     * @param userId string id of the user
     * @param programId string id of the program of the registration
     * @returns promise
     */
    service.getMemberRegistration = function(userId, programId) {
      return service.one("member-cert/registrations", userId).one("programs", programId).get();
    }

    /**
     * registerMember Registers the given member for the given program.
     * @param userId string id of the member to be registered
     * @param programId string id of the program to be registered against
     * @returns promise
     */
    service.registerMember = function(userId, programId) {
      return service.one("member-cert/registrations", userId).one("programs", programId).post();
    }

    return service;    
  }
})();