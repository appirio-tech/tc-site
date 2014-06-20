angular.module('tc.AdvancedSearch', ['ui.bootstrap']).directive('advancedSearch', ['$compile', function($compile) {
  'use strict';
  var developTypes = [
    'All',
    'Component Development',
    'Architecture',
    'First2Finish',
    'Assembly Competition',
    'Reporting',
    'Bug Hunt',
    'RIA Build Competition',
    'Code',
    'Specification',
    'Copilot Posting',
    'Test Scenarios',
    'Conceptualization',
    'Test Suites',
    'Content Creation',
    'Testing Competition',
    'Component Design',
    'UI Prototype Competition'
  ];
  var designTypes = [
    'All',
    'Logo Design',
    'Application Front End',
    'Print/Presentation',
    'Banner/Icon',
    'Web Design',
    'Design First2Finish',
    'Widget/Mobile Screen',
    'Idea Generation',
    'Wireframe'
  ];

  return {
    replace: true,
    //transclude: false,
    templateUrl:'advanced-search.html',
    //templateUrl: '/wp-content/themes/tcs-responsive/js/app/challenges/partials/advanced-search.html',
    scope: {
      applyFilterHandler: '=applyFilter',
      challengeCommunity: '=challengeCommunity',
      searchBarVisible: '=showOn',
      technologies: '=technologies',
      platforms: '=platforms',
      actualFilter: '=filter'
    },

    controller: function($scope){
      $scope.chbFrom = false;
      $scope.chbTo = false;
      var initOptions = {
        challengeType: 'All',
        searchText: '',
        startDate: null,
        endDate: null,
        tags: []
      };
  

      $scope.resetFilterOptions = function(){
        $scope.filterOptions = angular.extend({}, initOptions);
        
        var contestTypes = [];
        switch ($scope.challengeCommunity) {
          case 'develop':
            contestTypes = developTypes.slice(0);
            break;
          case 'design':
            contestTypes = designTypes.slice(0);
            break;
          default :
            contestTypes = [];
            break;
        }
        $scope.contestTypes = contestTypes;
      };
      
      $scope.resetFilterOptions();
      
      if($scope.actualFilter) {
        $scope.filterOptions = angular.extend($scope.filterOptions, $scope.actualFilter);
        if(!$scope.filterOptions || $scope.filterOptions.challengeType === '') {
          $scope.filterOptions.challengeType = 'All';
        }
        if($scope.filterOptions.startDate) {
          $scope.chbFrom = true;
        }
        if($scope.filterOptions.endDate) {
          $scope.chbTo = true;
        }
        delete $scope.filterOptions.technologies;
        delete $scope.filterOptions.platforms;
        $scope.filterOptions.tags = $scope.actualFilter.technologies.map(function(tech) {
          return 'tech.' + tech;
        });
        $scope.filterOptions.tags =$scope.filterOptions.tags.concat($scope.actualFilter.platforms.map(function(plat) {
          return 'plat.' + plat;
        }));
      }


    },
    compile: function (tElement, tAttrs, transclude) {

      return function ($scope, $element, attr) {

        $scope.closeForm = function () {
          $($element).hide(200);
          $scope.searchBarVisible = false;
        };

        $scope.applyFilter = function () {
          var filterOptions = _.clone($scope.filterOptions);
          
          filterOptions.technologies = filterOptions.tags.filter(function (item) {
            return item.indexOf('tech.') === 0;
          }).map(function (item) {
            return item.substring(5);
          });
          filterOptions.platforms = filterOptions.tags.filter(function (item) {
            return item.indexOf('plat.') === 0;
          }).map(function (item) {
            return item.substring(5);
          });
          delete filterOptions.tags;
          
          $scope.applyFilterHandler(filterOptions);
        };
        $scope.$watch('searchBarVisible', function (newVal, oldVal) {
          newVal && $($element).show(200);
          //$scope.resetFilterOptions();
        }, true);
        var
        $datepickerFrom = $element.find('.datepicker.from'),
            $datepickerTo = $element.find(".datepicker.to");

        $datepickerFrom.datepicker({
          showOn: 'both',
          buttonImage: $datepickerFrom.attr('calendar-icon'),
          buttonImageOnly: true,
          dateFormat: 'yy-mm-dd',
          buttonText: "",

          onSelect: function(selectedDate) {
            $datepickerTo.datepicker("option", "minDate", selectedDate);
            $scope.filterOptions.startDate = new Date(Date.parse(selectedDate));
            $scope.$apply();
          }
        });

        $datepickerTo.datepicker({
          showOn: 'both',
          buttonImage: $datepickerTo.attr('calendar-icon'),
          buttonImageOnly: true,
          dateFormat: 'yy-mm-dd',
          onSelect: function(selectedDate) {
            $datepickerFrom.datepicker("option", "maxDate", selectedDate);
            $scope.filterOptions.endDate = new Date(Date.parse(selectedDate));
            $scope.$apply();
          }
        });

        $scope.$watch('chbFrom', function (newVal, oldVal) {
          if(!newVal){
            $scope.filterOptions.startDate = null;
          }
          $datepickerFrom.datepicker(newVal? 'enable':'disable');
        }, true);

        $scope.$watch('chbTo', function (newVal, oldVal) {
          if(!newVal){
            $scope.filterOptions.endDate = null;
          }
          $datepickerTo.datepicker(newVal? 'enable':'disable');
        }, true);

        //$compile($element.contents())($scope);
        //$compile($element)($scope);
      };
    }

  };
}]);