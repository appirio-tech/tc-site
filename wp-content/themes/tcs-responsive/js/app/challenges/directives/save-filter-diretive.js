/*jslint nomen: true*/
/*global angular: true, _: true */

(function (angular) {
  'use strict';
  angular.module('tc.AdvancedSearch').directive('saveFilter', saveFilter);

  function saveFilter() {

    SaveFiltersCtrl.$inject = ['$scope', 'MyFiltersService', '$location'];
 
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

    function SaveFiltersCtrl($scope, MyFiltersService, $location){
      var ctrl = this;
      //hide the dialog at first.
      ctrl.dialog = false;

      ctrl.name = '';

      ctrl.saveFilter = saveFilter;

      function saveFilter(){
        var filter = makeFilterObject();
        
        MyFiltersService.readFilterByName(ctrl.name).then(function(data){
          if(data.length === 0){
            MyFiltersService.createFilter(filter).then(function(){
              MyFiltersService.showConfirm();
              $scope.setMyFiltersListDirty(true);
            }, function(error){
              MyFiltersService.showError('An error occurs when creating new filter on server.', error);
            });
          }else{
            MyFiltersService.updateFilter(data[0]._id, filter).then(function(){
              MyFiltersService.showConfirm();
              $scope.setMyFiltersListDirty(true);
            }, function(error){
              MyFiltersService.showError('An error occurs when updating filters on server.', error);
            });
          }
        },function(error){
          MyFiltersService.showError('An error occurs when retrieving filters from server.', error);
        });

        ctrl.dialog = false;
        ctrl.name = '';
      }

      function makeFilterObject(){
        return {
          name : ctrl.name,
          filter : MyFiltersService.encode($location.search()),
          type : $location.path().match(/\/([A-z]+)\//)[1]
        }
      }
    }
  }
}(angular));
