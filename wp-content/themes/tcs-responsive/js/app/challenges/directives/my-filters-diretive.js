/*jslint nomen: true*/
/*global angular: true, _: true */

(function (angular) {
  'use strict';
  angular.module('tc.AdvancedSearch').directive('myFilters', myFilters);

  function myFilters() {

    MyFiltersCtrl.$inject = ['$scope', 'MyFiltersService'];
 
    return {
      restrict: 'EA',
      require: '^advancedSearch',
      templateUrl: 'my-filters.html',
      controller: MyFiltersCtrl,
      controllerAs: 'myFiltersCtrl',
      link: postLink
    };

    function postLink(scope, element, attrs, advancedSearchCtrl) {
    }

    function MyFiltersCtrl($scope, MyFiltersService){
      var ctrl = this;
      
      ctrl.deleteFilter = deleteFilter;

      ctrl.updateFilterOptions = updateFilterOptions;

      //retrieve my filters from 0 to 1000.
      MyFiltersService.readFilters(0, 1000).then(function(data){
        ctrl.filters = data;

        $.each(ctrl.filters, function(index, value){
          //transform the url param to javascript object.
          value.filterOptions = MyFiltersService.decode(value.filter);
          //Sometimes the saved filter's track is different with the current one's.(e.g. develop and design)
          value.filterOptions['contestType'] = value.type;
        });
      }, function(error){
        ctrl.filters = [];
      });

      function deleteFilter(id){
        MyFiltersService.deleteFilter(id).then(function(){
          //keep consistent, remove the filter in client-side model.
          ctrl.filters = $.grep(ctrl.filters, function(filter){
            return filter.id !== id;
          });
        });
      }

      function updateFilterOptions(filter){
        $scope.setFilterOptions(filter.filterOptions);
        $scope.applyFilter();
      }
    }
  }
}(angular));
