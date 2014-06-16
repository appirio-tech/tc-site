/*global angular: true*/
(function (angular) {
    
  'use strict';
  var challengesModule = angular.module('tc.challenges', ['ngRoute', 'ngCookies']);
  challengesModule.config(['$httpProvider', '$routeProvider', '$locationProvider',
  function ($httpProvider, $routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider
      .when('/', {
        controller: 'ChallengeListingCtrl',
        templateUrl: 'challenge-list.html'
      })
      .when('/:challengeArea/', {
        controller: 'ChallengeListingCtrl',
        templateUrl: 'challenge-list.html'
      })
      .when('/:challengeArea/:challengeStatus/', {
        controller: 'ChallengeListingCtrl',
        templateUrl: 'challenge-list.html'
      });
  }]);
}(angular));
