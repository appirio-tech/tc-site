/*global angular: true*/
(function (angular) {
    
  'use strict';
  var challengesModule = angular.module('tc.challenges', ['ngRoute', 'ngCookies']);
  challengesModule.config(['$httpProvider', '$routeProvider', '$locationProvider', '$sceDelegateProvider',
  function ($httpProvider, $routeProvider, $locationProvider, $sceDelegateProvider) {  
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from subdomains.  Notice the difference between * and **.
      'http://*.topcoder.com/**',
      'https://*.topcoder.com/**',
      'http://*.topcoder-qa.com/**',
      'https://*.topcoder-qa.com/**',
      'http://*.topcoder-dev.com/**',
      'https://*.topcoder-dev.com/**'
    ]);

    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider
      .when('/', {
        controller: 'ChallengeListingCtrl',
        templateUrl: 'challenge-list.html',
        reloadOnSearch: false
      })
      .when('/:challengeArea/', {
        controller: 'ChallengeListingCtrl',
        templateUrl: 'challenge-list.html',
        reloadOnSearch: false
      })
      .when('/:challengeArea/:challengeStatus/', {
        controller: 'ChallengeListingCtrl',
        templateUrl: 'challenge-list.html',
        reloadOnSearch: false
      });
  }]);
}(angular));
