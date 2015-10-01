/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author ecnu_haozi
 * @version 1.0
 *
 * This directive set up a list of user saved filters on page. This directive allows the user to read those filters, to
 * search on them, and to remove them.
 */
/*jslint nomen: true*/
/*global angular: true, _: true */
(function(angular) {
  'use strict';
  angular.module('tc.AdvancedSearch').directive('myFilters', myFilters);

  /**
   * This function defines "my-filters" directive. This directive render a list on page to show users' saved filters.
   * @return the directive definition object.
   */
  function myFilters() {

    MyFiltersCtrl.$inject = ['$scope', 'MyFiltersService'];

    return {
      restrict: 'EA',
      require: '^advancedSearch',
      templateUrl: 'my-filters.html',
      controller: MyFiltersCtrl,
      controllerAs: 'myFiltersCtrl'
    };
    /**
     * The controller of "my-filters" directive. It does some initial loigic and proivides the following methods.
     * <ul>
     * <li>dateRange(filter) to format date information for a filter.</li>
     * <li>deleteFilter(filter) to delete a filter.</li>
     * <li>populateList() to retrieve the user saved filters.</li>
     * <li>updateFilterOptions(filter) to search according to filter.</li>
     * </ul>
     * @param $scope the injected scope.
     * @param MyFiltersService the service for "my filters" feature.
     */
    function MyFiltersCtrl($scope, MyFiltersService) {
      var ctrl = this;

      ctrl.dateRange = dateRange;

      ctrl.deleteFilter = deleteFilter;

      ctrl.populateList = populateList;

      ctrl.updateFilterOptions = updateFilterOptions;

      //Only populate data if the user logged in.
      if ($scope.authenticated) {
        ctrl.populateList();
      }
      //Watch if the list of "my filters" needs to update. 
      $scope.$watch('myFiltersListDirty', function(value) {
        if (value) {
          //console.log(value);
          var filter = $scope.getMyFiltersListDirty();
          $scope.setMyFiltersListDirty(undefined);
          initFilterObject(filter);
          for(var i = ctrl.filters.length - 1; i >= 0; i--){
            if(ctrl.filters[i].name === filter.name){
              //This is an update.
              ctrl.filters[i] = filter;
              break;
            }
          }
          if(i < 0) {
            //This is a create.
            ctrl.filters.push(filter);
          }
        }
      });
      /**
       * Format a date range string for the given filter.
       * @param filter the filter whose date information needs to format.
       * @return the formatted date range string.
       */
      function dateRange(filter) {
        var ret = '';
        if (filter.filterOptions.startDate) {
          ret += 'From ' + $scope.formatDate(filter.filterOptions.startDate);
          if (filter.filterOptions.endDate) {
            ret += ' to ' + $scope.formatDate(filter.filterOptions.endDate);
          }
        } else {
          if (filter.filterOptions.endDate) {
            ret += 'To ' + $scope.formatDate(filter.filterOptions.endDate);
          }
        }
        return ret;
      };
      /**
       * This function delete the filter. It will delete it on both client and server side. If the server side is not
       * able to delete, the client side will be reverted to the state before deletion.
       * @param filter the filter to delete.
       */
      function deleteFilter(target) {
        //Simply ignore the filter if there is a DELETE operation on this filter not long ago.
        if (!target.deleted) {
          //Remove it on client side first.
          target.deleted = true;
          ctrl.filters = $.grep(ctrl.filters, function(filter) {
            return filter.id !== target.id;
          });
          //Remove it on server side.
          MyFiltersService.deleteFilter(target.id).then(function() {
            //Silent.
          }, function(error) {
            //Failed to delete, push back the target.
            target.deleted = false;
            ctrl.filters.push(target);
            MyFiltersService.showError('An error occurs when deleting filters on server.', error);

          });
        }
      };
      /**
       * Wrap the filter object from the server with some information.
       * @param filterObject the raw filter object recieved from the server.
       */
      function initFilterObject(filterObject) {
        //Transform the url param to javascript object.
        filterObject.filterOptions = MyFiltersService.decode(filterObject.filter);
        //To prevent operations after a deleting filter. If it's set to true, then all operations are ignored.
        filterObject.deleted = false;
        //console.log(value);
      }
      /**
       * Retrieve the user saved filters for remote api server. The returned data is stored in ctrl.filters(ctrl is the
       * controller of directive 'my-filters').
       * Only the filters under current track are shown.
       */
      function populateList() {
        //Retrieve my filters from 0 to 1000.
        MyFiltersService.readFilters(0, 1000).then(function(data) {
          ctrl.filters = data;

          //Don't show filters not under current track.
          var track = MyFiltersService.getCurrentTrack();
          ctrl.filters = $.grep(ctrl.filters, function(filter) {
            return filter.type === track;
          });

          $.each(ctrl.filters, function(index, value) {
            initFilterObject(value);
          });
        }, function(error) {
          ctrl.filters = [];
          //MyFiltersService.showError('An error occurs when retrieving filters from server.', error);
        });
      };
      /**
       * This function search according to the filter.
       * @param filter the filter to search.
       */
      function updateFilterOptions(filter) {
        //Simply ignore the filter if there is a DELETE operation on this filter not long ago.
        if (!filter.deleted) {
          $scope.setFilterOptions(filter.filterOptions);
          $scope.applyFilter();
        }
      };
    }
  }
}(angular));
