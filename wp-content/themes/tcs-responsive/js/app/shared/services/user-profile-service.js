'use strict';

/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */

/*jslint nomen: true*/
/*global angular: true, _: true */
(function() {

  angular
    .module('tc.shared.services.userProfile', [])
    .factory('UserProfileService', UserProfileService);

  UserProfileService.$inject = ['Restangular', 'API_URL', '$q', '$cookies'];

  /**
   * This service retrieve the user profile based on cookie tcjwt.
   *
   * getUserProfile() is the exposed service method.
   */
  function UserProfileService(Restangular, API_URL, $q, $cookies) {

    var service = Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(API_URL);
      if ($cookies.tcjwt) {
        RestangularConfigurer.setDefaultHeaders({
          'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")
        });
      }
    });
    /*
     * public methods.
     */

    service.getUserProfile = getUserProfile;

    /*
     * method implementations.
     */

    function getUserProfile() {
      var defer = $q.defer();

      service
        .one('user').one('profile').get()
        .then(function(response) {
          console.log('success: the user profile: ');
          console.log(response);
          defer.resolve(response);
        }, function error(reason) {
          console.log('fail: the failure reason when retrieving user profile: ');
          console.log(reason);
          defer.resolve(reason);
        });
      return defer.promise;
    }

    return service;
  }

})();