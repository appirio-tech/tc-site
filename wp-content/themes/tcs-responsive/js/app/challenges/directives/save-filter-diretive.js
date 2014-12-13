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
      controllerAs: 'saveFilterCtrl'
    };

    function SaveFiltersCtrl($scope, MyFiltersService, $location){
      var ctrl = this;
      //hide the dialog at first.
      ctrl.dialog = false;
      //the saved filter's name
      ctrl.name = '';

      ctrl.closeDialogAndClear = closeDialogAndClear;
      
      ctrl.openDialog = openDialog;

      ctrl.saveFilter = saveFilter;


      function closeDialogAndClear(){
        ctrl.dialog = false;
        ctrl.name = '';
      }

      function openDialog($event){
        if(!ctrl.dialog){
          ctrl.dialog = true;
          $event.stopPropagation();
        }
      }

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

        ctrl.closeDialogAndClear();
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
