/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCS-ASSEMBLER
 * version 1.0
 */
'use strict';

window.tc = angular.module('tc', [
  'restangular',
  'tc.colorService',
  'tc.chartService',
  'tc.memberProfileService',
  'ngGrid',
  'ui.router',
  'angular-loading-bar',
  'tc.memberProfileDirectives',
  'tc.developMemberProfileDirectives',
  'tc.badgeMemberProfileDirectives'
])

.config(['cfpLoadingBarProvider',
  function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }
])

  .constant("API_URL", tcApiRUL)
  .constant("PHOTO_LINK_LOCATION", tcconfig.communityURL)
  .constant("MEMBER_PROFILE_TEMPLATE_URL", "/js/app/member-profile/partials/memberProfile.tpl.html")

.config(['$httpProvider', 'RestangularProvider', 'API_URL',
  function ($httpProvider, RestangularProvider, API_URL) {
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
    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
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
        extractedData = data;
      }
      return extractedData;
    });
  }
])


.run(
  ['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {

      // It's very handy to add references to $state and $stateParams to the $rootScope
      // so that you can access them from any scope within your applications.For example,
      // <li ui-sref-active="active }"> will set the <li> // to active whenever
      // 'contacts.list' or one of its decendents is active.
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]
)


.config(['$stateProvider', '$locationProvider',

  function ($stateProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    var MEMBER_PROFILE_TEMPLATE_DIR = THEME_URL + '/js/app/member-profile/partials/';

    $stateProvider

    .state('base', {

      templateUrl: MEMBER_PROFILE_TEMPLATE_DIR + 'base.tpl.html',

      controller : 'BaseCtrl as baseCtrl'

    })

    .state('base.common', {

      views: {

        'badge': {
          templateUrl: MEMBER_PROFILE_TEMPLATE_DIR + 'badge.tpl.html',

          controller: 'BadgeCtrl as badgeCtrl'
        }
      }
    })

    .state('base.common.develop', {
      views: {
        'details@base' : {
          templateUrl: MEMBER_PROFILE_TEMPLATE_DIR + 'developData.tpl.html',

          controller: 'DevelopCtrl as dataCtrl'
        }
      }
    })

    .state('base.common.develop.special', {
      views: {

        'summary': {
          templateUrl: MEMBER_PROFILE_TEMPLATE_DIR + 'developSummary.tpl.html'
        },

        'details': {
          templateUrl: MEMBER_PROFILE_TEMPLATE_DIR + 'developDetails.tpl.html'
        }

      }
    })

    .state('base.common.dataScience',  {
      views: {
        'details@base' : {

          templateUrl: MEMBER_PROFILE_TEMPLATE_DIR + 'dataScienceData.tpl.html',

          controller: 'DataScienceCtrl as dataCtrl'
        }
      }
    })

    .state('base.common.dataScience.special', {

      views: {

        'summary': {
          templateUrl: MEMBER_PROFILE_TEMPLATE_DIR + 'dataScienceSummary.tpl.html'
        },

        'details': {
          templateUrl: MEMBER_PROFILE_TEMPLATE_DIR + 'dataScienceDetails.tpl.html'
        }

      }
    })

    .state('base.common.design', {
      views: {
        'details@base' : {
          templateUrl: MEMBER_PROFILE_TEMPLATE_DIR + 'designData.tpl.html',

          controller : 'DesignCtrl as designCtrl'
        }
      }
    })
    ;

  }
]);