/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */

'use strict';

(function(angular) {

  angular.module('tc.profileBuilder', [
    'restangular',
    'ngCookies',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'tc.profileBuilder.filters',
    'tc.shared.directives.tcScrollToTop'
  ])

  .constant("API_URL", tcLCApiURL)

  .constant("CB_URL", cbApiURL)

  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',

    function ($stateProvider, $urlRouterProvider, $locationProvider) {

      $locationProvider.html5Mode(true);

      var PROFILE_BUILDER_TEMPLATE_DIR = base_url + '/js/app/profile-builder/partials/';

      $stateProvider

      .state('base', {

        url: '/account/integrations/',

        templateUrl: PROFILE_BUILDER_TEMPLATE_DIR + 'base.tpl.html',

        title: 'External Accounts'

      })

      .state('hide', {

        url: '/account/integrations/hide/',

        templateUrl: PROFILE_BUILDER_TEMPLATE_DIR + 'skillhider.tpl.html',

        title: 'Skills Found'

      })

      $urlRouterProvider.otherwise('/account/integrations');

    }
  ])

  .config(DataPreProcessing);

  DataPreProcessing.$inject = ['$httpProvider', 'RestangularProvider', 'CB_URL'];

  /**
   * Configures Restangular url and headers
   *
   * @param $httpProvider
   * @param RestangularProvider
   * @param CB_URL
   * @constructor
   */
  function DataPreProcessing($httpProvider, RestangularProvider, CB_URL) {

    // Base API url
    RestangularProvider.setBaseUrl(CB_URL + '/api');
    RestangularProvider.setDefaultHttpFields({withCredentials: true});
    // Format restangular response

    // add a response interceptor
    // if response for getList is [object array] then make it array.
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      var extractedData = '';

      extractedData = data.data ? data.data : data;
      // .. to look for getList operations
      if (operation === "getList") {
        // .. and handle the data and meta data
        if (!(Object.prototype.toString.call(extractedData) === '[object Array]')) {
          extractedData = [extractedData];
        }
      }

      return extractedData;
    });
  }

}(angular));