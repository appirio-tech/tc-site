(function () {

  angular
    .module('myDashboard.services', [])
    .factory('ProfileService', ProfileService);

  ProfileService.$inject = ['Restangular', 'API_URL', '$q', '$cookies']

  function ProfileService(Restangular, API_URL, $q, $cookies) {
    var service = Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(API_URL);
      if ($cookies.tcjwt) {
        RestangularConfigurer.setDefaultHeaders({
          'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")
        });
      }
    });

    service.getUserProfile = function(handle) {
      return service.one("users", handle).get();
    }

    service.getIdentity = function() {
      return service.one("user").one("identity").get();
    }

    service.getMyActiveDevChallenges = function() {
      return service.one("user").getList("challenges", {type: "active"}, {'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")}).get();
    }

    return service;    
  }

})();