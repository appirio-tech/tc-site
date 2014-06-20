/*global angular: true*/
(function () {
  'use strict';
  var directivesModule = angular.module('tc.challenges.directives', ['ui.bootstrap']);
  directivesModule.directive('tcChallengesActions', ['$location', 'TemplateService',
      function ($location, TemplateService) {
      return {
        restrict: 'A',
        scope: {
          contest: '=',
          showFilters: '='
        },
        templateUrl: 'actions.html',
        controller: function ($scope) {
          var ctrl = this;

          $scope.setListType = function (type) {
            $scope.contest.listType = type;
          };
          $scope.isActive = function (type) {
            return $scope.contest.listType === type;
          };

        }
      };
    }]);
  directivesModule.directive('tcContestGrid', ['TemplateService',
    function (TemplateService) {
      return {
        restrict: 'A',
        replace: true,
        /*scope: {
          challenge: '=',
          contest: '='
        },*/
        link: function (scope, element, attrs) {
          scope.getContentUrl = function () {
            if (!scope.contest.contestType || scope.contest.contestType === '') {
              return 'gridView/all.html';
            } else {
              return 'gridView/' + scope.contest.contestType + '-' + scope.contest.listType + '.html';
            }
          };

        },
        template: '<div ng-include="getContentUrl()"></div>',
        //templateUrl: TemplateService.challengesBase + '/partials/gridView/all.html',
        controller: function ($scope) {
          $scope.formatTimeLeft = TemplateService.formatTimeLeft;
          $scope.images = TemplateService.image('');
          $scope.getContestDuration = TemplateService.getContestDuration;
        }
      };
    }]);

  directivesModule.directive( 'challengePopoverPopup', ['TemplateService', '$compile',
    function (TemplateService, $compile) {

      return {
        restrict: 'EA',
        replace: true,
        scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
        templateUrl: 'tooltip.html'
      };
  }]);

  directivesModule.directive( 'challengePopover', [ '$tooltip', function ( $tooltip ) {
      return $tooltip( 'challengePopover', 'challengePopover', 'mouseenter' );
    }]);
}(angular));
