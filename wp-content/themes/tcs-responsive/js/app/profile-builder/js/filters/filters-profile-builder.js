/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';

(function() {

  angular
    .module('tc.profileBuilder.filters', [])

    .filter('replaceHandle', replaceHandle)

    .filter('fromNow', fromNow)

    .filter('placeholderInfo', placeholderInfo)

    .filter('trust', trust);

  /**
   * Replaces account url for instructions
   *
   * @param text
   * @returns {String}
   */
  function replaceHandle () {
    return function (text) {
      return String(text).replace('%handle%', '<YOUR_ACCOUNT_HANDLE>').replace('%link%', '<YOUR_ACCOUNT_LINK>');
    }
  }

  /**
   * Calculates how much time ago
   *
   * @param timestamp
   * @returns {String}
   */
  function fromNow () {
    return function (date) {
      return moment(date).fromNow();
    }
  }

  /**
   * Filters placeholder text
   *
   * @param text
   * @returns {String}
   */
  function placeholderInfo () {
    return function (link) {
      return String(link).match('\<(.*?)\>')[0];
    }
  }

  trust.$inject = ['$sce'];
  /**
   * Renders html for trusted sources
   *
   * @param text
   * @returns {String}
   */
  function trust ($sce) {
    return function (x) {
      return $sce.trustAsHtml(x);
    }
  };

})();