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
  'tc.usersService',
  'tc.coderbitsService',
  'ngGrid',
  'ui.router',
  'angular-loading-bar',
  'tc.usersDirectives',
  'tc.developUsersDirectives',
  'tc.badgeUsersDirectives',
  'tc.coderbitsDirectives'
])

  .constant("API_URL", tcApiRUL)
  .constant("PHOTO_LINK_LOCATION", "http://community.topcoder.com")
  .constant("USERS_TEMPLATE_URL", "/js/app/users/partials/users.tpl.html")
  .constant("CODERBITS_API_HOST", "ec2-54-164-107-36.compute-1.amazonaws.com")
  .constant("CODERBITS_TEMPLATE_URL", "/js/app/users/partials")

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

    var USERS_TEMPLATE_DIR = THEME_URL + '/js/app/users/partials/';

    $stateProvider

    .state('base', {

      templateUrl: USERS_TEMPLATE_DIR + 'base.tpl.html',

      controller : 'BaseCtrl as baseCtrl'

    })

    .state('base.common', {

      views: {

        'badge': {
          templateUrl: USERS_TEMPLATE_DIR + 'badge.tpl.html',

          controller: 'BadgeCtrl as badgeCtrl'
        }
      }
    })

    .state('base.common.develop', {
      views: {
        'details@base' : {
          templateUrl: USERS_TEMPLATE_DIR + 'developData.tpl.html',

          controller: 'DevelopCtrl as dataCtrl'
        }
      }
    })

    .state('base.common.develop.special', {
      views: {

        'summary': {
          templateUrl: USERS_TEMPLATE_DIR + 'developSummary.tpl.html'
        },

        'details': {
          templateUrl: USERS_TEMPLATE_DIR + 'developDetails.tpl.html'
        }

      }
    })

    .state('base.common.dataScience',  {
      views: {
        'details@base' : {

          templateUrl: USERS_TEMPLATE_DIR + 'dataScienceData.tpl.html',

          controller: 'DataScienceCtrl as dataCtrl'
        }
      }
    })

    .state('base.common.dataScience.special', {

      views: {

        'summary': {
          templateUrl: USERS_TEMPLATE_DIR + 'dataScienceSummary.tpl.html'
        },

        'details': {
          templateUrl: USERS_TEMPLATE_DIR + 'dataScienceDetails.tpl.html'
        }

      }
    })

    .state('base.common.design', {
      views: {
        'details@base' : {
          templateUrl: USERS_TEMPLATE_DIR + 'designData.tpl.html',

          controller : 'DesignCtrl as designCtrl'
        }
      }
    })

    .state('base.common.overview', {
      views: {
        'details@base' : {
          templateUrl: USERS_TEMPLATE_DIR + 'overview.tpl.html',

          controller : 'OverviewCtrl as overviewCtrl'
        }
      }
    })
    ;

  }
]).filter('with', function() {
  return function(items, field) {
    var fields = field.split(',')
        var result = {};
        for(var i in fields) {
          var sourceK = fields[i];
          var destK = sourceK;
          if(typeof sourceK === 'string') {
            sourceK = sourceK.split('|')[0];
            destK = destK.split('|')[1] || sourceK;
            destK.replace(/_/g, ' ');

          }
          if(items.hasOwnProperty(sourceK) && items[sourceK] !== ''){
            result[destK] = items[sourceK];
          } else if(items[sourceK] === '' || items[sourceK] === null) {
            result[destK]= 'Unknown';
          }
        }
        return result;
    };
}).filter('numberWithCommas', function() {
  return function(x, all) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}).filter('capitalize', function() {
    return function(input, all) {
      if(input === input.toUpperCase()) return input;
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  }).filter('timeSince', function(){
    return function(input, oldest) {
      var delta =   (new Date()).getTime() - (new Date(input || 0)).getTime();
      var minute = 60 * 1000;
      var hour = 60 * minute;
      var day = 24 * hour;
      var week = day * 7;
      var month = week * 4.25;
      var year = month * 12;

      var years = Math.floor(delta / year);
      delta -= years*year;

      var months = Math.floor(delta / month);
      delta -= months*month;

      var weeks = Math.floor(delta / week);
      delta -= weeks*week;

      var days = Math.floor(delta / day);
      delta -= days*day;

      var hours = Math.floor(delta / hour);
      delta -= hours*hour;

      var minutes = Math.floor(delta / minute);

      if (years > 10){
        return oldest || 'a while ago';
      } else if ((years === 1 && months >= 9) || years > 1) {
        if(months >= 9){
          return 'about ' + (years+1) + ' years ago';
        } else if (months > 0){
          return 'about ' + years + ' years ago';
        } else {
          return years + ' years ago';
        }
      } else if (months >= 9 || (years === 1 && months < 9)){
        return 'about a year ago';
      } else if (years === 1 && months > 3){
        return 'about a year and ' + months + '  months ago';
      } else if (years < 1 && months >= 1) {
        return  'about ' + months + ' months ago';
      } else if (years < 1 && months < 1 && weeks >= 1) {
        return 'about ' + weeks + '  weeks ago';
      } else if (years < 1 && months < 1 && weeks < 1 && days >= 1) {
        return 'about ' + days + '  days ago';
      } else if (years < 1 && months < 1 && weeks < 1 && days < 1 && hours >= 1) {
        return 'about ' + hours + '  hours ago';
      } else {
        return 'just now';
      }
    }
  });