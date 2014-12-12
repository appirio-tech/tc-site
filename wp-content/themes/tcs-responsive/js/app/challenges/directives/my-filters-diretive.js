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

      ctrl.populateList = populateList;

      ctrl.updateFilterOptions = updateFilterOptions;

      ctrl.populateList();

      $scope.$watch('myFiltersListDirty', function(newValue, oldvalue){
        if(oldvalue != newValue && newValue == true){
          $scope.setMyFiltersListDirty(false);
          ctrl.populateList();
        }
      });

      function populateList(){
        //retrieve my filters from 0 to 1000.
        MyFiltersService.readFilters(0, 1000).then(function(data){
          ctrl.filters = data;

          $.each(ctrl.filters, function(index, value){
            //transform the url param to javascript object.
            value.filterOptions = MyFiltersService.decode(value.filter);
            //Sometimes the saved filter's track is different with the current one's.(e.g. develop and design)
            value.filterOptions['contestType'] = value.type;
            console.log(value);
          });
        }, function(error){
          ctrl.filters = [];
          MyFiltersService.showError('Error occurs when retrieving filters from server.', error);
        });
      }

      function deleteFilter(target){
        
        //removing the filter on client side can prevent pressing operations on a deleting filter, e.g. searching or
        //deleting again.
        ctrl.filters = $.grep(ctrl.filters, function(filter){
          return filter.id !== target.id;
        });
        
        MyFiltersService.deleteFilter(target.id).then(function(){
          //silent.
        },function(error){
          //Failed to delete, push back the target.
          ctrl.filters.push(target);
          MyFiltersService.showError('Error occurs when deleting filters on server.', error);
          
        });
      }

      function updateFilterOptions(filter){
        $scope.setFilterOptions(filter.filterOptions);
        $scope.applyFilter();
      }
    }
  }
}(angular));
