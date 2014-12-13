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
      controllerAs: 'myFiltersCtrl'
    };

    function MyFiltersCtrl($scope, MyFiltersService){
      var ctrl = this;
      
      ctrl.deleteFilter = deleteFilter;

      ctrl.populateList = populateList;

      ctrl.updateFilterOptions = updateFilterOptions;
      
      //only populate data if the user logged in.
      if($scope.authenticated){
        ctrl.populateList();  
      }
      
      $scope.$watch('myFiltersListDirty', function(value){
        if(value){
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
            //To prevent operations after a deleting filter. If it's set to true, then all operations are ignored.
            value.deleted = false;
            console.log(value);
          });
        }, function(error){
          ctrl.filters = [];
          MyFiltersService.showError('An error occurs when retrieving filters from server.', error);
        });
      }

      function deleteFilter(target){
        if(target.deleted){
          //There is a DELETE operation on this filter not long ago.
          return ;
        }
        //remove it on client side first.
        target.deleted = true;
        ctrl.filters = $.grep(ctrl.filters, function(filter){
          return filter.id !== target.id;
        });
        //remove it on server side.
        MyFiltersService.deleteFilter(target.id).then(function(){
          //silent.
        },function(error){
          //Failed to delete, push back the target.
          target.deleted = false;
          ctrl.filters.push(target);
          MyFiltersService.showError('An error occurs when deleting filters on server.', error);
          
        });
      }

      function updateFilterOptions(filter){
        if(filter.deleted){
          //There is a DELETE operation on this filter not long ago.
          return ;
        }
        $scope.setFilterOptions(filter.filterOptions);
        $scope.applyFilter();
      }
    }
  }
}(angular));
