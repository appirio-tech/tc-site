'use strict';

/*jslint nomen: true*/
/*global angular: true, _: true */
(function() {

  angular
    .module('lc.services')
    .factory('DownloadService', DownloadService);

  DownloadService.$inject = ['Restangular', 'API_URL', '$cookies', '$http', '$q'];

  function DownloadService(Restangular, API_URL, $cookies, $http, $q) {
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


    service.getDownloadUrl = getDownloadUrl;

    function getDownloadUrl(challengeId, fileId) {
      var defer = $q.defer();

      if (!$cookies.tcjwt) {
        defer.resolve({
          'error': {
            'details': 'Internal error. Try to login again.'
          }
        });
        return defer.promise;
      }

      // challenges/:challengeId/files/:fileId/download

      service
        .one('challenges', challengeId)
        .one('files', fileId)
        .get('upload')
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

    return service;
  }
})();