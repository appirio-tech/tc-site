/*global angular: true */
(function (angular) {
    'use strict';
    var challengesService = angular.module('tc.challenges.services');

    challengesService.factory('DataService', ['Restangular', 'API_URL',
        function (Restangular, API_URL) {
          Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
            if (!Array.isArray(data)) return data;
            return _.map(data, function(challengeItem){
              if (challengeItem.currentPhaseEndDate) {
                var currentDate = new Date();
                var endPhaseDate = new Date(challengeItem.currentPhaseEndDate);
                challengeItem.currentPhaseRemainingTime = Math.max((endPhaseDate.getTime()-currentDate.getTime())/1000, 0) || -1;
              }
              else challengeItem.currentPhaseRemainingTime = -1;
              return challengeItem;
            });
          });
          return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(API_URL + '/data');
          });
        }]);
}(angular));
