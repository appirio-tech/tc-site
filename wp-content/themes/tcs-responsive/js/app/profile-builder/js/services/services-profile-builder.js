/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */

'use strict';

(function() {

  angular
    .module('tc.profileBuilder')
    .factory('ProfileBuilderService', ProfileBuilderService);

  ProfileBuilderService.$inject = ['Restangular', 'CB_URL', '$q', '$cookies'];

  /**
   * This service interacts with coderbits api
   *
   * @param Restangular
   * @param CB_URL
   * @param $q
   * @param $cookies
   * @returns {*}
   * @constructor
   */
  function ProfileBuilderService(Restangular, CB_URL, $q, $cookies) {

    var service = Restangular.withConfig(function(RestangularConfigurer) {
      if ($cookies.tcjwt) {
        RestangularConfigurer.setDefaultHeaders({
          'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, ""),
          'Content-Type': 'application/json; charset=utf-8'
        });
      }
    });

    service.getAccounts = getAccounts;
    /**
     * Gets all the external accounts supported by coderbits.
     *
     * @param parameters e.g page_size
     * @returns {ng.IPromise<T>}
     */
    function getAccounts(params) {
      var defer = $q.defer();
      var fullParams = angular.extend({}, params);

      service
        .all('accounts')
        .getList(fullParams)
        .then(function(response) {
          defer.resolve(response[0]);
        }, function error(reason) {
          //console.log(reason);
          defer.reject(reason);
        });
      return defer.promise;

    }

    service.checkAccount = checkAccount;
    /**
     * Checks if integration can be made using specified account id and username.
     *
     * @param parameters username and accountId
     * @returns {ng.IPromise<T>}
     */
    function checkAccount(params) {
      var defer = $q.defer();
      var fullParams = angular.extend({}, params);

      service
        .one('externalaccount')
        .get(fullParams)
        .then(function(response) {
          defer.resolve(response);
        }, function error(reason) {
          //console.log('error', reason);
          defer.reject(reason);
        });
      return defer.promise;
    }

    service.getIntegrations = getIntegrations;
    /**
     * Gets all the integrated accounts for the user.
     *
     * @param none
     * @returns {ng.IPromise<T>}
     */
    function getIntegrations() {
      var defer = $q.defer();

      service
        .all('integrations')
        .getList()
        .then(function (response) {
          defer.resolve(response);
        }, function error(reason) {
          //console.log('error', reason);
          defer.reject(reason);
        });
      return defer.promise;
    }

    service.checkIntegration = checkIntegration;
    /**
     * Checks if external account has been integrated or not.
     *
     * @param accoundId
     * @returns {ng.IPromise<T>}
     */
    function checkIntegration(accountId) {
      var defer = $q.defer();

      service
        .one('integrations', accountId)
        .get()
        .then(function (response) {
          defer.resolve(response);
        }, function error(reason) {
          //console.log('error', reason);
          defer.reject(reason);
        });
      return defer.promise;
    }

    service.addIntegration = addIntegration;
    /**
     * Integrates an external account.
     *
     * @param account id
     * @param username
     * @returns {ng.IPromise<T>}
     */
    function addIntegration(accountId, username) {
      var defer = $q.defer();
      username = JSON.stringify(username);

      service
        .one('integrations', accountId)
        .customPUT(username)
        .then(function (response) {
          defer.resolve(response);
        }, function error(reason) {
          //console.log('error', reason);
          defer.reject(reason);
        });

      return defer.promise;
    }

    service.removeIntegration = removeIntegration;
    /**
     * Removes an integrated account..
     *
     * @param account id
     * @returns {ng.IPromise<T>}
     */
    function removeIntegration(accountId) {
      var defer = $q.defer();

      service
        .one('integrations', accountId)
        .remove()
        .then(function (response) {
          defer.resolve(response);
        }, function error(reason) {
          //console.log('error', reason);
          defer.reject(reason);
        });
      return defer.promise;
    }

    service.getSkills = getSkills;
    /**
     * Gets all the aggregated skills for the user.
     *
     * @param none
     * @returns {ng.IPromise<T>}
     */
    function getSkills() {
      var defer = $q.defer();

      service
        .one('skillsknown')
        .get()
        .then(function (response) {
          defer.resolve(response);
        }, function error(reason) {
          //console.log('error', reason);
          defer.reject(reason);
        });
      return defer.promise;
    }

    service.showSkill = showSkill;
    /**
     * Sets hidden status to false for specified skill id.
     *
     * @param skillId
     * @returns {ng.IPromise<T>}
     */
    function showSkill(skillId) {
      var defer = $q.defer();

      service
        .one('skillsknown', skillId)
        .put()
        .then(function (response) {
          defer.resolve(response);
        }, function error(reason) {
          //console.log('error', reason);
          defer.reject(reason);
        });
      return defer.promise;
    }

    service.hideSkill = hideSkill;
    /**
     * Sets hidden status to true for specified skill id.
     *
     * @param skillId
     * @returns {ng.IPromise<T>}
     */
    function hideSkill(skillId) {
      var defer = $q.defer();

      service
        .one('skillsknown', skillId)
        .remove()
        .then(function (response) {
          defer.resolve(response);
        }, function error(reason) {
          //console.log('error', reason);
          defer.reject(reason);
        });
      return defer.promise;
    }

    return service;
  }

})();