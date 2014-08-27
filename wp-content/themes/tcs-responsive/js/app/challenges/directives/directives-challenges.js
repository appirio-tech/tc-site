(function (angular, React) {
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
        controller: ['$scope',
          function ($scope) {
            var ctrl = this;
            $scope.setListType = function (type) {
              $scope.contest.listType = type;
            };
            $scope.isActive = function (type) {
              return $scope.contest.listType === type;
            };
          }]
      };
    }]);

  // removed 'tcContestGrid' and replaced it with this: tcContestGridReact for react implementation
  // also removed templates used by 'tcContestGrid' in favor of 'challenge-grid-view-compiled.js' which contains the template for react
  directivesModule.directive('tcContestGridReact', ['$filter', 'TemplateService',
    function ($filter, TemplateService) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          scope.$watch('challenges', function (newValue, oldValue) {
            if (scope.challenges.length) {
              React.renderComponent(
                window.ChallengeGridAll({
                  scope: scope
                }),
                element[0]
              );
            }
          });
        },
        controller: ['$scope',
          function ($scope) {
            // expose filters to scope for React
            $scope.dateFormatFilter = function (time, formatString) {
              //some function is passing in undefined timezone_string variable causing js errors, so check if undefined and set default:
              if (typeof timezone_string === 'undefined') {
                var timezone_string = "America/New_York"; // let's set to TC timezone
              }
              //using moment we can retrieve correct timezone, we can't do this with the default angularjs's date filter.
              var date = moment(time).tz(timezone_string).format(formatString);
              return date;
            };

            $scope.currencyFilter = $filter('currency');
            $scope.getContestDuration = TemplateService.getContestDuration;
          }]
      };
    }]);

  directivesModule.directive('challengePopoverPopup', ['TemplateService', '$compile',
    function (TemplateService, $compile) {

      return {
        restrict: 'EA',
        replace: true,
        scope: {
          title: '@',
          content: '@',
          placement: '@',
          animation: '&',
          isOpen: '&'
        },
        templateUrl: 'tooltip.html'
      };
    }]);

  directivesModule.directive('challengePopover', ['$tooltip',
    function ($tooltip) {
      return $tooltip('challengePopover', 'challengePopover', 'mouseenter');
    }]);

  directivesModule.directive('qtip', function () {
    return {
      link: function (scope, element, attrs) {
        element.qtip({
          overwrite: true,
          prerender: false,
          content: {
            text: attrs.text,
            title: attrs.title
          },
          style: {
            classes: 'qtip-' + attrs.community + ' qtip-rounded qtip-shadow'
          },
          position: {
            my: attrs.my || 'bottom center',
            at: attrs.at || 'top center ',
            adjust: {
              y: -12
            }
          }
        });

        scope.$on("$destroy", function () {
          element.qtip('destroy', true);
        });
      }
    };
  });


}(window.angular, window.React));