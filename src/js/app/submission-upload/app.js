'use strict';

/**
 * This code is copyright (c) 2015 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.1
 *
 * Changed in 1.1 (topcoder new community site - Removal proxied API calls)
 * Removed LC related conditionals and calls
 */

/*jslint nomen: true*/
/*global angular: true, _: true */
(function(angular) {

  'use strict';
  angular.module('tc.submissionUpload', [
    'restangular',
    'ngCookies',
    'challengeDetails.services',
    'tc.shared.services.utils',
    'tc.shared.directives.tcScrollToTop',
    'tc.shared.directives.tcNumberOnly'
  ])

  .constant("API_URL", tcconfig.apiURL)

  .config(DataPreProcessing);

  DataPreProcessing.$inject = ['$httpProvider', 'RestangularProvider', 'API_URL'];

  /**
   *
   * @param $httpProvider
   * @param RestangularProvider
   * @param API_URL
   * @constructor
   */
  function DataPreProcessing($httpProvider, RestangularProvider, API_URL) {
    /*
     * Enable CORS
     * http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
     */
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Base API url
    RestangularProvider.setBaseUrl(API_URL);

    // Format restangular response

    // add a response intereceptor
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      var extractedData = '';

      extractedData = data.data ? data.data : data;
      // .. to look for getList operations
      if (operation === "getList") {
        // .. and handle the data and meta data
        if (!(Object.prototype.toString.call(extractedData) === '[object Array]')) {
          extractedData = [extractedData];
        }

        extractedData.pagination = {
          total: data.total,
          pageIndex: data.pageIndex,
          pageSize: data.pageSize
        };
      }

      return extractedData;
    });
  }

}(angular));