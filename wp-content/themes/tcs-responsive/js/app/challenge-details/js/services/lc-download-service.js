'use strict';

/*jslint nomen: true*/
/*global angular: true, _: true */
(function() {

  angular
    .module('lc.services.download', [])
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
    service.getSubmissionUrl = getSubmissionUrl;

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
      var req = {
        method: 'GET',
        url: API_URL + '/challenges/' + challengeId + '/files/' + fileId + '/download',
        headers: {
          'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")
        }
      };
      $http(req)
        .success(function(data, status, headers, config) {
          defer.resolve(data);
        }).
        error(function(data, status, headers, config) {
          defer.resolve({});
        });

      return defer.promise;
    }


    function getSubmissionUrl(challengeId, submissionId, fileId) {
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
      var req = {
        method: 'GET',
        url: API_URL + '/challenges/' + challengeId + '/submissions/' + submissionId + '/files/' + fileId + '/download',
        headers: {
          'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")
        }
      };
      $http(req)
        .success(function(data, status, headers, config) {
          defer.resolve(data);
        }).
        error(function(data, status, headers, config) {
          defer.resolve({});
        });

      return defer.promise;
    }


    return service;
  }
})();