/*global angular: true */
(function (angular) {
    'use strict';
    var challengesService = angular.module('tc.challenges.services');

    challengesService.factory('DataService', ['Restangular', 'API_URL',
        function (Restangular, API_URL) {
          Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
            if(operation === 'getList' && what === 'active'){
              return _.map(data, function(challengeItem){
                var currentDate = new Date();
                var endPhaseDate = new Date(challengeItem.currentPhaseEndDate);
                challengeItem.currentPhaseRemainingTime = Math.max((endPhaseDate.getTime()-currentDate.getTime())/1000, 0);
                return challengeItem;
              });
            } else {
              return data;
            }
          });
          return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(API_URL + '/data');
          });
        }]);
}(angular));