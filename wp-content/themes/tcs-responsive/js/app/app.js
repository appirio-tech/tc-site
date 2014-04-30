'use strict';

var tcapp = angular.module('tc', ['restangular', 'ngGrid']);

tcapp.config(['$httpProvider', 'RestangularProvider', function($httpProvider, RestangularProvider) {
  /*
   * Enable CORS
   * http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
   */
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  // Base API url
  RestangularProvider.setBaseUrl('https://api.topcoder.com/v2');
}]);


tcapp.factory('Challenges', function(Restangular) {
  return Restangular.service('challenges');
});

tcapp.factory('Members', function(Restangular) {
  return Restangular.service('users');
});

function ChallengesCtrl($scope, challenges) {

}
tcapp.controller('ChallengesCtrl', ['$scope', 'Challenges', function($scope, challenges) {
  $scope.challenges = [];
  challenges.getList().then(function(challenges) {
    $scope.challenges = challenges;
  });
}]);