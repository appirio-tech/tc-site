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
    .factory('ProfileService', ProfileService);

  ProfileService.$inject = ['Restangular'];

  /**
   * SRMService 
   * @param Restangular to access the REST api
   * @constructor
   */
  function ProfileService(Restangular) {
    var service = Restangular.withConfig(function(RestangularConfigurer) {
    });

    /**
     * getUserProfile returns the public profile of a given user identified by a handle
     * @param handle string handle of the user
     * @returns promise
     */
    service.getUserProfile = function(handle) {
      return service.one("users", handle).get();
    }

    /**
     * getIdentity returns the identity information of the currently logged in user, identified by the jwt session token
     * @returns promise
     */
    service.getIdentity = function() {
      return service.one("user").one("identity").get();
    }

    return service;    
  }
})();