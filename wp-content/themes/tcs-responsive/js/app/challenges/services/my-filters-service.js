/*global angular*/
/**
 * This service provide CRUD operations for myFilter feature, and transform the filter back and forth 
 * between  javascript object and the url query param string.
 */
(function() {
  'use strict';

  function MyFiltersService(Restangular, $cookies, $q, MY_FILTER_API_URL, $cacheFactory) {

    var header = {
      'Content-Type' : 'application/json'
    };

    var restangular = Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(MY_FILTER_API_URL);
      if ($cookies.tcjwt) {
        RestangularConfigurer.setDefaultHeaders({
          'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")
        });
      }
      //no cache, the page is required to refresh on any data changes.
      RestangularConfigurer.setDefaultHttpFields({cache: false});
    });

    var savedSearches = restangular.all('saved-searches');

    var myFiltersService = {
      createFilter : createFilter,
      readFilters : readFilters,
      readFilterByName : readFilterByName,
      readFilterById : readFilterById,
      updateFilter : updateFilter,
      deleteFilter : deleteFilter,
      encode : encode,
      decode : decode,
      showError : showError,
      showConfirm : showConfirm
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
      return savedSearches.one(id).customPUT(filter);
    }

    function deleteFilter(id){
      return savedSearches.one(id).remove(undefined, header);
    }

    function encode(object){
      return $.param(object);
    }

    function decode(param){
      var object =  $.deparam(param);
      
      object.challengeTypes = toArray(object.challengeTypes);
      object.technologies = toArray(object.technologies);
      object.platforms = toArray(object.platforms);
      object.keywords = toArray(object.keywords);

      //normalize userChallenges
      object['userChallenges'] = normalize(object['userChallenges']);
      return object;
    }

    function normalize(userChallenges){
      return userChallenges === '' || userChallenges === 'true' || userChallenges === true;
    }

    function toArray(field){
      return field ? [].concat(field) : [];
    }

    function showError(text, error){
      console.log(error);
      $("#filterSavedFailed .failedMessage").html(text + '<br>' + 'Status code: '+ error.status);
      showModal("#filterSavedFailed");
    }

    function showConfirm(text){
      //Use the default message when text is undefined, which is already embedded in the modal html code. 
      if(text){
        $("#filterSavedSuccess .success").html(text);
      }
      showModal("#filterSavedSuccess");
    }
  }
  MyFiltersService.$inject = ['Restangular', '$cookies', '$q', 'MY_FILTER_API_URL', '$cacheFactory'];

  angular.module('tc.challenges.services').factory('MyFiltersService', MyFiltersService);
}());
