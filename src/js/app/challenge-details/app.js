/**
 * This code is copyright (c) 2015 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.1
 *
 * Changed in 1.1 (topcoder new community site - Removal proxied API calls)
 * Removed LC related conditionals and calls
 */
 /* TODO:
 * - Wrap in anon function
 * - Change style to match style guide
 *
 */

(function () {

  angular
    .module('challengeDetails', [
      'restangular',
      'ngCookies',
      'ngRoute',
      'angular-loading-bar',
      'tc.SubmissionDirectives',
      'tc.SubmissionServices',
      'challengeDetails.filters',
      'challengeDetails.services'
    ])

    .constant("API_URL", tcconfig.apiURL)

    .constant("TEMPLATE_URL", "/js/app/challenge-details/partials/")

    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
      cfpLoadingBarProvider.includeSpinner = false;
    }])
    .config(['$locationProvider', '$sceDelegateProvider',
      function ($locationProvider, $sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
          // Allow same origin resource loads.
          'self',
          // Allow loading from subdomains.  Notice the difference between * and **.
          'http://*.topcoder.com/**',
          'https://*.topcoder.com/**'
        ]);        
        $locationProvider.html5Mode(true);
    }])
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

})();
