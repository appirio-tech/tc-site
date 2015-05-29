/**
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.1
 *
 * App module for my dashboard page
 *
 * Changed in 1.1 (topcoder new community site - Removal proxied API calls)
 * Removed LC related conditionals and calls
 */
(function () {

  angular
    .module('myDashboard', [
      'ngRoute',
      'restangular',
      'angular-storage',
      'ngCookies',
      'myDashboard.services'
    ])
    .constant("API3_URL", tcconfig.API3_URL)
    .constant("API_URL", tcconfig.apiURL)

  .config(DataPreProcessing)
  .constant("MAIN_URL", tcconfig.mainURL)
  .constant("BLOG_LOCATION", tcconfig.blogRSSFeedURL)
  .constant("MARKETING_MESSAGE_URL", tcconfig.marketingMessageMyDashURL)
  .constant("COMMUNITY_URL", tcconfig.communityURL)
  .constant("REVIEW_APP_URL", tcconfig.reviewAppURL)
  .constant("FORUMS_APP_URL", tcconfig.forumsAppURL)
  .constant("HELP_APP_URL", tcconfig.helpAppURL)
  .constant("PHOTO_LINK_LOCATION", tcconfig.photoLinkBaseURL)
  .constant('SWIFT_PROGRAM_ID', tcconfig.swiftProgramId)
  .constant('SWIFT_PROGRAM_URL', tcconfig.swiftProgramURL)
  .factory('Restangular3', Restangular3)
  .run(['$rootScope', '$location', '$window', 'AuthService', run]);

  DataPreProcessing.$inject = ['$httpProvider', 'RestangularProvider', 'API_URL'];

  function run($rootScope, $location, $window, AuthService) {
    $rootScope.$on('$locationChangeStart', function(event, next, current) { 

      if (AuthService.validate()) {
        // nothing to do, valid user
      } else {
        $returnUrl = $location.absUrl();
        event.preventDefault();
        $window.location.href = tcconfig.mainURL + "/login?next=" + $returnUrl;
      }
    });
  }


  // Restangular service that uses v3
  function Restangular3(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(tcconfig.api3URL);
    });
  }

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

    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url) {
      if ($cookies.tcjwt) {
        if (what !== 'users') {
          return {
            headers: {'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")}
          };
        }
      }
    });

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
