/**
 * This code is copyright (c) 2014 Topcoder Corporation
 *
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';

angular.module('tc.memberProfileService', [
    'restangular'
])

/**
 * To retrieve information from non api source .
 */
.factory('NonApiSourceRestangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl(tcconfig.communityURL);
  });
})

/**
 * This service is a central place for methods to interact with API server.
 */
.factory('MemberProfileService', ['NonApiSourceRestangular', 'Restangular', '$q', function(NonApiSourceRestangular, Restangular, $q){
  return {
    'getUser' : function(handle){
      // Returns fetched restangular object of the fetched user
      return Restangular.all('users').one(handle).get();
    },
    /*
     * Return user's recent wins stats in design track.
     */
    'getRecentWins': function (handle, track, cache) {
      if(cache[track]){
        //hit cache.
        var deferred = $q.defer();
        deferred.resolve(cache[track]);
        return deferred.promise;
      } else {
        return Restangular.one('users').one(handle).one("statistics").one(track).one('recentWins').get();
      }
    },

    'getUserId' : function(handle){
      return Restangular.one('users').one('search').get({handle : handle, caseSensitive : false});
    },

    /*
     * Get develop statistics, Currently the track will be 'develop' only.
     */
    'getStatistics' : function(handle, track, cache){
      if(cache[track]){
        //hit cache.
        var deferred = $q.defer();
        deferred.resolve(cache[track]);
        return deferred.promise;
      } else {
        return Restangular.one('users', handle).one('statistics', track).get();
      }
    },

    'getRatingAndDistribution' : function(handle, subtrack, track, cache){
      if(cache[track] && cache[track][subtrack]){
        //hit cache.
        var deferred = $q.defer();
        deferred.resolve(cache[track][subtrack]);
        return deferred.promise;
      } else {
        subtrack = subtrack.toLowerCase().replace(/ /g,"_");
        if (subtrack === 'ui_prototype_competition') {
          subtrack = 'ui_prototypes';
        }else if (subtrack === 'ria_build_competition'){
          subtrack = 'ria_build';
        }
        return Restangular.one(track).one('statistics').one(handle).one(subtrack).get();
      }
    },

    /**
     * Get data science statistics, the subtrack can be 'algorithm' or 'marathon'.
     */
    'getDataScienceStats' : function  (handle, subtrack, cache) {
      if(cache['dataScience'][subtrack]){
        //hit cache.
        var deferred = $q.defer();
        deferred.resolve(cache['dataScience'][subtrack]);
        return deferred.promise;
      } else {
        if(subtrack ==='algorithm'){
            subtrack = 'srm';
        }
        return Restangular.one('users', handle).one('statistics', 'data').one(subtrack).get();
      }
    },

    /**
     * Get the current badge counts. badge information don't need to cache,
     * since it's a common information and doesn't change with states.
     */
    'getAchievementCurrent' : function(userId, ruleId, cache){

     return NonApiSourceRestangular.one('tc').get({
        module : 'MemberAchievementCurrent',
        cr : userId,
        ruleId : ruleId
      });
    }
  };
}])

/*
 * Load several images asynchrous. The returned promise is resolved when all images
 * have a result, no matter fail or success. So the returned promise will always be
 * resolved.
*/

.factory('ImageService', ['$q',
  function ($q) {
    return {

    'load': function (imageSources) {

      var loadImage = function (imageSource) {

        var deferred = $q.defer();

        // no matter success or fail, we count it as a result.
        $(new Image()).load(function () {

          deferred.resolve(true);

        }).error(function () {

          deferred.resolve(false);

        }).prop('src', imageSource);

        return deferred.promise;
      }

      var promises = [];

      $(imageSources).each(function () {
        promises.push(loadImage(this));
      });

      return $q.all(promises);
    }
    };
  }
]);
