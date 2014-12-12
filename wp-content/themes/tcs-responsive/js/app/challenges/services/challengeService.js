/*jslint nomen: true*/
/*global angular: true, _: true */
/**
* Changelog
* 09/17/2014 Add My Challenges Filter and Improve Filters
* - Added UserChallengesService dependency to get the user challenges
* - route request to UserChallengesService if track type is 'user-active' or 'user-past'
*/
(function (angular) {
  'use strict';

  angular.module('tc.challenges.services', [
    'restangular'
  ])
    /**
     * Service to request challenges data rom TC API
     */
    .factory('ChallengesService', ['Restangular', '$filter', '$q', 'ChallengeDataService', 'UserChallengesService', 'ChallengeDataCalendarService', 'ExternalChallengeDataService',
      function (Restangular, $filter, $q, ChallengeDataService, UserChallengesService, ChallengeDataCalendarService, ExternalChallengeDataService) {
        var mockPaging = ['active', 'upcoming', 'user-active', 'user-past'],
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
                //escape special characters to use in regex
                var pattern = /([.?*+^$[\]\\(){}|-])/g;
                keywords.forEach(function(element, index) {
                  keywords[index] = keywords[index].replace(pattern, "\\$1");
                });

                var reg = new RegExp(keywords.join('|'), 'i');
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
          } else if (listType === 'user-active' || listType === 'user-past') {
            // Add My Challenges Filter and Improve Filters challenge -- different api endpoint
            return UserChallengesService.getUserChallenges(listType === 'user-past' ? 'past' : 'active', params);
          } else {
            return Restangular.one('challenges').getList(listType, params);
          }
        }

        /**
         * Gets data science challenges for calendar from cache or backend
         * @param {Object} patams - submissionEndFrom and submissionEndTo
         */
        function getDataCalendarChallenges(params) {
          var deferred = $q.defer(),
            moment = window.moment,
            key,
            prevKey,
            nextKey,
            startMonth,
            endMonth,
            medianMonth,
            monthIterator,
            minQueryMonth,
            maxQueryMonth,
            queryParams,
            endDate,
            results = [],
            tempResults = [],
            queryRadius = 2,
            promises = [];
          if (params.submissionEndMonth) {
            medianMonth = moment(params.submissionEndMonth).startOf('month');
          } else {
            medianMonth = moment().startOf('month');
          }
          key = 'data-calendar_' + medianMonth.format('YYYYMM');
          prevKey = 'data-calendar_' + medianMonth.clone().subtract('month', 1).format('YYYYMM');
          nextKey = 'data-calendar_' + medianMonth.clone().add('month', 1).format('YYYYMM');
          if ((key in datas) && (prevKey in datas) && (nextKey in datas)) {
            deferred.resolve(_.union(datas[prevKey], datas[key], datas[nextKey]));
            return deferred.promise;
          }
          if (key in datas) {
            if (!(prevKey in datas)) {
              if (nextKey in datas) {
                // Fetch other months' challenges, should first add current month's
                results = datas[key];
                medianMonth.subtract('month', 1 + queryRadius).startOf('month');
              }
            } else {
              // Fetch other months' challenges, should first add current month's
              results = datas[key];
              medianMonth.add('month', 1 + queryRadius).startOf('month');
            }
          }
          startMonth = medianMonth.clone().subtract('months', queryRadius).startOf('month');
          endMonth = medianMonth.clone().add('months', queryRadius).endOf('month');
          monthIterator = startMonth.clone();
          // Initially set minQueryMonth to max possible month and maxQueryMonth to min possible month
          minQueryMonth = endMonth.clone().add('month', 1).startOf('month');
          maxQueryMonth = startMonth.clone().subtract('month', 1).endOf('month');
          while (monthIterator.isBefore(endMonth)) {
            key = 'data-calendar_' + monthIterator.format('YYYYMM');
            if (!(key in datas)) {
              if (monthIterator.isBefore(minQueryMonth)) {
                minQueryMonth = monthIterator.clone().startOf('month');
              }
              if (monthIterator.isAfter(maxQueryMonth)) {
                maxQueryMonth = monthIterator.clone().endOf('month');
              }
            }
            monthIterator.add('month', 1);
          }
          // Iterator all months again to construct the result array
          monthIterator = startMonth.clone();
          while (monthIterator.isBefore(endMonth)) {
            if (monthIterator.isBefore(minQueryMonth) || monthIterator.isAfter(maxQueryMonth)) {
              key = 'data-calendar_' + monthIterator.format('YYYYMM');
              results = results.concat(datas[key]);
            }
            monthIterator.add('month', 1);
          }
          if (minQueryMonth.isBefore(maxQueryMonth)) {
            queryParams = {
              submissionEndFrom: minQueryMonth.format('YYYY-MM-DD'),
              submissionEndTo: maxQueryMonth.format('YYYY-MM-DD')
            };
            promises.push(ChallengeDataCalendarService.all('active').getList(queryParams));
            promises.push(ChallengeDataCalendarService.all('past').getList(queryParams));
            if (moment().isBefore(maxQueryMonth)) {
              promises.push(ChallengeDataCalendarService.all('upcoming').getList(queryParams));
            }
            $q.all(promises).then(function (challenges) {
              tempResults = _.flatten(challenges);
              // Iterator and cache query results
              monthIterator = minQueryMonth.clone();
              while (monthIterator.isBefore(maxQueryMonth)) {
                key = 'data-calendar_' + monthIterator.format('YYYYMM');
                datas[key] = _.filter(tempResults, function (challenge) {
                  endDate = moment.tz(challenge.submissionEndDate, 'YYYY-MM-DD HH:mm', 'America/New_York');
                  if (monthIterator.clone().subtract('day', 1).isBefore(endDate) && monthIterator.clone().endOf('month').add('day', 1).isAfter(endDate)) {
                    return true;
                  } else {
                    return false;
                  }
                });
                results = results.concat(datas[key]);
                monthIterator.add('month', 1);
              }
              deferred.resolve(results);
            });
          } else {
            deferred.resolve(results);
          }
          return deferred.promise;
        }

        /**
         * Format date string to standard format
         * @param date - date need to be formatted
         * @returns {string} formatted date
         */
        function formatDate(date) {
          return moment(date).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
        }

        /**
         * Get external data from new endpoint for active challenges on the design and develop tracks only.
         * @returns {Object} promise - promise of the deferred object
         */
        function getExternalData() {
          var deferred = $q.defer();
          ExternalChallengeDataService.all('getActiveChallenges').getList().then(function (challenges) {
            var developChallenges = [],
              designChallenges = [];
            _.each(challenges, function (challengeItem) {
              challengeItem.eventId = challengeItem.event.id;
              challengeItem.currentStatus = 'Active';
              challengeItem.postingDate = formatDate(challengeItem.postingDate);
              challengeItem.registrationEndDate = formatDate(challengeItem.registrationEndDate);
              challengeItem.submissionEndDate = formatDate(challengeItem.submissionEndDate);
              challengeItem.appealsEndDate = formatDate(challengeItem.appealsEndDate);
              challengeItem.currentPhaseEndDate = formatDate(challengeItem.currentPhaseEndDate);
              challengeItem.registrationStartDate = formatDate(challengeItem.registrationStartDate);
              if (challengeItem.challengeCommunity === 'develop') {
                developChallenges.push(challengeItem);
              } else if (challengeItem.challengeCommunity === 'design') {
                designChallenges.push(challengeItem);
              }
            });
            deferred.resolve({
              'develop': developChallenges,
              'design': designChallenges
            });
          });
          return deferred.promise;
        }

        return {
          'getChallenges': function (listType, params) {
            var key = (params.type || 'all') + '_' + (listType || 'active'), // cache key
              deferred,
              cacheParams = {type: params.type},
              promises;
            // For Data Science Challenges calendar view, we need to perform a different request
            if (listType === 'data-calendar') {
              return getDataCalendarChallenges(params);
            }
            // For user challenges, as we need to perform a different request in function of challenge types
            // We include the types as part of the cache key
            if (listType === 'user-active' || listType === 'user-past') {
              key = key + params.challengeType;
              cacheParams.challengeType = params.challengeType;
            }
            // Is paging/filtering have to be done on server (past challenges)
            if (mockPaging.indexOf(listType) === -1) {
              return getData(listType, params);
            } else {
              deferred = $q.defer();
              // Are data already fetched?
              if (datas[key]) {
                thenHandleParams(datas[key], params, deferred);
              } else {
                if (listType === 'active' && (params.type === 'develop' || params.type === 'design')) {
                  promises = [];
                  promises.push(getData(listType, cacheParams));
                  if (!(datas['develop_active_external'] && datas['design_active_external'])) {
                    promises.push(getExternalData());
                  }
                  $q.all(promises).then(function (data) {
                    if (data.length === 2) {
                      datas['develop_active_external'] = data[1]['develop'];
                      datas['design_active_external'] = data[1]['design'];
                    }
                    datas[key] = data[0].concat(datas[key + '_external']);
                    thenHandleParams(datas[key], params, deferred);
                  });
                } else {
                  getData(listType, cacheParams).then(function (data) {
                    datas[key] = data;
                    thenHandleParams(data, params, deferred);
                  });
                }
              }
              return deferred.promise;
            }
          },
          // Gets list of known challenge types by community
          'getChallengeTypes': function (community) {
            if (community && community !== '' && community !== 'data') {
              return Restangular.one(community).one('challengetypes').getList();
            } else {
              // No API for data challenges, so returns empty array here
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
      }])

    .factory('ChallengeDataCalendarService', ['Restangular', 'API_URL',
      function (Restangular, API_URL) {
        return Restangular.withConfig(function (RestangularConfigurer) {
          RestangularConfigurer.setBaseUrl(API_URL + '/dataScience/challenges');
        });
      }])

    .factory('ExternalChallengeDataService', ['Restangular', 'LC_URL',
      function (Restangular, LC_URL) {
        return Restangular.withConfig(function (RestangularConfigurer) {
          RestangularConfigurer.setBaseUrl(LC_URL);
        });
      }]);
}(angular));