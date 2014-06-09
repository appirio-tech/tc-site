/*global angular: true*/
(function (angular) {
    
  'use strict';
  var challengesModule = angular.module('tc.challenges', ['ngRoute', 'ngCookies']);
  challengesModule.config(['$httpProvider', '$routeProvider', '$locationProvider', function ($httpProvider, $routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider
      .when('/challenges/', {
        controller: 'ChallengeListingCtrl',
        templateUrl: 'challenge-list.html'
      })
      .when('/challenges/:challengeType/', {
        controller: 'ChallengeListingCtrl',
        templateUrl: 'challenge-list.html'
      })
      .when('/challenges/:challengeType/:challengeStatus', {
        controller: 'ChallengeListingCtrl',
        templateUrl: 'challenge-list.html'
      }).otherwise({
        controller: function(){
          $locationProvider.html5Mode(false);
          window.location.reload();
        },
        template : "<div></div>"
      });
  }]);
}(angular));
