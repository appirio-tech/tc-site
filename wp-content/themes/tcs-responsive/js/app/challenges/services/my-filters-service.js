/*global angular*/
/**
 * This service provide CRUD operations for myFilter feature.
 */
(function() {
  'use strict';

  function MyFiltersService(Restangular, $cookies, $q, MY_FILTER_API_URL) {

    var header = {
      'Content-Type': 'application/json'
    };

    var restangular = Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(MY_FILTER_API_URL);
      if ($cookies.tcjwt) {
        RestangularConfigurer.setDefaultHeaders({
          'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")
        });
      }
    });

    var savedSearches = restangular.all('saved-searches');

    var myFiltersService = {
      createFilter: createFilter,
      readFilters: readFilters,
      readFilterByName: readFilterByName,
      readFilterById: readFilterById,
      updateFilter: updateFilter,
      deleteFilter: deleteFilter
    };

    return myFiltersService;

    function createFilter(filter) {
      return savedSearches.post(filter, undefined, header);
    }

    function readFilters(offset, limit){
      return savedSearches.getList({offset : offset, limit : limit}, header);
    }

    function readFilterByName(name){
      return savedSearches.getList({name : name}, header);
    }

    function readFilterById(id){
      return savedSearches.get(id);
    }

    function updateFilter(id, filter){
      var defer = $q.defer();
      readFilterById(id).then(function(element){
        element.put(filter, header).then(function(data){
          defer.resolve(data);
        },function(error){
          defer.reject(error);
        });
      }, function(error){
        defer.reject(error);
      });
      return defer.promise;
    }

    function deleteFilter(id){
      var defer = $q.defer();
      readFilterById(id).then(function(element){
        element.remove(undefined, header).then(function(data){
          defer.resolve(data);
        },function(error){
          defer.reject(error);
        });
      }, function(error){
        defer.reject(error);
      });
      return defer.promise;
    }
  }
  MyFiltersService.$inject = ['Restangular', '$cookies', '$q', 'MY_FILTER_API_URL'];

  angular.module('tc.challenges.services').factory('MyFiltersService', MyFiltersService);
}());
