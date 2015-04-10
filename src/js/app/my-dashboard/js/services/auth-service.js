/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author vikas
 * @version 1.0
 *
 * AuthService. Factory to access the topcoder api and retrieve challenge information
 */
(function () {

  angular
    .module('myDashboard.services')
    .factory('AuthService', AuthService);

  AuthService.$inject = ['Restangular', '$q'];

  /**
   * AuthService 
   * @param Restangular to access the REST api
   * @param $q to handle promises
   * @constructor
   */
  function AuthService(Restangular, $q) {

    var service = Restangular.withConfig(function(RestangularConfigurer) {
    });

    // Used to store the logged in status of the user
    service.isLoggedIn = false;

    /**
     * validates the state of the login
     */
    service.validate = function(request) {
      var $cookies;
      angular.injector(['ngCookies']).invoke(function(_$cookies_) {
        $cookies = _$cookies_;
      });

      if ($cookies.tcjwt) {
        service.isLoggedIn = true;
      } else {
        service.isLoggedIn = false;
      }
      return service.isLoggedIn;
    }

    return service;  
  }    
})();