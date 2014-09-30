(function() {

  angular
    .module('tc.shared.services.utils', [])
    .factory('Utils', Utils);

  Utils.$inject = [];

  function Utils() {

    var service = {};
    service.isBlank = isBlank;

    /**
     * Check if the string is blank (empty or only spaces).
     * @param str the string to check.
     * @return true if the string is blank , false othewise.
     */
    function isBlank(str) {
      return (!str || /^\s*$/.test(str));
    }

    return service;
  }

})();