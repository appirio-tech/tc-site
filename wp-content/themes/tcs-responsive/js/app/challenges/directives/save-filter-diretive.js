/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author ecnu_haozi
 * @version 1.0
 *
 * This directive save filters on server.
 */

/*jslint nomen: true*/
/*global angular: true, _: true */

(function(angular) {
  'use strict';
  angular.module('tc.AdvancedSearch').directive('saveFilter', saveFilter);
  /**
   * This function defines "save-filters" directive.
   * @return the directive definition object.
   */
  function saveFilter() {

    SaveFiltersCtrl.$inject = ['$scope', 'MyFiltersService', '$location', '$routeParams'];

    return {
      restrict: 'EA',
      require: '^advancedSearch',
      templateUrl: 'save-filter.html',
      controller: SaveFiltersCtrl,
      controllerAs: 'saveFilterCtrl'
    };
    /**
     * The controller of "save-filters" directive. It proivides the following methods.
     * <ul>
     * <li>closeDialogAndClear() to close the save-filter-dialog and clear the candidate filter's name.</li>
     * <li>openDialog() to open the save-filter-dialog.</li>
     * <li>saveFilter() to save the filter which is currently used.</li>
     * </ul>
     * @param $scope the injected scope.
     * @param MyFiltersService the service for "my filters" feature.
     * @param $location the injected location service used to get current filter.
     */
    function SaveFiltersCtrl($scope, MyFiltersService, $location, $routeParams) {
      var ctrl = this;
      //Hide the dialog at first.
      ctrl.dialog = false;
      //The name of the filter to save.
      ctrl.name = '';

      ctrl.closeDialogAndClear = closeDialogAndClear;

      ctrl.openDialog = openDialog;

      ctrl.saveFilter = saveFilter;

      /**
       * Close the save-filter-dialog and clear the candidate filter's name.
       */
      function closeDialogAndClear() {
        ctrl.dialog = false;
        ctrl.name = '';
        $scope.saveForm.searchSaveTxt.$setPristine();
      };
      /**
       * Open the save-filter-dialog.
       */
      function openDialog($event) {
        if (!ctrl.dialog) {
          ctrl.dialog = true;
          $event.stopPropagation();
        }
      };
      /**
       * Save the filter which the user currently use on server. A modal will pop up to notify the operation succeeded
       * or failed.
       * If the filter's name is the same as one of the existing filters, the filter will be updated. Otherwise, the
       * filter will be concerned as a new filter and added into the server.
       */
      function saveFilter() {
        if ($routeParams.challengeStatus == 'past' && !$location.search().startDate) {
          var ob = $location.search();
          var month = moment().month() + 1 + '';
          month = month.length < 2 ? '0' + month : month;
          var year = moment().year() - 1;
          var startDate = year + '-' + month + '-01';
          ob.startDate = startDate;
          $location.search(ob);
        }
         
        //console.log($scope.saveForm.searchSaveTxt);
        if (!$scope.saveForm.searchSaveTxt.$error.required) {
          var filter = makeFilterObject();

          MyFiltersService.readFilterByName(ctrl.name).then(function(data) {
            if (data.length === 0) {
              MyFiltersService.createFilter(filter).then(function(data) {
                MyFiltersService.showConfirm();
                $scope.setMyFiltersListDirty(data);
              }, function(error) {
                MyFiltersService.showError('An error occured when saving new filter on server.', error);
              });
            } else {
              MyFiltersService.updateFilter(data[0]._id, filter).then(function(data) {
                MyFiltersService.showConfirm();
                $scope.setMyFiltersListDirty(data);
              }, function(error) {
                MyFiltersService.showError('An error occured when updating filters on server.', error);
              });
            }
          }, function(error) {
            MyFiltersService.showError('An error occured when retrieving filters from server.', error);
          });
          ctrl.closeDialogAndClear();
        } else {
          //This will set its value as an empty string, and thus the data is both modified(dirty) and invalid.
          //Then the red warning will be triggered. 
          $scope.saveForm.searchSaveTxt.$setViewValue('');
        }
      };
      /**
       * Construct a filter object which conform with the API.
       * @return the filter object which conform with the API.
       */
      function makeFilterObject() {
        return {
          name: ctrl.name,
          filter: MyFiltersService.encode($location.search()),
          type: MyFiltersService.getCurrentTrack()
        }
      };
    }
  }
}(angular));
