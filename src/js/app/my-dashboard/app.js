/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * App module for my dashboard page
 */
(function () {

  angular
    .module('myDashboard', [
      'ngRoute',
      'restangular',
      'ngCookies',
      'myDashboard.services'
    ])
    .constant("API_URL", tcLCApiURL)

  .config(DataPreProcessing)
  .constant("BLOG_LOCATION", tcconfig.blogRSSFeedURL)
  .constant("MARKETING_MESSAGE_URL", tcconfig.marketingMessageMyDashURL)
  .constant("PHOTO_LINK_LOCATION", tcconfig.photoLinkBaseURL);

  DataPreProcessing.$inject = ['$httpProvider', 'RestangularProvider', 'API_URL'];

  /**
   * Sets restangular with specific configurations to access tc api
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

    // Setup authentication header    
    var $cookies;
    angular.injector(['ngCookies']).invoke(function(_$cookies_) {
      $cookies = _$cookies_;
    });

    if ($cookies.tcjwt) {
      RestangularProvider.setDefaultHeaders({
        'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")
      });
    }

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
