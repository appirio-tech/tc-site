'use strict';

/*jslint nomen: true*/
/*global angular: true, _: true */
(function() {

  angular
    .module('tc.submissionUpload')
    .factory('lcSubmitService', lcSubmitService);

  lcSubmitService.$inject = ['Restangular', 'API_URL', '$cookies', '$http', '$q'];

  function lcSubmitService(Restangular, API_URL, $cookies, $http, $q) {
    var service = Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(API_URL);
      if ($cookies.tcjwt) {
        RestangularConfigurer.setDefaultHeaders({
          'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")
        });
      }
    });
    /*
     * private field
     */

    service._abortSubmit = undefined;

    service.cancel = cancel;

    service.getUploadUrl = getUploadUrl;

    service.putToS3 = putToS3;

    function cancel() {
      if (service._abortSubmit) {
        service._abortSubmit.resolve();
      }
    }

    function getUploadUrl(challengeId, file) {
      var defer = $q.defer();

      if (!$cookies.tcjwt) {
        defer.resolve({
          'error': {
            'details': 'Internal error. Try to login again.'
          }
        });
        return defer.promise;
      }

      var content = {
        fileName: file.name,
        fileSize: file.size
      };

      //set _abortSubmit to a new defer().
      service._abortSubmit = $q.defer();

      service
        .one('develop')
        .one('challenges')
        .one(challengeId)
        .post('upload', content)
        .then(function(response) {
          console.log('success: the response: ');
          console.log(response);
          defer.resolve(response);
        }, function error(reason) {
          console.log('fail: the reason: ');
          console.log(reason);
          defer.resolve(reason);
        });
      return defer.promise;
    }

    function putToS3(url, file) {
      return $http.put(url, file);
    }

    return service;
  }
})();