/*global angular: true, _: true */
(function (angular) {
  'use strict';
  var challengesModule = angular.module('tc.challenges');
  challengesModule.controller('ChallengeListingCtrl', ['$scope', '$routeParams', '$filter', '$location', '$cookies', 'ChallengesService', 'ChallengeDataService', 'DataService', '$window', 'TemplateService', 'GridService', 'cfpLoadingBar',
    function ($scope, $routeParams, $filter, $location, $cookies, ChallengesService, ChallengeDataService, DataService, $window, TemplateService, GridService, cfpLoadingBar) {

      function startLoading() {
        cfpLoadingBar.start();
        $scope.loading = true;
      }

      function stopLoading() {
        cfpLoadingBar.complete();
        $scope.loading = false;
      }

      function parseFilters() {
        // Set filters from url
        if($routeParams.startDate) {
          $scope.filter.startDate = new Date($routeParams.startDate);
        }
        if($routeParams.endDate) {
          $scope.filter.endDate = new Date($routeParams.endDate);
        }
        if (Array.isArray($routeParams.technologies)) {
          $scope.filter.technologies = $routeParams.technologies;
        } else if (typeof $routeParams.technologies === 'string') {
          $scope.filter.technologies = [$routeParams.technologies];
        }

        if (Array.isArray($routeParams.platforms)) {
          $scope.filter.platforms = $routeParams.platforms;
        } else if (typeof $routeParams.platforms === 'string') {
          $scope.filter.platforms = [$routeParams.platforms];
        }
      }
      
      function filterChallenges() {
        $scope.filteredChallenges = $scope.allChallenges.filter(function (contest) {
          if (   $scope.filter.challengeType
              && $scope.filter.challengeType !== ''
              && $scope.filter.challengeType.toLowerCase() !== 'all'
              && $scope.filter.challengeType !== contest.challengeType) {
            return false;
          }
          var subEndDate = $filter('date')(new Date(contest.submissionEndDate), 'yyyyMMdd');
          if ($scope.filter.startDate && subEndDate < $filter('date')($scope.filter.startDate, 'yyyyMMdd')) {
            return false;
          }
          if ($scope.filter.endDate && subEndDate > $filter('date')($scope.filter.endDate, 'yyyyMMdd')) {
            return false;
          }
          if ($scope.filter.technologies && $scope.filter.technologies.length > 0 &&  _.intersection(contest.technologies, $scope.filter.technologies).length === 0) {
            return false;
          }
          if ($scope.filter.platforms && $scope.filter.platforms.length > 0 &&  _.intersection(contest.platforms, $scope.filter.platforms).length === 0) {
            return false;
          }
          return true;
        });

        $scope.challenges = $scope.setPagingData($scope.filteredChallenges, $scope.page, $scope.pageSize);
        $scope.showFilters = false;
      }

      startLoading();

      $scope.filter = {
        challengeType: $routeParams.challengeType || 'All',
        technologies: [],
        platforms: [],
        startDate: null,
        endDate: null
      };
      parseFilters();

      //console.log('routes', $routeParam);
      $scope.allChallenges = [];
      $scope.challenges = [];
      $scope.filteredChallenges = [];
      $scope.contest = {
        contestType: $routeParams.challengeArea || '',
        listType: $routeParams.challengeStatus || 'active'
      };

      $scope.titles = {
        '': 'All Open Challenges',
        design: 'Graphic Design Challenges',
        develop: 'Software Development Challenges',
        data: 'Data Science Challenges'
      };

      if ($routeParams.view) {
        $scope.view = $routeParams.view;
      } else if ($cookies.tcChallengesView) {
        $scope.view = $cookies.tcChallengesView;
      } else {
        $scope.view = 'table';
      }

      $scope.getTrackSymbol = TemplateService.getTrackSymbol;
      $scope.formatTimeLeft = TemplateService.formatTimeLeft;
      $scope.getContestDuration = TemplateService.getContestDuration;
      $scope.getPhaseName = TemplateService.getPhaseName;
      $scope.dateFormat = 'dd MMM yyyy hh:mm EDT';
      $scope.images = $window.wordpressConfig.stylesheetDirectoryUri + '/i/';
      $scope.definitions = GridService.definitions($scope.contest);
      $scope.gridOptions = GridService.gridOptions('definitions');
      $scope.showFilters = false;
      $scope.technologies = [];
      $scope.platforms = [];
      $scope.pageSize = 10;
      $scope.page = 1;
      $scope.currentPageSize = $scope.pageSize;

      $scope.setPagingData = function (data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
          $scope.$apply();
        }

        stopLoading();

        return pagedData;
      };


      function getChallenges(contest) {
        var params = {};
        if (contest.contestType && contest.contestType !== '') {

          // Data is currently going to a different endpoint
          if (contest.contestType === 'data') {
            params.listType = contest.listType;
          } else {
            params.type = contest.contestType;
          }
        }

        if (contest.contestType === 'data') {
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

              $scope.allChallenges = challenges;
              filterChallenges();
            },
            function () {
              $scope.challenges = [];
              stopLoading();
            });
        } else {
          ChallengesService.all(contest.listType).getList(params).then(function (challenges) {
              $scope.allChallenges = challenges;
              filterChallenges();
            },
            function () {
              $scope.challenges = [];
              stopLoading();
            });
        }

      }

      $scope.findByTechnology = function (tech) {
        $scope.submit({technologies: [tech]});
      };

      $scope.findByPlatform = function (plat) {
        $scope.submit({platforms: [plat]});
      };

      $scope.searchSubmit = function(options) {
        var search = {};
        if(options.startDate) {
          search.startDate = $filter('date')(options.startDate, 'yyyy-MM-dd');
        }
        if(options.endDate) {
          search.endDate = $filter('date')(options.endDate, 'yyyy-MM-dd');
        }

        if(options.technologies && options.technologies.length > 0) {
          search.technologies = options.technologies;
        }

        if(options.platforms && options.platforms.length > 0) {
          search.platforms = options.platforms;
        }
        if(options.challengeType && options.challengeType.toLowerCase() !== 'all' && options.challengeType !== '') {
          search.challengeType = options.challengeType;
        }
        $location.search(search);
      };

      DataService.one('technologies').get().then(function (data) {
        if (data) {
          $scope.technologies = data.technologies;
        }
      });
      
      DataService.one('platforms').get().then(function(data) {
        if(data) {
          $scope.platforms = data.platforms;
        }
      });

      $scope.$watch('page', function () {
        $scope.challenges = [];
        startLoading();

        if($scope.page < 0) {
          $scope.page = 0;
        }
        $scope.challenges = $scope.setPagingData($scope.filteredChallenges, $scope.page, $scope.pageSize);
      });

      $scope.$watch('view', function (view, oldView) {
        if(view !== oldView) {
          //$location.search('view', view);
          $cookies.tcChallengesView = view;
        }
      });

      getChallenges($scope.contest);
    }]);
}(angular));
