/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author TCSASSEMBLER, ecnu_haozi
 * @version 1.1
 *
 * Changed in 1.1
 * <ul>
 * <li>Add ngAnimate module and two shared directives(clickAnywhereButHere, upwardsDownwardsAdaptive) for "My filters"
 * feature.</li>
 * <li>Add the configuration of "My filters" feature's API server URL. It's set in global variable "myFiltersURL".</li>
 * </ul>
 */
'use strict';

window.tc = angular.module('tc', [
  'restangular',
  'tc.challenges',
  'tc.challenges.services',
  'tc.challenges.directives',
  'tc.AdvancedSearch',
  'angular-loading-bar',
  'ngGrid',
  'ui.select2',
  'ngCookies',
  'ui.calendar',
  'tc.shared.directives.clickAnywhereButHere',
  'tc.shared.directives.upwardsDownwardsAdaptive',
  'ngAnimate'
])

  .constant("API_URL", tcApiRUL)
  .constant('MY_FILTER_API_URL', myFiltersURL)
  .constant("LC_URL", lcExternalUrl)

  .config(['$httpProvider', 'RestangularProvider', 'API_URL', function($httpProvider, RestangularProvider, API_URL) {
    /*
     * Enable CORS
     * http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
     */
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Base API url
    RestangularProvider.setBaseUrl(API_URL);
    RestangularProvider.setDefaultHttpFields({cache: true});

    // add a response intereceptor
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      var extractedData;
      // .. to look for getList operations
      if (operation === "getList" && data.data) {
        // .. and handle the data and meta data
        extractedData = data.data;
        extractedData.pagination = {
          total: data.total,
          pageIndex: data.pageIndex,
          pageSize: data.pageSize
        };
      } else if (data.data) {
        extractedData = data.data;
      }
      else {
        extractedData = data;
      }
      //loadingBar.complete();
      return extractedData;
    });
  }])
  // Check if the user is authenticated by checking its tcjwt cookie
  .run(['Restangular', '$cookies', '$rootScope', function(Restangular, $cookies, $rootScope) {
    if($cookies.tcjwt) {
      Restangular.setDefaultHeaders({Authorization: "Bearer " + $cookies.tcjwt});
      $rootScope.authenticated = true;
    }
  }]);
