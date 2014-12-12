/*jslint nomen: true*/
/*global angular: true, _: true */
/**
 * Changelog
 * 09/17/2014 Add My Challenges Filter and Improve Filters
 * - Added dates presets for active/upcoming challenges
*/
(function (angular) {
  'use strict';
  angular.module('tc.AdvancedSearch', ['ui.bootstrap']).directive('advancedSearch', ['$compile', '$timeout', 'ChallengesService', function ($compile, $timeout, ChallengesService) {
    return {
      replace: true,
      //transclude: false,
      templateUrl: 'advanced-search.html',
      //templateUrl: '/wp-content/themes/tcs-responsive/js/app/challenges/partials/advanced-search.html',
      scope: {
        applyFilterHandler: '=applyFilter',
        challengeCommunity: '=challengeCommunity',
        challengeStatus: '=challengeStatus',
        searchBarVisible: '=showOn',
        technologies: '=technologies',
        platforms: '=platforms',
        actualFilter: '=filter',
        authenticated: '=authenticated'
      },

      controller: ['$scope', function ($scope) {
        $scope.chbFrom = false;
        $scope.chbTo = false;
        var initOptions = {
          challengeTypes: [],
          startDate: undefined,
          endDate: undefined,
          technologies: [],
          platforms: [],
          keywords: [],
          userChallenges: false
        };
        
        $scope.tempOptions = {
          challengeType: undefined,
          technology: undefined,
          platform: undefined,
          text: undefined
        };
        
        $scope.contestTypes = {};
        
        function getChallengeTypes(community) {
          ChallengesService.getChallengeTypes(community).then(function (data) {
            _.each(data, function (type) {
              $scope.contestTypes[type.description] = type.name;
            });
          });
        }
        
        
        
        this.datePicker = undefined;
        this.selects = [];
        this.closeDropdowns = function (element) {
          _.each(this.selects, function (s) {
            if (s !== element) {
              angular.element(s).select2('close');
            }
          });
          if (this.datePicker !== element) {
            angular.element(this.datePicker).hide();
          }
        };

        $scope.getFilterOptions = getFilterOptions;
        $scope.setFilterOptions = setFilterOptions;

        $scope.myFiltersListDirty = false;
        $scope.setMyFiltersListDirty = setMyFiltersListDirty;
        $scope.isMyFiltersListDirty = isMyFiltersListDirty;

        function setMyFiltersListDirty(dirty){
          $scope.myFiltersListDirty = dirty;
        }

        function isMyFiltersListDirty(){
          return  $scope.myFiltersListDirty;
        }
        function getFilterOptions(){
          return $scope.filterOptions;
        }

        function setFilterOptions(filterOptions){
          $scope.filterOptions = filterOptions;
        }

        $scope.resetFilterOptions = function () {
          $scope.filterOptions = angular.extend({}, initOptions);
        };
        
        $scope.formatDate = function (date) {
          if (!date) {
            return '';
          }
          return window.moment(date).format("MMM D, YYYY");
        };
        

        /**
         * Clears date filter
         */
        $scope.clearDates = function () {
          $scope.filterOptions.startDate = null;
          $scope.filterOptions.endDate = null;
          $scope.applyFilter();
        };

        /**
         * Adds a filter criteria on technology tag
         * @param {string} tech - the technology tag
         */
        $scope.addTechnology = function (tech) {
          if (!tech || tech === '') {
            return;
          }
          $scope.filterOptions.technologies.push(tech);
          $timeout(function () {
            $scope.tempOptions.technology = undefined;
            $scope.applyFilter();
          }); // Timeout to let time to select2 to handle selection
          
        };

        /**
         * Adds a filter criteria on platform tag
         * @param {string} plat - the platform tag
         */
        $scope.addPlatform = function (plat) {
          if (!plat || plat === '') {
            return;
          }
          $scope.filterOptions.platforms.push(plat);
          $timeout(function () {
            $scope.tempOptions.platform = undefined;
            $scope.applyFilter();
          });
          
        };

        /**
         * Adds a filter criteria on challenge type
         * @param {string} ch - the challenge type
         */
        $scope.addChallengeType = function (ch) {
          if (!ch || ch === '') {
            return;
          }
          $scope.filterOptions.challengeTypes.push(ch);
          $timeout(function () {
            $scope.tempOptions.challengeType = undefined;
            $scope.applyFilter();
          });
        };

        /**
         * Adds a filter criteria on keyword in challenge name
         * @param {string} text - the keyword
         */
        $scope.addKeywords = function (text) {
          if (!text || text.match(/^\s*$/)) {
            return;
          }
          $scope.tempOptions.text = undefined;
          if ($scope.filterOptions.keywords.indexOf(text) === -1) {
            //Past api does not handle multiple keywords
            if ($scope.challengeStatus === 'past') {
              $scope.filterOptions.keywords = [text];
            } else {
              $scope.filterOptions.keywords.push(text);
            }
            $scope.applyFilter();
          }
        };

        /**
         * Removes a technology filter criteria
         * @param {string} tech - the technology tag
         */
        $scope.removeTechnology = function (tech) {
          $scope.filterOptions.technologies.splice($scope.filterOptions.technologies.indexOf(tech), 1);
          $scope.applyFilter();
        };

        /**
         * Removes a platform filter criteria
         * @param {string} plat - the platform tag
         */
        $scope.removePlatform = function (plat) {
          $scope.filterOptions.platforms.splice($scope.filterOptions.platforms.indexOf(plat), 1);
          $scope.applyFilter();
        };

        /**
         * Removes a ChallengeType filter criteria
         * @param {string} ch - the ChallengeType
         */
        $scope.removeChallengeType = function (ch) {
          $scope.filterOptions.challengeTypes.splice($scope.filterOptions.challengeTypes.indexOf(ch), 1);
          $scope.applyFilter();
        };

        /**
         * Removes a keyword filter criteria
         * @param {string} keyword - the keyword
         */
        $scope.removeKeyword = function (keyword) {
          $scope.filterOptions.keywords.splice($scope.filterOptions.keywords.indexOf(keyword), 1);
          $scope.applyFilter();
        };
        
        /**
          * Resets the filters
          */
        $scope.reset = function () {
          var lastUserOption = $scope.filterOptions.userChallenges;
          $scope.filterOptions = angular.extend({}, initOptions);
          $scope.filterOptions.userChallenges = lastUserOption;
          $scope.applyFilter();
        };
        
        /**
         * Tests if there is a least one filter applied
         */
        $scope.hasFilters = function () {
          var f = $scope.filterOptions;
          return f.startDate || f.endDate || f.technologies.length > 0 || f.platforms.length > 0 || f.challengeTypes.length > 0 || f.keywords.length > 0;
        };
        
        getChallengeTypes($scope.challengeCommunity);

        $scope.resetFilterOptions();

        if ($scope.actualFilter) {
          $scope.filterOptions = angular.extend($scope.filterOptions, $scope.actualFilter);
        }
        
      }],
      compile: function (tElement, tAttrs, transclude) {

        return function ($scope, $element, attr) {

          $scope.closeForm = function () {
            $element.hide(200);
            $scope.searchBarVisible = false;
          };

          $scope.applyFilter = function () {
            var filterOptions = _.clone($scope.filterOptions);
            $scope.applyFilterHandler(filterOptions);
          };
          
          $scope.$on('$locationChangeSuccess', function (event) {
            $timeout(function () {
              if ($scope.actualFilter) {
                $scope.filterOptions = angular.extend({}, $scope.actualFilter);
              }
            });
          });

        };
      }

    };
  }])
  
  /**
   * Date picker directive
   * with 2 pickers, from and to bounds
   */
  .directive('tcDatePicker', function () {
    var moment = window.moment;
    return {
      restrict: 'A',
      require: '^advancedSearch',
      controller: function($scope) {
        var dateCtrl = this;
        dateCtrl.today = function() {
          $scope.filterOptions.startDate = new Date();
          $scope.filterOptions.endDate = $scope.filterOptions.startDate;
          $scope.applyFilterHandler($scope.filterOptions);
        };
        dateCtrl.yesterday = function() {
          $scope.filterOptions.startDate = moment().subtract('days', 1).toDate();
          $scope.filterOptions.endDate = $scope.filterOptions.startDate;
          $scope.applyFilterHandler($scope.filterOptions);
        };
        dateCtrl.tomorrow = function() {
          $scope.filterOptions.startDate = moment().add('days', 1).toDate();
          $scope.filterOptions.endDate = $scope.filterOptions.startDate;
          $scope.applyFilterHandler($scope.filterOptions);
        };
        dateCtrl.last7Days = function() {
          $scope.filterOptions.endDate = new Date();
          $scope.filterOptions.startDate = moment().subtract('days', 7).toDate();
          $scope.applyFilterHandler($scope.filterOptions);
        };
        dateCtrl.next7Days = function() {
          $scope.filterOptions.startDate = new Date();
          $scope.filterOptions.endDate = moment().add('days', 7).toDate();
          $scope.applyFilterHandler($scope.filterOptions);
        };
        dateCtrl.pastThisMonth = function() {
          $scope.filterOptions.startDate = moment().startOf('month').toDate();
          $scope.filterOptions.endDate = new Date();
          $scope.applyFilterHandler($scope.filterOptions);
        };
        dateCtrl.thisMonth = function() {
          $scope.filterOptions.startDate = new Date();
          $scope.filterOptions.endDate = moment().endOf('month').toDate();
          $scope.applyFilterHandler($scope.filterOptions);
        };
        dateCtrl.lastMonth = function() {
          $scope.filterOptions.startDate = moment().subtract('months', 1).startOf('month').toDate();
          $scope.filterOptions.endDate = moment($scope.filterOptions.startDate).endOf('month').toDate();
          $scope.applyFilterHandler($scope.filterOptions);
        };
        dateCtrl.nextMonth = function() {
          $scope.filterOptions.startDate = moment().add('months', 1).startOf('month').toDate();
          $scope.filterOptions.endDate = moment($scope.filterOptions.startDate).endOf('month').toDate();
          $scope.applyFilterHandler($scope.filterOptions);
        };
      },
      controllerAs: 'dateCtrl',
      link: function(scope, element, attrs, advancedSearchCtrl) {
         var from = element.find('.from-datepicker'),
             to = element.find('.to-datepicker');
          from.datepicker({
            onSelect: function (selectedDate) {
              scope.$apply(function () {
                scope.filterOptions.startDate = from.datepicker('getDate');
                scope.applyFilterHandler(scope.filterOptions);
              });
            }
          });
        
        to.datepicker({
            onSelect: function (selectedDate) {
              scope.$apply(function () {
                scope.filterOptions.endDate = to.datepicker('getDate');
                scope.applyFilterHandler(scope.filterOptions);
              });
            }
        });
        // The strategy to place above or below is copied from select2.js source code.
        var positionDropdown = function($dropdown, container) {
          var offset = container.offset(),
              height = container.outerHeight(false),
              dropHeight = $dropdown.outerHeight(false),
              $window = $(window),
              windowHeight = $window.height(),
              viewportBottom = $window.scrollTop() + windowHeight,
              dropTop = offset.top + height,
              enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
              enoughRoomAbove = offset.top - dropHeight >= $window.scrollTop(),
              above,
              css;

          // Default is below, if below is not enough, then show above.
          above = !enoughRoomBelow && enoughRoomAbove;

          css = {bottom : 'auto'};
          if (above) {
              css.top = -dropHeight;
          } else {
              css.top = 'auto';
          }

          $dropdown.css(css);
        };

        var TODAY_OFFSET = 0;
        if (scope.challengeStatus === 'upcoming') {
          from.datepicker('option', 'minDate', TODAY_OFFSET);
          to.datepicker('option', 'minDate', TODAY_OFFSET);
        } else if (scope.challengeStatus === 'past') {
          from.datepicker('option', 'maxDate', TODAY_OFFSET);
          to.datepicker('option', 'maxDate', TODAY_OFFSET);
        }

        var pickers = element.find('.pickers');
        advancedSearchCtrl.datePicker = pickers[0];
        element.hover(function (event) {
          if (event.hasOwnProperty('originalEvent')) {
            advancedSearchCtrl.closeDropdowns(pickers[0]);
            positionDropdown(pickers, element);
            pickers.show();
          }
        });
        element.mouseleave(function (event) {
          if (event.hasOwnProperty('originalEvent')) {
            element.find('.pickers').hide();
          }
        });
        scope.$on('$destroy', function() {
          element.off('hover');
          element.off('mouseleave')
        });
        /*
        The datepicker operations will trigger mouseover event, which means
        the code 'hover' the datepicker automatically.
        See http://bugs.jqueryui.com/ticket/5816
        So we need a way to tell between a programatic and user triggered event.
        See http://stackoverflow.com/questions/6674669/in-jquery-how-can-i-tell-between-a-programatic-and-user-click
         */
        scope.$watch('filterOptions.startDate ? filterOptions.startDate.getTime() : undefined', function(value) {
          var date = value ? (new Date(value)) : undefined;
          from.datepicker('setDate', date);
          if (typeof value === 'undefined' && scope.challengeStatus === 'upcoming') {
            to.datepicker('option', 'minDate', TODAY_OFFSET);
          } else {
            to.datepicker('option', 'minDate', date);
          }
          if (!from.datepicker('getDate')) {
            from.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
          }
          if (!to.datepicker('getDate')) {
            to.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
          }
        });

        scope.$watch('filterOptions.endDate ? filterOptions.endDate.getTime() : undefined', function(value) {
          var date = value ? (new Date(value)) : undefined;
          to.datepicker('setDate', date);
          if (typeof value === 'undefined' && scope.challengeStatus === 'past') {
            from.datepicker('option', 'maxDate', TODAY_OFFSET);
          } else {
            from.datepicker('option', 'maxDate', date);
          }
          if (!from.datepicker('getDate')) {
            from.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
          }
          if (!to.datepicker('getDate')) {
            to.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
          }
        });
      }
    }
  })

  /**
   * Directive that modified the behaviour of ui-select2 directive by enabling opening
   * on hover and closing on ouse leave
   */
  .directive('tcSelect2Hover', ['$timeout', function ($timeout) {
    var selects = [];
    return {
      restrict: 'A',
      scope: true,
      require: '^advancedSearch',
      link: function(scope, element, attrs, advancedSearchCtrl) {
        var select = element.find('select'),
            entered = false;
        advancedSearchCtrl.selects.push(select[0]);
        element.hover(function() {
          advancedSearchCtrl.closeDropdowns(select[0]);
          select.select2('open');
          angular.element('#select2-drop .select2-search input').blur();
          angular.element('#select2-drop').hover(function() {
            entered = true;
          });
          angular.element('#select2-drop').off('mouseleave').mouseleave(function () {
            advancedSearchCtrl.closeDropdowns(null);
            entered = false;
          });
        });
        element.mouseleave(function() {
          $timeout(function() {
            if(!entered) {
              entered = false;
              select.select2('close');
            }
          }, 100);
        });
       
        scope.$on('$destroy', function() {
          element.off('hover');
          angular.element('#select2-drop').off('mouseleave')
        });
      }
    };
  }]);
}(angular));
