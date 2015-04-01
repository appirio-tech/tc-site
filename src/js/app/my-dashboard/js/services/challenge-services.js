/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * ChallengeService. Factory to access the topcoder api and retrieve challenge information
 */
(function () {

  angular
    .module('myDashboard.services')
    .factory('ChallengeService', ChallengeService);

  ChallengeService.$inject = ['Restangular', '$q'];

  /**
   * SRMService 
   * @param Restangular to access the REST api
   * @param $q to handle promises
   * @constructor
   */
  function ChallengeService(Restangular, $q) {

    var service = Restangular.withConfig(function(RestangularConfigurer) {
    });

    // Used to store all promises for the getMyActiveChallenges, so that only one call is made
    // to the server and the response returned to all clients
    service.activeChallengeDeferredList = [];

    /**
     * getMyActiveChallenges returns all challenges that the currently logged in user is involved in
     */
    service.getMyActiveChallenges = function() {
      var deferred = $q.defer();

      // If my active challenges has already been retrieved, simply return it
      if(service.myActiveChallenges && service.myActiveChallenges != "waiting") {
        deferred.resolve(service.myActiveChallenges);
      } else {
        // Otherwise, set state to waiting, so that only one call is done to the server
        service.myActiveChallenges = "waiting";

        // Add promise to list to it can be resolved when call returns
        service.activeChallengeDeferredList.push(deferred);

        // Fetch list of active challenges for current user
        service.one("user").getList("challenges", {type: "past"})
          .then(function(data) {
            // Sets the data, and returns it to all pending promises
            service.myActiveChallenges = data;
            angular.forEach(service.activeChallengeDeferredList, function(def) {
              def.resolve(service.myActiveChallenges);
            });
            service.activeChallengeDeferredList = [];
          });
      }

      return deferred.promise;
    }

    return service;  
  }    
})();