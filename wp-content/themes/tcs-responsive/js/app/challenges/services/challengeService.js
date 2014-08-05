/*jslint nomen: true*/
/*global angular: true, _: true */
(function (angular) {
  'use strict';
  angular.module('tc.challenges.services', [
    'restangular'
  ])

    .factory('ChallengesService2', ['Restangular', 'API_URL',
      function (Restangular, API_URL) {
        return Restangular.withConfig(function (RestangularConfigurer) {
          RestangularConfigurer.setBaseUrl(API_URL + '/challenges');
        });
      }])
  
    .factory('ChallengesService', ['Restangular', '$filter', '$q', 'ChallengeDataService',
      function (Restangular, $filter, $q, ChallengeDataService) {
        var mockPaging = ['active', 'upcoming'],
          datas = {},
          defPageSize = 10;
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
              });
              deferred.resolve(challenges);
            });
            return deferred.promise;
          } else {
            return Restangular.one('challenges').getList(listType, params);
          }
        }
        
        return {
          'getChallenges': function (listType, params) {
            var key = (params.type || 'all') + '_' + (listType || 'active'),
              deferred,
              result;
            if (mockPaging.indexOf(listType) === -1) {
              return getData(listType, params);
            } else {
              deferred = $q.defer();
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
            return Restangular.one(community).one('challengetypes').getList();
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