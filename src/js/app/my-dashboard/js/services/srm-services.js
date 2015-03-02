/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * SRMService. Factory to access topcoder API to retrieve SRM related info
 */
(function () {

  angular
    .module('myDashboard.services')
    .factory('SRMService', SRMService);

  SRMService.$inject = ['Restangular', '$filter'];

  /**
   * SRMService 
   * @param Restangular to access the REST api
   * @param $filter used to format the date
   * @constructor
   */
  function SRMService(Restangular, $filter) {

    var service = Restangular.withConfig(function(RestangularConfigurer) {
    });

    /**
     * getSRMSchedule returns list of upcoming SRMs currently scheduled
     *
     */
    service.getSRMSchedule = function() {
      return service.one("data").one("srm").getList("schedule", {sortColumn: "registrationstarttime", sortOrder: "asc", registrationStartTimeAfter: $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss.sssZ'), statuses: "A,P,F"});
    }

    return service;  
  }
})();