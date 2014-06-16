/*global angular: true, _: true */
(function (angular) {
  'use strict';
  var challengesModule = angular.module('tc.challenges');
  challengesModule.controller('ChallengeListingCtrl', ['$scope', '$routeParams', '$location', '$cookies', 'ChallengesService', 'ChallengeDataService', 'DataService', '$window', 'TemplateService', 'GridService', 'cfpLoadingBar',
    function ($scope, $routeParams, $location, $cookies, ChallengesService, ChallengeDataService, DataService, $window, TemplateService, GridService, cfpLoadingBar) {

      function startLoading() {
        cfpLoadingBar.start();
        $scope.loading = true;
      }

      function stopLoading() {
        cfpLoadingBar.complete();
        $scope.loading = false;
      }

      $scope.loading = true;
      startLoading();

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
      $scope.search = {
        radioFilterChallenge: $routeParams.challengeType || 'all',
        show: false,
        allPlatforms: [],
        allTechnologies: [],
        technologies: []
      };
      $scope.pageSize = 10;
      $scope.page = 1;
      $scope.currentPageSize = $scope.pageSize;
      $scope.pageHeight = function() {
        if ($scope.view == 'table') {
          return $scope.challenges.length * $scope.gridOptions.rowHeight + "400px";
        }
        return 'auto';
      };
      // Set filters from url
      $scope.search.fSDate = $routeParams.fSDate;
      $scope.search.fEDate = $routeParams.fEDate;
      if (Array.isArray($routeParams.technologies)) {
        $scope.search.technologies = $scope.search.technologies.concat($routeParams.technologies.map(function (item) {
          return 'tech.' + item;
        }));
      } else if (typeof $routeParams.technologies === 'string') {
        $scope.search.technologies = $scope.search.technologies.concat($routeParams.technologies.split(',').map(function (item) {
          return 'tech.' + item;
        }));
      }

      if (Array.isArray($routeParams.platforms)) {
        $scope.search.technologies = $scope.search.technologies.concat($routeParams.platforms.map(function (item) {
          return 'plat.' + item;
        }));
      } else if (typeof $routeParams.platforms === 'string') {
        $scope.search.technologies = $scope.search.technologies.concat($routeParams.platforms.split(',').map(function (item) {
          return 'plat.' + item;
        }));
      }

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
              $scope.challenges = $scope.setPagingData($scope.allChallenges, $scope.page, $scope.pageSize);
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

      function getTechnologies() {
        return $scope.search.technologies.filter(function (item) {
          return item.indexOf('tech.') === 0;
        }).map(function (item) {
          return item.substring(5);
        });
      }

      function getPlaforms() {
        return $scope.search.technologies.filter(function (item) {
          return item.indexOf('plat.') === 0;
        }).map(function (item) {
          return item.substring(5);
        });
      }

      function filterChallenges() {
        $scope.filteredChallenges = $scope.allChallenges.filter(function (contest) {
          if ($scope.search.radioFilterChallenge !== 'all' && $scope.search.radioFilterChallenge !== contest.challengeType) {
            return false;
          }
          if ($scope.search.fSDate && contest.submissionEndDate < $scope.search.fSDate) {
            return false;
          }
          if ($scope.search.fEDate && contest.submissionEndDate > $scope.search.fEDate) {
            return false;
          }
          if ($scope.search.technologies.length > 0) {
            var plats = getPlaforms();
            var techs = getTechnologies();
            if (plats.length > 0 && _.intersection(contest.platforms, plats).length === 0) {
              return false;
            }
            if (techs.length > 0 && _.intersection(contest.technologies, techs).length === 0) {
              return false;
            }
          }
          return true;
        });

        $scope.challenges = $scope.setPagingData($scope.filteredChallenges, $scope.page, $scope.pageSize);
        $scope.search.show = false;
      }

      $scope.findByTechnology = function (tech) {
        $scope.search.technologies = ['tech.' + tech];
        $scope.submit();
      };

      $scope.findByPlatform = function (plat) {
        scope.search.technologies = ['plat.' + plat];
        $scope.submit();
      };

      $scope.submit = function () {
        var plats = getPlaforms();
        var techs = getTechnologies();
        var search = {};
        if($scope.search.fSDate) {
          search.fSDate = $scope.search.fSDate;
        }
        if($scope.search.fEDate) {
          search.fEDate = $scope.search.fEDate;
        }
        if(plats.length > 0) {
          search.platforms = plats;
        }
        if(techs.length > 0) {
          search.technologies = techs;
        }
        $location.search(search);
      };

      DataService.one('technologies').get().then(function (data) {
        if (data) {
          $scope.search.allTechnologies = data.technologies;
        }
      });
      
      DataService.one('platforms').get().then(function(data) {
        if(data) {
          $scope.search.allPlatforms = data.platforms;
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
