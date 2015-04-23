/**
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 * @author mdesiderio
 * @version 1.0
 *
 * Controller for the helpful links widget
 */
 (function () {

  /**
   * Create helpful links controller
   */
  angular
    .module('myDashboard')
    .controller('HelpfulLinksCtrl', HelpfulLinksCtrl);

  /**
   * Inject dependencies
   * @type {string[]}
   */
  HelpfulLinksCtrl.$inject = ['$scope', '$location', 'MAIN_URL', 'COMMUNITY_URL', 'REVIEW_APP_URL', 'FORUMS_APP_URL', 'HELP_APP_URL'];

  /**
   * Helpful links controller implementation
   *
   * @param $scope
   * @constructor
   */
  function HelpfulLinksCtrl($scope, $location, MAIN_URL, COMMUNITY_URL, REVIEW_APP_URL, FORUMS_APP_URL, HELP_APP_URL) {
    var vm = this;
    vm.communityBaseUrl = $location.protocol() + ":" + COMMUNITY_URL;
    vm.mainUrl = MAIN_URL;
    vm.reviewAppUrl = $location.protocol() + "://" + REVIEW_APP_URL;
    vm.forumsAppUrl = $location.protocol() + "://" + FORUMS_APP_URL;
    vm.helpAppUrl = $location.protocol() + "://" + HELP_APP_URL;
    vm.digitalRunUrl = $location.protocol() + "://" + vm.mainUrl + "/dr";
    // array to store all the links to be shown in the widget
    vm.root = null;
    vm.visibleNode = null;
    vm.breadcrumb = [];
    vm.changeVisibleLinks = changeVisibleLinks;
    vm.showPreviousLinks = showPreviousLinks;
    
    //activate controller
    activate();

    function activate() {
      // prepare all links
      vm.root = {
        id: 'helpfullinks',
        name: 'Helpful Links',
        description: 'Helpful Links',
        href: null,
        children: prepareRootLinks()
      };

      vm.visibleNode = vm.root;
    }

    function changeVisibleLinks(link) {
      if (link.children && link.children.length > 0) {
        vm.breadcrumb.push(vm.visibleNode);
        vm.visibleNode = link;
      }
    }

    function showPreviousLinks() {
      var link = vm.breadcrumb.pop();
      vm.visibleNode = link;
    }

    function prepareRootLinks() {
      var links = [];
      var link = {
        id: 'onlinereview',
        name: 'Online Review',
        description: 'Your submission & scoring tool',
        href: vm.reviewAppUrl,
        children: []
      };
      links.push(link);
      link = {
        id: 'algorithm',
        name: 'Algorithm (SRM)',
        description: 'Algorithm (SRM)',
        href: null,
        children: getAlgorithmLinks()
      };
      links.push(link);
      link = {
        id: 'marathonmatch',
        name: 'Marathon Match',
        description: 'Marathon Match',
        href: null,
        children: getMarathonMatchLinks()
      };
      links.push(link);
      link = {
        id: 'onlinereview',
        name: 'Online Review',
        description: 'Your submission & scoring tool',
        href: vm.reviewAppUrl,
        children: []
      };
      links.push(link);
      link = {
        id: 'digitalrun',
        name: 'The Digital Run',
        description: 'The Digital Run',
        href: vm.digitalRunUrl,
        children: []
      };
      links.push(link);
      link = {
        id: 'statistics',
        name: 'Statistics',
        description: 'Statistics',
        href: null,
        children: getStatisticsLinks()
      };
      links.push(link);
      link = {
        id: 'reviewboards',
        name: 'Review Boards',
        description: 'Review Boards',
        href: null,
        children: getReviewBoardsLinks()
      };
      links.push(link);
      return links;
    }

    function getMainUrl(relativeUrl) {
      var url = $location.protocol() + "://" + vm.mainUrl;
      if (relativeUrl) {
        url += relativeUrl;
      }
      return url;
    }

    function getAppsUrl(relativeUrl) {
      var url = $location.protocol() + "://apps." + vm.mainUrl;
      if (relativeUrl) {
        url += relativeUrl;
      }
      return url;
    }

    function getAlgorithmLinks() {
      var links = [];
      var link = {
        id: 'srms',
        name: 'Single Round Matches (SRM)',
        description: 'Your submission & scoring tool',
        href: getMainUrl('/active-challenges/data/'),
        children: []
      };
      links.push(link);
      link = {
        id: 'matcharchive',
        name: 'Match Archive',
        description: 'Match Archive',
        href: getMainUrl('/tc?module=MatchList'),
        children: []
      };
      links.push(link);
      link = {
        id: 'matchoverviews',
        name: 'Match Overviews',
        description: 'Match Overviews',
        href: getMainUrl('/stat?c=round_overview'),
        children: []
      };
      links.push(link);
      link = {
        id: 'matchwinners',
        name: 'Match Winners',
        description: 'Match Winners',
        href: getMainUrl('/tc?module=SrmDivisionWins'),
        children: []
      };
      links.push(link);
      link = {
        id: 'matchresults',
        name: 'Match Results',
        description: 'Match Results',
        href: getMainUrl('/stat?c=last_match'),
        children: []
      };
      links.push(link);
      link = {
        id: 'matcheditorials',
        name: 'Match Editorials',
        description: 'Match Editorials',
        href: getAppsUrl('/wiki/display/tc/Algorithm+Problem+Set+Analysis'),
        children: []
      };
      links.push(link);
      link = {
        id: 'problemarchive',
        name: 'Problem Archive',
        description: 'Problem Archive',
        href: getMainUrl('tc?module=ProblemArchive'),
        children: []
      };
      links.push(link);
      return links;
    }

    function getMarathonMatchLinks() {
      var links = [];
      var link = {
        id: 'challenges',
        name: 'Challenges',
        description: 'Challenges',
        href: getMainUrl('/challenges/data/active/'),
        children: []
      };
      links.push(link);
      link = {
        id: 'matcharchive',
        name: 'Match Archive',
        description: 'Match Archive',
        href: getMainUrl('/challenges/data/past/'),
        children: []
      };
      links.push(link);
      return links;
    }

    function getStatisticsLinks() {
      var links = [];
      var link = {
        id: 'topranked',
        name: 'Top Ranked',
        description: 'Top Ranked',
        href: null,
        children: []
      };
      links.push(link);
      link = {
        id: 'recordbook',
        name: 'Record Book',
        description: 'Record Book',
        href: null,
        children: []
      };
      links.push(link);
      return links;
    }

    function getReviewBoardsLinks() {
      var links = [];
      var link = {
        id: 'conceptulization',
        name: 'Conceptulization',
        description: 'Conceptulization',
        href: null,
        children: []
      };
      links.push(link);
      link = {
        id: 'specification',
        name: 'Specification',
        description: 'Specification',
        href: null,
        children: []
      };
      links.push(link);
      return links;
    }
  }


})();