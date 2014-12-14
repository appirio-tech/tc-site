/**
 * This code is copyright (c) 2014 Topcoder Corporation
 *
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';

angular.module('tc.usersService', [
    'restangular'
])

/**
 * To retrieve information from non api source .
 */
.factory('NonApiSourceRestangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl('http://community.topcoder.com');
  });
})

/**
 * This service is a central place for methods to interact with API server.
 */
.factory('UsersService', ['NonApiSourceRestangular', 'Restangular', '$q', function(NonApiSourceRestangular, Restangular, $q){
  return {
    'getUser' : function(handle){
      // Returns fetched restangular object of the fetched user
      try{
        return Restangular.all('users').one(handle).get();
      } catch(e){
        alert('??')
      }
    },
    /*
     * Return the track with the most wins and falls back on submission count if no wins.
     */
    'getMastery': function(handle) {
      var deferred = $q.defer();
      $q.all({
        'data': Restangular.one('users', handle).one('statistics', 'data').one('marathon').get(),
        'dataSRM': Restangular.one('users', handle).one('statistics', 'data').one('srm').get(),
        'develop': Restangular.one('users', handle).one('statistics', 'develop').get(),
        'design': Restangular.one('users', handle).one('statistics', 'design').get()
      }).then(function(cats){
        var topTracks = [];
        var developTopTrack = _.max(cats.develop.CompetitionHistory, function(track, k){ track.name = k; return track.wins; });
        if(developTopTrack.wins === 0 ) developTopTrack = _.max(cats.develop.CompetitionHistory, function(track, k){ track.name = k; return track.submissions; });
        
        var developTopTrackRating = _.max(cats.develop.Tracks, function(track, k){ track.name = k; return track.rating; });
        if(developTopTrackRating instanceof Object) {
          developTopTrack.rating = developTopTrackRating.rating;
          developTopTrack.ratingName = developTopTrackRating.name;
        }

        if(developTopTrack instanceof Object) {
          developTopTrack.category = 'Development';
          topTracks.push(developTopTrack);
        }
        var showDevelopSection = !jQuery.isEmptyObject(cats.develop.Tracks);

        var designTopTrack =  _.max(cats.design.Tracks, function(track, k){ track.name = k; track.wins = track.numberOfWinningSubmissions; track.submissions = track.numberOfSubmissions;  return track.numberOfWinningSubmissions; });
        if(designTopTrack.wins === 0 ) developTopTrack = _.max(cats.design.Tracks, function(track, k){ track.name = k; track.wins = 0; track.submissions = track.numberOfSubmissions; return track.numberOfSubmissions; });
        if(designTopTrack instanceof Object) {
          designTopTrack.category = 'Design';
          topTracks.push(designTopTrack);
        }
        var showDesignSection = designTopTrack.submissions >= 1;

        var dataCats = [];
        if(cats.data.competitions) dataCats.push(cats.data);
        if(cats.dataSRM.competitions) dataCats.push(cats.dataSRM);

        if(dataCats.length){
          var dataTopTrack = _.max(dataCats, function(track){ track.name = track.route; track.submissions = track.competitions; return track.rating});
          dataTopTrack.category = 'Data';
          var showDataSection = dataTopTrack.submissions >= 1;
          topTracks.push(dataTopTrack);
        } else {
          showDataSection = false;
        }
        

        if(true) deferred.resolve({mastery: _.sortBy(topTracks, 'wins').reverse()[0], showDevelopSection: showDevelopSection, showDesignSection: showDesignSection, showDataSection: showDataSection });
        else deferred.resolve({mastery: _.sortBy(topTracks, 'submissions').reverse()[0], showDevelopSection: showDevelopSection, showDesignSection: showDesignSection, showDataSection: showDataSection});
      }, deferred.reject);
      return deferred.promise;
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
