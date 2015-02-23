(function () {

  angular
    .module('myDashboard.services', [])
    .factory('ProfileService', ProfileService)
    .factory('ChallengeService', ChallengeService);


  ProfileService.$inject = ['Restangular', 'API_URL', '$q', '$cookies'];

  function ProfileService(Restangular, API_URL, $q, $cookies) {
    var service = Restangular.withConfig(function(RestangularConfigurer) {
    });

    service.getUserProfile = function(handle) {
      return service.one("users", handle).get();
    }

    service.getIdentity = function() {
      return service.one("user").one("identity").get();
    }

    return service;    
  }

  ChallengeService.$inject = ['Restangular', 'API_URL', '$q', '$cookies'];

  function ChallengeService(Restangular, API_URL, $q, $cookies) {

    var service = Restangular.withConfig(function(RestangularConfigurer) {
    });

    service.activeChallengeDeferredList = [];

    service.getMyActiveChallenges = function() {
      var deferred = $q.defer();

      if(service.myActiveChallenges && service.myActiveChallenges != "waiting") {
        deferred.resolve(service.myActiveChallenges);
      } else {
        service.myActiveChallenges = "waiting";
        service.activeChallengeDeferredList.push(deferred);
        service.one("user").getList("challenges", {type: "active"})
          .then(function(data) {
            service.myActiveChallenges = data;
            angular.forEach(service.activeChallengeDeferredList, function(def) {
              def.resolve(service.myActiveChallenges);
            });
            service.activeChallengeDeferredList = [];
          });
      }

      return deferred.promise;
    }

    service.getReviewOpportunities = function() {
      return service.one("data").getList("reviewOpportunities");
    }

    return service;  
  }

})();