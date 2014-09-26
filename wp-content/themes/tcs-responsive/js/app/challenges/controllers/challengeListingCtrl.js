/*jslint nomen: true*/
/*global angular: true, _: true */
(function (angular) {
  'use strict';
  var challengesModule = angular.module('tc.challenges');
  challengesModule.controller('ChallengeListingCtrl', ['$scope', '$rootScope', '$routeParams', '$filter', '$location', '$cookies', '$timeout', '$q', 'ChallengesService', 'ChallengeDataService', 'DataService', '$window', 'TemplateService', 'GridService', 'cfpLoadingBar',
    function ($scope, $rootScope, $routeParams, $filter, $location, $cookies, $timeout, $q, ChallengesService, ChallengeDataService, DataService, $window, TemplateService, GridService, cfpLoadingBar) {

      function startLoading() {
        cfpLoadingBar.start();
        $scope.loading = true;
        $scope.dataDisplayed = $scope.dataDisplayed || false; // to be used to determine whether to display an 'empty' message
      }

      function stopLoading() {
        cfpLoadingBar.complete();
        $scope.loading = false;
      }
      
      
      /*
       * Gets the available challenge types for a community
       */
      function getChallengeTypes(community) {
        var deferred = $q.defer();
        if (!community || community === '') {
          deferred.resolve([]);
          return deferred.promise;
        }
        
        ChallengesService.getChallengeTypes(community).then(function (data) {
          _.each(data, function (type) {
            $scope.challengeTypes[type.description] = type.name;
            $scope.allChallengeTypes.push(type.description);
          });
          deferred.resolve($scope.challengeTypes);
        });
        return deferred.promise;
      }
      
      function getData(community, listType, order, filter, pageIndex, pageSize) {
        var params = {};
        var listType = $routeParams.challengeStatus ? $routeParams.challengeStatus.toLowerCase() : 'active';
        $scope.challenges = [];
        if (community) {
          params.type = community;
        }
        if (order && order.column) {
          params.sortColumn = order.column;
          params.sortOrder = order.order || 'asc';
        }
        if (listType == 'past' && (!filter || !filter.startDate)) {
          var month = moment().month() + 1 + '';
          month = month.length < 2 ? '0' + month : month;
          var year = moment().year() - 1;
          var startDate = year + '-' + month + '-01';
          if (!filter) var filter = {startDate: startDate};
          else filter.startDate = filter.startDate || startDate;
          filter.startDate = moment(filter.startDate).toDate();
        }
        if (filter) {
          if (filter.startDate) {
            params.submissionEndFrom = $filter('date')(filter.startDate, 'yyyy-MM-dd');
          }
          if (filter.endDate) {
            params.submissionEndTo = $filter('date')(filter.endDate, 'yyyy-MM-dd');
          }
          if (filter.challengeTypes && filter.challengeTypes.length > 0) {
            params.challengeType = filter.challengeTypes.join(',');
          }
          if (filter.keywords && filter.keywords.length > 0) {
            params.challengeName = filter.keywords.join(',');
          }
          if (filter.technologies && filter.technologies.length > 0) {
            params.technologies = filter.technologies.join(',');
          }
          if (filter.platforms && filter.platforms.length > 0) {
            params.platforms = filter.platforms.join(',');
          }
          if (pageIndex && pageIndex > 0) {
            params.pageIndex = pageIndex;
          }
          if (pageSize && pageSize > 0) {
            params.pageSize = pageSize;
          }
          
          var type = listType;
          if(filter.userChallenges) {
            type = 'user-' + listType;
            if (!filter.challengeTypes || filter.challengeTypes.length === 0) {
              params.challengeType = $scope.allChallengeTypes.join(',');
            }
          }  
          ChallengesService.getChallenges(type || 'active', params)
            .then(function (data) {
              $scope.challenges = data;
              $scope.pagination = data.pagination;
              $location.search('pageIndex', data.pagination.pageIndex);
              $scope.pagination.last = Math.min($scope.pagination.total,$scope.pagination.pageIndex*$scope.pagination.pageSize);
            }, function () {
              $scope.challenges = [];
            });
        }
      }

      function generateFeedUrl() {
        var url = '/challenges/feed?';
        url += 'list=' + ($scope.contest.listType || 'active');
        url += '&contestType=' + ($scope.contest.contestType || 'all');
        if ($scope.filter.technologies.length > 0) {
          url += '&technologies=' + $scope.filter.technologies.join(',');
        }
        if ($scope.filter.platforms.length > 0) {
          url += '&platforms=' + $scope.filter.platforms.join(',');
        }
        $scope.feedUrl = url;
      }

      function parseFilters() {
        var moment = $window.moment;
        $scope.filter = {
          challengeTypes: [],
          keywords: [],
          technologies: [],
          platforms: [],
          startDate: null,
          endDate: null,
          userChallenges: false
        };
        // Set filters from url
        if ($routeParams.startDate) {
          $scope.filter.startDate = moment($routeParams.startDate).toDate();
        } else {
          $scope.filter.startDate = undefined;
        }
        if ($routeParams.endDate) {
          $scope.filter.endDate = moment($routeParams.endDate).toDate();
        } else {
          $scope.filter.endDate = undefined;
        }
        if ($scope.filter.startDate && $scope.filter.endDate) {
          if ($scope.filter.startDate.getTime() > $scope.filter.endDate.getTime()) {
            $scope.filter.startDate = undefined;
            $scope.filter.endDate = undefined;
          }
        }
        if (Array.isArray($routeParams.technologies)) {
          $scope.filter.technologies = $routeParams.technologies;
        } else if (typeof $routeParams.technologies === 'string' && !$routeParams.technologies.match(/^\s*$/)) {
          $scope.filter.technologies = [$routeParams.technologies];
        } else {
          $scope.filter.technologies = [];
        }

        if (Array.isArray($routeParams.platforms)) {
          $scope.filter.platforms = $routeParams.platforms;
        } else if (typeof $routeParams.platforms === 'string' && !$routeParams.platforms.match(/^\s*$/)) {
          $scope.filter.platforms = [$routeParams.platforms];
        } else {
          $scope.filter.platforms = [];
        }
        
        if (Array.isArray($routeParams.keywords)) {
          $scope.filter.keywords = $routeParams.keywords;
        } else if (typeof $routeParams.keywords === 'string' && !$routeParams.keywords.match(/^\s*$/)) {
            $scope.filter.keywords = [$routeParams.keywords];
        } else {
          $scope.filter.keywords = [];
        }
        
        if (Array.isArray($routeParams.challengeTypes)) {
          $scope.filter.challengeTypes = $routeParams.challengeTypes;
        } else if (typeof $routeParams.challengeTypes === 'string' && !$routeParams.challengeTypes.match(/^\s*$/)) {
          $scope.filter.challengeTypes = [$routeParams.challengeTypes];
        } else {
          $scope.filter.challengeTypes = [];
        }
        $scope.filter.userChallenges = !!$routeParams.userChallenges && $scope.authenticated;

        generateFeedUrl();
      }
    
      $scope.showFilters = false;

      startLoading();

      $scope.filter = {
        challengeTypes: [],
        keywords: [],
        technologies: [],
        platforms: [],
        startDate: null,
        endDate: null,
        userChallenges: false
      };

      var queryVars = $location.search();
      $scope.pagination = {
        pageSize: 12,
        pageIndex: typeof queryVars['pageIndex'] == 'undefined' ? 1 : parseInt(queryVars['pageIndex'])
      };
      
      $scope.orderBy = {
        'active': {
          column: 'registrationEndDate',
          order: 'desc'
        }
      };
      
      
      //prevent errors from mixed-case URL parameters by converting to lowercase
      $scope.contest = {
        contestType: $routeParams.challengeArea ? $routeParams.challengeArea.toLowerCase() : '',
        listType: $routeParams.challengeStatus ? $routeParams.challengeStatus.toLowerCase() : 'active',
        isUserChallenges: !!$routeParams.userChallenges
      };
            
      parseFilters();

      $scope.titles = {
        '': 'All Open Challenges',
        design: 'Graphic Design Challenges',
        develop: 'Software Development Challenges',
        data: 'Data Science Challenges'
      };
      $scope.titleType = {
        active: 'Open ',
        past: 'Past ',
        upcoming: 'Upcoming '
      };

      //set page title
      var pageTitle = $scope.titles[$scope.contest.contestType] + " - Topcoder";
      if ($scope.contest.contestType !== '') {
        pageTitle = $scope.titleType[$scope.contest.listType] + pageTitle;
      }
      $rootScope.pageTitle = pageTitle;
      
      if ($scope.contest.listType !== 'past' && $scope.contest.contestType !== 'data') {
        if ($routeParams.view) {
          $scope.view = $routeParams.view;
        } else if ($cookies.tcChallengesView) {
          $scope.view = $cookies.tcChallengesView;
        } else {
          $scope.view = 'table';
        }
      } else {
        $scope.view = 'table';
      }

      $scope.getTrackSymbol = TemplateService.getTrackSymbol;
      $scope.formatTimeLeft = TemplateService.formatTimeLeft;
      $scope.getContestDuration = TemplateService.getContestDuration;
      $scope.getPhaseName = TemplateService.getPhaseName;
      $scope.dateFormat = 'MMM D, YYYY HH:mm z';
      $scope.images = $window.wordpressConfig.stylesheetDirectoryUri + '/i/';
      $scope.definitions = GridService.definitions($scope.contest);
      $scope.gridOptions = GridService.gridOptions('definitions', $scope.contest);
      $scope.showFilters = false;
      $scope.technologies = [];
      $scope.platforms = [];
      $scope.challengeTypes = [];
      $scope.allChallengeTypes = [];

      $scope.all = function () {
        getData($routeParams.challengeArea, $routeParams.challengeStatus || 'active',
              $scope.orderBy, $scope.filter, 1, $scope.pagination.total);
      };
      
      $scope.prev = function () {
        getData($routeParams.challengeArea, $routeParams.challengeStatus || 'active',
              $scope.orderBy, $scope.filter, $scope.pagination.pageIndex - 1, $scope.pagination.pageSize);
      };
      
      $scope.next = function () {
        getData($routeParams.challengeArea, $routeParams.challengeStatus || 'active',
              $scope.orderBy, $scope.filter, $scope.pagination.pageIndex + 1, $scope.pagination.pageSize);
      };

      $scope.findByTechnology = function (tech) {
        $scope.filter.technologies.push(tech);
        $scope.searchSubmit($scope.filter);
      };

      $scope.findByPlatform = function (plat) {
        $scope.filter.platforms.push(plat);
        $scope.searchSubmit($scope.filter);
      };

      $scope.searchSubmit = function (options) {
        var search = {};
        $scope.pagination.pageIndex = 1;
        if (options.startDate) {
          search.startDate = $filter('date')(options.startDate, 'yyyy-MM-dd');
        }
        if (options.endDate) {
          search.endDate = $filter('date')(options.endDate, 'yyyy-MM-dd');
        }

        if (options.technologies && options.technologies.length > 0) {
          search.technologies = options.technologies;
        }

        if (options.platforms && options.platforms.length > 0) {
          search.platforms = options.platforms;
        }
        if (options.challengeTypes && options.challengeTypes.length > 0) {
          search.challengeTypes = options.challengeTypes;
        }
        if (options.keywords && options.keywords.length > 0) {
          search.keywords = options.keywords;
        }
        if (options.userChallenges && $scope.authenticated) {
          search.userChallenges = true;
        }
        $location.search(search);
        
      };

      if ($scope.contest.contestType === 'develop') {
        DataService.one('technologies').get().then(function (data) {
          if (data) {
            $scope.technologies = data.technologies;
          }
        });

        DataService.one('platforms').get().then(function (data) {
          if (data) {
            $scope.platforms = data.platforms;
          }
        });
      }

      $scope.$watch('view', function (view, oldView) {
        if (view !== oldView) {
          //$location.search('view', view);
          $cookies.tcChallengesView = view;
        }
      });
      
      $scope.$watch('gridOptions.ngGrid.config.sortInfo', function (sortInfo) {
        if (!sortInfo) {
          return; 
        }
        if (sortInfo.fields.length > 0) {
          $scope.orderBy[$scope.contest.listType || 'active'] = {
            column: sortInfo.fields[0],
            order: sortInfo.directions[0]
          };
          sortInfo.fields.length = 0;
          sortInfo.directions.length = 0;
          getData($scope.contest.contestType, $scope.contest.listType || 'active',
              $scope.orderBy[$scope.contest.listType || 'active'], $scope.filter, $scope.pagination.pageIndex, $scope.pagination.pageSize);
        }
      }, true);
      
      $scope.$on('$locationChangeSuccess', function (event) {
        
        $timeout(function () {
          parseFilters();
          if($scope.filter.userChallenges) {
            $scope.contest.isUserChallenges = true;
            $scope.definitions = GridService.definitions($scope.contest);
          } else {
            $scope.contest.isUserChallenges = false;
            $scope.definitions = GridService.definitions($scope.contest);
          }
          getData($scope.contest.contestType, $scope.contest.listType || 'active',
              $scope.orderBy[$scope.contest.listType || 'active'], $scope.filter, $scope.pagination.pageIndex, $scope.pagination.pageSize);
        });
      });
      
      getChallengeTypes($scope.contest.contestType).then(function() {
        getData($scope.contest.contestType, $scope.contest.listType || 'active',
              $scope.orderBy[$scope.contest.listType || 'active'], $scope.filter, $scope.pagination.pageIndex, $scope.pagination.pageSize);
      }); 
    }]);
}(angular));
