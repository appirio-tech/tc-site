/**
 * Created by gdurban on 8/6/14.
 */

(function() {

  angular
    .module('challengeDetails.filters', [])
    .filter('daysLeft', daysLeft);

  function daysLeft () {
    return function(seconds) {
      return Math.floor(seconds / (3600 * 24));
    }
  }

})();