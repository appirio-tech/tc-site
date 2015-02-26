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
    .module('tc.submissionUpload')
    .factory('ViewSubmissionsService', ViewSubmissionsService);

  ViewSubmissionsService.$inject = ['Restangular', 'API_URL', '$q', '$cookies'];

  /**
   * getSubmissions() is used to retrieve my submissions in a specifically challenge.
   */
  function ViewSubmissionsService(Restangular, API_URL, $q, $cookies) {

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

    service.getSubmissions = getSubmissions;

    /*
     * method implementations.
     */

    function getSubmissions(challengeId) {
      var defer = $q.defer();

      if (!$cookies.tcjwt) {
        defer.resolve({
          'error': {
            'details': 'Not logged in(specifically "tcjwt" cookie is absent). Try to login.'
          }
        });
        return defer.promise;
      }

      service
        .one('challenges')
        .one('submissions')
        .one(challengeId)
        .one('mySubmissions')
        .get()
        .then(function(response) {
          console.log('success: my submissions: ');
          console.log(response);
          defer.resolve(response.submissions);
        }, function error(reason) {
          console.log('fail: the reason when retrieving my submissions: ');
          console.log(reason);
          defer.resolve(reason);
        });
      return defer.promise;
    }

    return service;
  }

})();