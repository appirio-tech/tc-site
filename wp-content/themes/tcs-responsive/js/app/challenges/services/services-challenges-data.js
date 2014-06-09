/*global angular: true */
(function (angular) {
    'use strict';
    var challengesService = angular.module('tc.challenges.services');

    challengesService.factory('DataService', ['Restangular', 'API_URL',
        function (Restangular, API_URL) {
            return Restangular.withConfig(function (RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(API_URL + '/data');
            });
        }]);
}(angular));