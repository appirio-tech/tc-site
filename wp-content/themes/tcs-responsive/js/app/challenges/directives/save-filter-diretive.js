/*jslint nomen: true*/
/*global angular: true, _: true */

(function (angular) {
  'use strict';
  angular.module('tc.AdvancedSearch').directive('saveFilter', saveFilter);

  function saveFilter() {

    SaveFiltersCtrl.$inject = ['$scope', 'MyFiltersService'];
 
    return {
      restrict: 'EA',
      require: '^advancedSearch',
      templateUrl: 'save-filter.html',
      controller: SaveFiltersCtrl,
      controllerAs: 'saveFilterCtrl',
      link: postLink
    };

    function postLink(scope, element, attrs, advancedSearchCtrl) {
    }

    function SaveFiltersCtrl($scope, MyFiltersService){
      var ctrl = this;
      //hide the dialog at first.
      ctrl.dialog = false;
    }
  }
}(angular));
