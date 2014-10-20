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
   * Trust method
   */
  angular
    .module('challengeDetails.filters')
    .filter('trust', trust);

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
      if (!date) {
        return '--';
      }
      //some function is passing in undefined timezone_string variable causing js errors, so check if undefined and set default:
      if (typeof timezone_string === 'undefined') {
        var timezone_string = "America/New_York"; // let's set to TC timezone
      }
      var formatString;
      if (opt == 2) {
        formatString = 'MMM D, YYYY HH:mm z';
      } else {
        formatString = 'MMMM D, YYYY HH:mm z';
      }
      return moment(date).tz(timezone_string).format(formatString);
    };
  }

  trust.$inject = ['$sce'];

  function trust ($sce) {
    return function (x) {
      return $sce.trustAsHtml(x);
    }
  };

})();