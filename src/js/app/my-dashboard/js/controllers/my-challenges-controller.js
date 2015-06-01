/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @author vikas.agarwal@appirio.com
 * @version 1.0
 *
 * Controller for the my challenges widget
 */
(function () {

  /**
   * Create my challenges controller
   */
  angular
    .module('myDashboard')
    .controller('MyChallengesCtrl', MyChallengesCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  MyChallengesCtrl.$inject = ['$scope', 'AuthService','ChallengeService'];

  /**
   * Controller implementation
   *
   * @param $scope
   * @param ChallengeService services to access the challenges api
   * @constructor
   */
  function MyChallengesCtrl($scope, AuthService, ChallengeService) {
    var vm = this;
    vm.loading = true;
    vm.myChallenges = [];
    vm.visibleChallenges = [];
    vm.pageIndex = 1;
    vm.pageSize = 5;
    vm.sortColumn = 'submissionEndDate';
    vm.sortOrder = 'asc';
    vm.totalPages = 1;
    vm.totalRecords = vm.totalPages * vm.pageSize;
    vm.firstRecordIndex = (vm.pageIndex - 1) * vm.pageSize + 1;
    vm.lastRecordIndex = vm.totalPages * vm.pageSize;
    vm.pageLinks = [];
    vm.prevPageLink = {};
    vm.nextPageLink = {};
    vm.changePage = changePage;
    vm.isCurrentPage = isCurrentPage;
    vm.getCurrentPageClass = getCurrentPageClass;
    vm.sort = sort;

    // getChallenges controller
    if (AuthService.isLoggedIn === true) {
      getChallenges();
    } else {
      return false;
    }

    /**
     * getChallenges Fetches user's active challenges from the API
     *
     * @return {Object} promise of API call
     */
    function getChallenges() {
      initPaging();
      var searchRequest = {
        pageIndex: vm.pageIndex,
        pageSize: vm.pageSize,
        sortColumn: vm.sortColumn,
        sortOrder: vm.sortOrder
      };
      // show loading icon
      vm.loading = true;
      // Fetch my active
      return ChallengeService.getMyActiveChallenges(searchRequest)
        .then(function(data) {
          processChallengesResponse(data);
          // stop loading icon
          vm.loading = false;

      });
    }

    function processChallengesResponse(data) {
      if (data.pagination) {
        vm.totalPages = Math.ceil(data.pagination.total / vm.pageSize);
        vm.totalRecords = data.pagination.total;
        vm.firstRecordIndex = (vm.pageIndex - 1) * vm.pageSize + 1;
        vm.lastRecordIndex = vm.pageIndex * vm.pageSize;
        vm.lastRecordIndex = vm.lastRecordIndex > vm.totalRecords ? vm.totalRecords : vm.lastRecordIndex;
      }
      vm.myChallenges = data;
      // uncomment following line when API supports paging
      // vm.visibleChallenges = data;
      // remove following line when API supports paging
      vm.visibleChallenges = data.slice(vm.firstRecordIndex - 1, vm.lastRecordIndex);
    }

    /**
     * changePage changes page in the result set
     *
     * @param {JSON} pageLink page link object
     *
     * @return {Object} promise of API call with updated pageIndex
     */
    function changePage(pageLink) {
      vm.pageIndex = pageLink.val;
      getChallenges();
    }

    /**
     * isCurrentPage checks if the give page link is the current page
     *
     * @param {JSON} pageLink page link object
     *
     * @return {Boolean} true if the given page is the current page, false otherwise
     */
    function isCurrentPage (pageLink) {
      return pageLink.val === vm.pageIndex;
    }

    /**
     * getCurrentPageClass Identifies the css class to be used for the given page link
     *
     * @param {JSON} pageLink page link object
     *
     * @return {String}
     */
    function getCurrentPageClass(pageLink) {
      return isCurrentPage(pageLink) ? 'current-page' : '';
    }

    /**
     * sort sorts the results based on the given column
     *
     * @param {String} column page link object
     *
     * @return {Object} promise of API call with updated sort params
     */
    function sort(column) {
      if (vm.sortColumn === column) {
        vm.sortOrder = vm.sortOrder === 'desc' ? 'asc' : 'desc';
      } else {
        vm.sortOrder = 'desc';
      }
      vm.sortColumn = column;
      getChallenges();
    }

    /**
     * initPaging Initializes the paging
     */
    function initPaging() {
      vm.pageLinks = [
        {text: "Prev", val: vm.pageIndex - 1},
        {text: "Next", val: vm.pageIndex + 1}
      ];
      vm.prevPageLink = {text: "Prev", val: vm.pageIndex - 1};
      vm.nextPageLink = {text: "Next", val: vm.pageIndex + 1};
    }
  }


})();