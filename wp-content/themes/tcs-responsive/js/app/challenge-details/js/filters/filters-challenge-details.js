/**
 * Created by gdurban on 8/6/14.
 */

(function() {

  /**
   * Filter Definitions
   */

  /**
   * Days left
   */
  angular
    .module('challengeDetails.filters', [])
    .filter('daysLeft', daysLeft);

  /**
   * Hours left
   */
  angular
    .module('challengeDetails.filters')
    .filter('hoursLeft', hoursLeft);

  /**
   * Minutes left
   */
  angular
    .module('challengeDetails.filters')
    .filter('minsLeft', minsLeft);

  /**
   * Format date
   */
  angular
    .module('challengeDetails.filters')
    .filter('formatDate', formatDate);

  /**
   * Implementation details
   */

  function daysLeft () {
    return function(seconds) {
      return Math.floor(seconds / (3600 * 24));
    }
  }

  function hoursLeft () {
    return function(seconds) {
      return Math.floor(Math.floor(seconds % (3600 * 24)) / 3600);
    }
  }

  function minsLeft () {
    return function(seconds) {
      return Math.floor(Math.floor(seconds % 3600) / 60);
    }
  }

  function formatDate () {
    return function (date, opt) {
      var pad0 = function (x) {
        return (x + '').length == 1 ? '0' + x : x;
      }

      if (!date) {
        return '--';
      }
      if (typeof date == 'string') {
        date = moment(date).toDate();
      }
      var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
      if (opt == 2) {
        month = month.substring(0, 3);
      }

      var day = date.getDate();
      var year = date.getFullYear();
      var time = pad0((date.getUTCHours() + 20) % 24) + ':' + pad0(date.getUTCMinutes());

      return month + ' ' + day + ', ' + year + ' ' + time + ' EDT';
    };
  }

})();