/*jslint nomen: true*/
/*global angular: true, _: true */
(function (angular) {
  'use strict';
 
  angular.module('tc.challenges.services', [
    'restangular'
  ])
    /**
     * Service to request challenges data rom TC API
     */
    .factory('ChallengesService', ['Restangular', '$filter', '$q', 'ChallengeDataService',
      function (Restangular, $filter, $q, ChallengeDataService) {
        var mockPaging = ['active', 'upcoming'],
          datas = {},
          defPageSize = 10;

        /**
         * Filters the challenges based on parameters
         * @param {Object[]} data - the challenges
         * @param {Object} params - the filters
         */
        function filterChallenges(data, params) {
          var technologies,
            platforms,
            challengeTypes,
            keywords,
            reg,
            dt,
            start,
            end,
            result = _.filter(data, function (contest) {
              if (params.challengeType) {
                challengeTypes = params.challengeType.split(',');
              }
              if (params.challengeName) {
                keywords = params.challengeName.split(',');
              }

              if (challengeTypes
                  && challengeTypes.length > 0) {
                reg = new RegExp(challengeTypes.join('|'), 'i');
                if (!contest.challengeType.match(reg)) {
                  return false;
                }
              }
              if (keywords
                  && keywords.length > 0) {
                reg = new RegExp(keywords.join('|'), 'i');
                if (!contest.challengeName.match(reg)) {
                  return false;
                }
              }
              dt = window.moment.tz(contest.submissionEndDate, 'America/New_York');
              if (params.submissionEndFrom) {
                start = window.moment(params.submissionEndFrom);
              }
              if (params.submissionEndTo) {
                end = window.moment(params.submissionEndTo).add(1, 'day');
              }
              if (start && dt.isBefore(start, 'day')) {
                return false;
              }

              if (end && dt.isAfter(end, 'day')) {
                return false;
              }
              if (params.technologies) {
                technologies = params.technologies.split(',');
              }
              if (params.platforms) {
                platforms = params.platforms.split(',');
              }
              if ((technologies && technologies.length > 0
                &&  _.intersection(contest.technologies, technologies).length === 0)
                  || (platforms && platforms.length > 0
                    &&  _.intersection(contest.platforms, platforms).length === 0)
                  ) {
                return false;
              }
              return true;
            });

          return result;
        }
        /**
         * Async Callback used for filtering challenges on client
         * @param {Object[]} data - the challenges
         * @param {Object} params - the filters
         * @param {Object} defered - the defered object to populate
         */
        function thenHandleParams(data, params, defered) {
          var result = data,
            pageIndex = params.pageIndex || 1,
            pageSize = params.pageSize || defPageSize,
            total = 0;
          if (params.sortColumn && params.sortColumn !== '') {
            result = $filter('orderBy')(data, params.sortColumn, params.sortOrder === 'desc');
          }
          result = filterChallenges(result, params);
          total = result.length;
          result = result.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
          result.pagination = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            total: total
          };
          defered.resolve(result);
        }
        
        /**
         * Gets challenges from backend
         * @param {string} listType - type of challenges (active, pas, upcoming)
         * @param {Object} patams - filters
         */
        function getData(listType, params) {
          if (params.type === 'data') {
            var deferred = $q.defer(),
              p = angular.extend({}, params);
            delete params.type;
            params.listType = listType;
            
            if (params.sortColumn === 'registrationStartDate') {
              params.sortColumn = 'startdate';
            } else if (params.sortColumn === 'challengeName') {
              params.sortColumn = 'fullname';
            } else if (params.sortColumn === 'submissionEndDate') {
              params.sortColumn = 'enddate';
            } else if (params.sortColumn) {
              delete params.sortColumn;
            }
            
            ChallengeDataService.all('').getList(params).then(function (challenges) {
              _.each(challenges, function (challengeItem) {
                challengeItem.challengeCommunity = 'data';
                challengeItem.challengeName = challengeItem.fullName;
                challengeItem.challengeType = 'Marathon';
                challengeItem.registrationStartDate = challengeItem.startDate;
                challengeItem.submissionEndDate = challengeItem.endDate;
                challengeItem.contestType = 'data';
                challengeItem.numRegistrants = challengeItem.numberOfRegistrants;
                challengeItem.numSubmissions = challengeItem.numberOfSubmissions;
                challengeItem.totalPrize = 'N/A';
                if (!challengeItem.technologies) {
                  challengeItem.technologies = [];
                }
                if (!challengeItem.platforms) {
                  challengeItem.platforms = [];
                }
              });
              if (listType !== 'past') {
                var devParams = angular.extend(params, {challengeType: 'Code', technologies: 'Data Science', type: 'develop'});
                delete devParams.listType;

                Restangular.one('challenges').getList(listType, devParams)
                  .then(function (devChallenges) {
                    challenges = challenges.concat(devChallenges);
                    deferred.resolve(challenges);
                  });
              } else {
                deferred.resolve(challenges);
              }
            });
           
            return deferred.promise;
          } else {
            return Restangular.one('challenges').getList(listType, params);
          }
        }
        
        return {
          'getChallenges': function (listType, params) {
            var key = (params.type || 'all') + '_' + (listType || 'active'), // cache key
              deferred,
              result;
            // Is paging/filtering have to be done on server (past challenges)
            if (mockPaging.indexOf(listType) === -1) {
              return getData(listType, params);
            } else {
              deferred = $q.defer();
              // Are data already fetched?
              if (datas[key]) {
                thenHandleParams(datas[key], params, deferred);
              } else {
                getData(listType, {type: params.type}).then(function (data) {
                  datas[key] = data;
                  thenHandleParams(data, params, deferred);
                });
              }
              return deferred.promise;
            }
          },
          'getChallengeTypes': function (community) {
            if (community !== 'data') {
              return Restangular.one(community).one('challengetypes').getList();
            } else {
              var def = $q.defer();
              def.resolve([]);
              return def.promise;
            }
          }
        };
      }])

    .factory('ChallengeDataService', ['Restangular', 'API_URL',
      function (Restangular, API_URL) {
        return Restangular.withConfig(function (RestangularConfigurer) {
          RestangularConfigurer.setBaseUrl(API_URL + '/data/marathon/challenges');
        });
      }]);
}(angular));