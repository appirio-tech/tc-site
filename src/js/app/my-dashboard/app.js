/* TODO:
 * - Wrap in anon function
 * - Change style to match style guide
 *
 */

(function () {

  angular
    .module('myDashboard', [
      'ngRoute',
      'restangular',
      'ngCookies',
      'myDashboard.services'
    ])
    .constant("API_URL", tcLCApiURL)

  .config(DataPreProcessing)
  .constant("PHOTO_LINK_LOCATION", "http://community.topcoder.com");

  DataPreProcessing.$inject = ['$httpProvider', 'RestangularProvider', 'API_URL'];

  /**
   *
   * @param $httpProvider
   * @param RestangularProvider
   * @param API_URL
   * @constructor
   */
  function DataPreProcessing($httpProvider, RestangularProvider, API_URL) {
    /*
     * Enable CORS
     * http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
     */
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Base API url
    RestangularProvider.setBaseUrl(API_URL);

    // Format restangular response

    // add a response intereceptor
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      var extractedData = '';

      extractedData = data.data ? data.data : data;
      // .. to look for getList operations
      if (operation === "getList") {
        // .. and handle the data and meta data
        if (!(Object.prototype.toString.call(extractedData) === '[object Array]')) {
          extractedData = [extractedData];
        }

        extractedData.pagination = {
          total: data.total,
          pageIndex: data.pageIndex,
          pageSize: data.pageSize
        };
      }

      return extractedData;
    });
  }
})();
