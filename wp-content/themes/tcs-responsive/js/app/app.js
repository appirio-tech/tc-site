'use strict';

var tcapp = angular.module('tc', ['restangular', 'ngGrid']);

tcapp.config(['$httpProvider', 'RestangularProvider', function($httpProvider, RestangularProvider) {
  /*
   * Enable CORS
   * http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
   */
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  // Base API url
  RestangularProvider.setBaseUrl('https://api.topcoder.com/v2');

  // Format restangular response

  // add a response intereceptor
  RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
    var extractedData;
    // .. to look for getList operations
    if (operation === "getList") {
      // .. and handle the data and meta data
      extractedData = data.data;
      extractedData.pagination = {
        total: data.total,
        pageIndex: data.pageIndex,
        pageSize: data.pageSize
      };
    } else {
      extractedData = data.data;
    }
    return extractedData;
  });
}]);
