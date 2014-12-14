/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * @author: TCS_ASSEMBLER
 * @version 1.0
 *
 * This service provides CRUD operations for "my filters" feature. It also provides some utilities which are useful for
 * "my filters" feature.
 */

/*jslint nomen: true*/
/*global angular: true, _: true */

(function() {
  'use strict';
  /**
   * This function defines the service "MyFiltersService".
   * @return the service definition object.
   */
  function MyFiltersService(Restangular, $cookies, $q, MY_FILTER_API_URL, $location) {

    var header = {
      'Content-Type': 'application/json'
    };
    //The restangular object used to perform RESTful HTTP requests.
    var restangular = Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(MY_FILTER_API_URL);
      if ($cookies.tcjwt) {
        RestangularConfigurer.setDefaultHeaders({
          'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")
        });
      }
      //No cache, my filters list is required to refresh on any data changes.
      RestangularConfigurer.setDefaultHttpFields({
        cache: false
      });
    });

    var savedSearches = restangular.all('saved-searches');

    var myFiltersService = {
      createFilter: createFilter,
      readFilters: readFilters,
      readFilterByName: readFilterByName,
      readFilterById: readFilterById,
      updateFilter: updateFilter,
      deleteFilter: deleteFilter,
      encode: encode,
      decode: decode,
      showError: showError,
      showConfirm: showConfirm,
      getCurrentTrack: getCurrentTrack
    };

    return myFiltersService;

    /**
     * Send a POST request to create a filter.
     * @param filter the filter to create.
     * @return the promise of this http request.
     */
    function createFilter(filter) {
      return savedSearches.post(filter, undefined, header);
    };
    /**
     * Send a GET request to retrieve a list of filters.
     * @param offset the offset of the returned filters.
     * @param limit the total number of the returned filters.
     * @return the promise of this http request.
     */
    function readFilters(offset, limit) {
      return savedSearches.getList({
        offset: offset,
        limit: limit
      }, header);
    };
    /**
     * Send a GET request to retrieve a list of filters.
     * @param name the name of the returned filters.
     * @return the promise of this http request.
     */
    function readFilterByName(name) {
      return savedSearches.getList({
        name: name
      }, header);
    };
    /**
     * Send a GET request to retrieve a particular filter.
     * @param id the id of the particular filter.
     * @return the promise of this http request.
     */
    function readFilterById(id) {
      return savedSearches.get(id);
    };
    /**
     * Send a PUT request to modify a particular filter.
     * @param id the id of the particular filter.
     * @param filter the filter with modification.
     * @return the promise of this http request.
     */
    function updateFilter(id, filter) {
      return savedSearches.one(id).customPUT(filter);
    };
    /**
     * Send a DELETE request to delete a particular filter.
     * @param id the id of the particular filter.
     * @return the promise of this http request.
     */
    function deleteFilter(id) {
      return savedSearches.one(id).remove(undefined, header);
    };
    /**
     * Encode the filter object into the url query string.
     * @param object the filter object.
     * @return the url query string.
     */
    function encode(object) {
      return $.param(object);
    };
    /**
     * Decode the url query string into an object and do some normalizations.
     * @param param the url query string.
     * @return the filter object.
     */
    function decode(param) {
      var object = $.deparam(param);

      object.challengeTypes = toArray(object.challengeTypes);
      object.technologies = toArray(object.technologies);
      object.platforms = toArray(object.platforms);
      object.keywords = toArray(object.keywords);

      //Normalize userChallenges.
      object['userChallenges'] = normalize(object['userChallenges']);
      return object;
    };
    /**
     * The value userChallenges might be the following values: '', 'true', 'false', so we normalize it to true/false.
     * @param userChallenges the denormalized value.
     * @return the normalized value.
     */
    function normalize(userChallenges) {
      return userChallenges === '' || userChallenges === 'true' || userChallenges === true;
    };
    /**
     * Wrap the field into an array.
     * @param field it may be an normal object or an array.
     * @return the filed which is an array.
     */
    function toArray(field) {
      return field ? [].concat(field) : [];
    };
    /**
     * Show the error modal.
     * @param text the error message.
     * @param error the error object.
     */
    function showError(text, error) {
      //console.log(error);
      //This DOM manipulation is necessary just as other modals' manipulation in this project,
      //for the modal is in footer.php.
      $("#filterSavedFailed .failedMessage").html(text + '<br>' + 'Status code: ' + error.status);
      showModal("#filterSavedFailed");
    };
    /**
     * Show the confirmation modal.
     * @param text the confirmation message, if omitted the default meassage will display.
     */
    function showConfirm(text) {
      //Use the default message when text is undefined, which is already embedded in the modal html code. 
      if (text) {
        //This DOM manipulation is necessary just as other modals' manipulation in this project,
        //for the modal is in footer.php.
        $("#filterSavedSuccess .success").html(text);
      }
      showModal("#filterSavedSuccess");
    };
    /**
     * Parse the current track out of URL in the browser address bar.
     * @return the current track.
     */
    function getCurrentTrack() {
      return $location.path().match(/\/([A-z]+)\//)[1];
    };
  }
  MyFiltersService.$inject = ['Restangular', '$cookies', '$q', 'MY_FILTER_API_URL', '$location'];

  angular.module('tc.challenges.services').factory('MyFiltersService', MyFiltersService);
}());
