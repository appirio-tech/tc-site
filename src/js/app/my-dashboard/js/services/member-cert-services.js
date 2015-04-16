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
     * getUserProfile returns the public profile of a given user identified by a userId
     * @param userId string userId of the user
     * @returns promise
     */
    service.getMemberRegistration = function(userId) {
      return service.one("member-cert/registrations", userId).get();
    }

    /**
     * getIdentity returns the identity information of the currently logged in user, identified by the jwt session token
     * @returns promise
     */
    service.registerMember = function(userId, programId) {
      return service.one("member-cert/registrations", userId).one("programs", programId).post();
    }

    return service;    
  }
})();