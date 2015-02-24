(function () {

  angular
    .module('myDashboard.services', [])
    .factory('ProfileService', ProfileService)
    .factory('ChallengeService', ChallengeService)
    .factory('BlogService', BlogService)
    .factory('SRMService', SRMService);


  ProfileService.$inject = ['Restangular', 'API_URL', '$q'];

  function ProfileService(Restangular, API_URL, $q) {
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

  ChallengeService.$inject = ['Restangular', 'API_URL', '$q'];

  function ChallengeService(Restangular, API_URL, $q) {

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

  SRMService.$inject = ['Restangular', 'API_URL', '$q', '$filter'];

  function SRMService(Restangular, API_URL, $q, $filter) {

    var service = Restangular.withConfig(function(RestangularConfigurer) {
    });

    service.getSRMSchedule = function() {
      return service.one("data").one("srm").getList("schedule", {sortColumn: "registrationstarttime", sortOrder: "asc", registrationStartTimeAfter: $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss.sssZ'), statuses: "A,P,F"});
    }

    return service;  
  }

  BlogService.$inject = ['Restangular', 'API_URL', '$q', '$http', 'BLOG_LOCATION', '$sce'];

  function BlogService(Restangular, API_URL, $q, $http, BLOG_LOCATION, $sce) {

    var service = Restangular.withConfig(function(RestangularConfigurer) {
    });

    service.getBlogFeed = function() {
      var deferred = $q.defer();

      $http.get(BLOG_LOCATION)
        .success(function(data) {
          var rss = $($.parseXML(data));

          var result = [];

          angular.forEach(rss.find("item"), function(item) {
            result.push({
              title: $(item).find("title").text(),
              link: $(item).find("link").text(),
              pubDate: new Date($(item).find("pubDate").text()),
              description: $sce.trustAsHtml($(item).find("description").text())
            });
          });

          deferred.resolve(result);
        })
        .error(function(error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    return service;  
  }  
})();