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
  HelpfulLinksCtrl.$inject = ['$scope', 'MAIN_URL', 'COMMUNITY_URL', 'REVIEW_APP_URL', 'FORUMS_APP_URL', 'HELP_APP_URL', 'DOMAIN'];

  /**
   * Helpful links controller implementation
   *
   * @param $scope
   * @constructor
   */
  function HelpfulLinksCtrl($scope, MAIN_URL, COMMUNITY_URL, REVIEW_APP_URL, FORUMS_APP_URL, HELP_APP_URL, DOMAIN) {
    var vm = this;
    vm.communityBaseUrl = COMMUNITY_URL;
    vm.mainUrl = MAIN_URL;
    vm.domain = DOMAIN;
    vm.reviewAppUrl = "//" + REVIEW_APP_URL;
    vm.forumsAppUrl = "//" + FORUMS_APP_URL;
    vm.helpAppUrl = "//" + HELP_APP_URL;
    vm.digitalRunUrl = vm.communityBaseUrl + "/dr";
    // array to store all the links to be shown in the widget
    vm.root = null;
    vm.visibleNode = null;
    vm.breadcrumb = [];
    vm.changeVisibleLinks = changeVisibleLinks;
    vm.showPreviousLinks = showPreviousLinks;
    vm.hasChildren = hasChildren;
    
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

    function hasChildren(link) {
      return link && link.children && link.children.length > 0;
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
        id: 'digitalrun',
        name: 'The Digital Run',
        description: 'The Digital Run',
        href: vm.digitalRunUrl,
        children: []
      };
      links.push(link);
      link = {
        id: 'topranked',
        name: 'Top Ranked',
        description: 'Top Ranked',
        href: null,
        children: getTopRankedLinks()
      };
      links.push(link);
      link = {
        id: 'recordbook',
        name: 'Record Book',
        description: 'Record Book',
        href: null,
        children: getRecordBookLinks()
      };
      links.push(link);
      link = {
        id: 'cotm',
        name: 'Coder of the Month',
        description: 'Coder of the Month',
        href: null,
        children: getCOTMLinks()
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
      link = {
        id: 'reviewopportunities',
        name: 'Review Opportunities',
        description: 'Review Opportunities',
        href: null,
        children: getReviewOpportunitiesLinks()
      };
      links.push(link);
      return links;
    }

    function getMainUrl(relativeUrl) {
      var url = vm.mainUrl;
      if (relativeUrl) {
        url += relativeUrl;
      }
      return url;
    }

    function getAppsUrl(relativeUrl) {
      var url = "//apps." + vm.domain;
      if (relativeUrl) {
        url += relativeUrl;
      }
      return url;
    }
    
    function getCommunityUrl(relativeUrl) {
      var url = vm.communityBaseUrl;
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
        href: getCommunityUrl('/tc?module=MatchList'),
        children: []
      };
      links.push(link);
      link = {
        id: 'matchoverviews',
        name: 'Match Overviews',
        description: 'Match Overviews',
        href: getCommunityUrl('/stat?c=round_overview'),
        children: []
      };
      links.push(link);
      link = {
        id: 'matchwinners',
        name: 'Match Winners',
        description: 'Match Winners',
        href: getCommunityUrl('/tc?module=SrmDivisionWins'),
        children: []
      };
      links.push(link);
      link = {
        id: 'matchresults',
        name: 'Match Results',
        description: 'Match Results',
        href: getCommunityUrl('/stat?c=last_match'),
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
        href: getCommunityUrl('tc?module=ProblemArchive'),
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
      link = {
        id: 'matchoverview',
        name: 'Match Overview',
        description: 'Match Overview',
        href: getCommunityUrl('/longcontest/stats/?module=ViewOverview'),
        children: []
      };
      links.push(link);
      link = {
        id: 'matchwinners',
        name: 'Match Winners',
        description: 'Match Winners',
        href: getCommunityUrl('/longcontest/stats/?module=MatchWinners'),
        children: []
      };
      links.push(link);
      link = {
        id: 'matcheditorials',
        name: 'Match Editorials',
        description: 'Match Editorials',
        href: getCommunityUrl('/longcontest/?module=Static&d1=match_editorials&d2=archive'),
        children: []
      };
      links.push(link);
      link = {
        id: 'matchdatafeeds',
        name: 'Data Feeds',
        description: 'Data Feeds',
        href: getCommunityUrl('/longcontest/?module=Static&d1=support&d2=dataFeed'),
        children: []
      };
      links.push(link);
      link = {
        id: 'practice',
        name: 'Practice',
        description: 'Practice',
        href: getCommunityUrl('/longcontest/?module=ViewPractice'),
        children: []
      };
      links.push(link);
      link = {
        id: 'queuestatus',
        name: 'Queue Status',
        description: 'Queue Status',
        href: getCommunityUrl('/longcontest/?module=ViewQueue'),
        children: []
      };
      links.push(link);
      return links;
    }

    function getStatisticsLinks() {
      var links = [];
      return links;
    }

    function getTopRankedLinks() {
      var links = [];
      var link = {
        id: 'algorithm',
        name: 'Algorithm',
        description: 'Algorithm',
        href: getCommunityUrl('/tc?module=AlgoRank'),
        children: []
      };
      links.push(link);
      link = {
        id: 'highschool',
        name: 'High School',
        description: 'High School',
        href: getCommunityUrl('/tc?module=HSRank'),
        children: []
      };
      links.push(link);
      link = {
        id: 'marathonmatch',
        name: 'Marathon Match',
        description: 'Marathon Match',
        href: getCommunityUrl('/longcontest/stats/?module=CoderRank'),
        children: []
      };
      links.push(link);
      link = {
        id: 'conceptulization',
        name: 'Conceptulization',
        description: 'Conceptulization',
        href: getCommunityUrl('/stat?c=top_conceptors'),
        children: []
      };
      links.push(link);
      link = {
        id: 'specification',
        name: 'Specification',
        description: 'Specification',
        href: getCommunityUrl('/stat?c=top_specificators'),
        children: []
      };
      links.push(link);
      link = {
        id: 'architecture',
        name: 'Architecture',
        description: 'Architecture',
        href: getCommunityUrl('/stat?c=top_architects'),
        children: []
      };
      links.push(link);
      link = {
        id: 'design',
        name: 'Design',
        description: 'Design',
        href: getCommunityUrl('/stat?c=top_designers'),
        children: []
      };
      links.push(link);
      link = {
        id: 'development',
        name: 'Development',
        description: 'Development',
        href: getCommunityUrl('/stat?c=top_developers'),
        children: []
      };
      links.push(link);
      link = {
        id: 'assembly',
        name: 'Assembly',
        description: 'Assembly',
        href: getCommunityUrl('/stat?c=top_assemblers'),
        children: []
      };
      links.push(link);
      link = {
        id: 'testsuites',
        name: 'Test Suites',
        description: 'Test Suites',
        href: getCommunityUrl('/stat?c=top_testers'),
        children: []
      };
      links.push(link);
      return links;
    }

    function getRecordBookLinks() {
      var links = [];
      var link = {
        id: 'algorithm',
        name: 'Algorithm',
        description: 'Algorithm',
        href: getCommunityUrl('/tc?module=Static&d1=statistics&d2=recordbook_home'),
        children: []
      };
      links.push(link);
      link = {
        id: 'component',
        name: 'Component',
        description: 'Component',
        href: getCommunityUrl('/tc?module=Static&d1=compstats&d2=comp_recordbook_home'),
        children: []
      };
      links.push(link);
      link = {
        id: 'marathonmatch',
        name: 'Marathon Match',
        description: 'Marathon Match',
        href: getCommunityUrl('/longcontest/?module=Static&d1=stats&d2=recordbook_home'),
        children: []
      };
      links.push(link);
      return links;
    }

    function getCOTMLinks() {
      var links = [];
      var link = {
        id: 'algorithm',
        name: 'Algorithm',
        description: 'Algorithm',
        href: getCommunityUrl('/tc?module=COMHistory&achtid=5'),
        children: []
      };
      links.push(link);
      link = {
        id: 'design',
        name: 'Design',
        description: 'Design',
        href: getCommunityUrl('/tc?module=COMHistory&achtid=6'),
        children: []
      };
      links.push(link);
      link = {
        id: 'development',
        name: 'Development',
        description: 'Development',
        href: getCommunityUrl('/tc?module=COMHistory&achtid=7'),
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
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=23'),
        children: []
      };
      links.push(link);
      link = {
        id: 'specification',
        name: 'Specification',
        description: 'Specification',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=6'),
        children: []
      };
      links.push(link);
      link = {
        id: 'architecture',
        name: 'Architecture',
        description: 'Architecture',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=7'),
        children: []
      };
      links.push(link);
      link = {
        id: 'componentdesign',
        name: 'Component Design',
        description: 'Component Design',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=1'),
        children: []
      };
      links.push(link);
      link = {
        id: 'componentdevelopment',
        name: 'Component Development',
        description: 'Component Development',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=2'),
        children: []
      };
      links.push(link);
      link = {
        id: 'assembly',
        name: 'Assembly',
        description: 'Assembly',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=14'),
        children: []
      };
      links.push(link);
      link = {
        id: 'first2finish',
        name: 'First2Finish',
        description: 'First2Finish',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=38'),
        children: []
      };
      links.push(link);
      link = {
        id: 'code',
        name: 'Code',
        description: 'Code',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=39'),
        children: []
      };
      links.push(link);
      link = {
        id: 'testsuites',
        name: 'Test Suites',
        description: 'Test Suites',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=13'),
        children: []
      };
      links.push(link);
      link = {
        id: 'report',
        name: 'Report',
        description: 'Report',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=36'),
        children: []
      };
      links.push(link);
      link = {
        id: 'uiprototype',
        name: 'UI Prototype',
        description: 'UI Prototype',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=19'),
        children: []
      };
      links.push(link);
      link = {
        id: 'riabuild',
        name: 'Ria Build',
        description: 'Ria Build',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=24'),
        children: []
      };
      links.push(link);
      link = {
        id: 'contentcreation',
        name: 'Content Creation',
        description: 'Content Creation',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=35'),
        children: []
      };
      links.push(link);
      link = {
        id: 'testscenarios',
        name: 'Test Scenarios',
        description: 'Test Scenarios',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=26'),
        children: []
      };
      links.push(link);
      link = {
        id: 'bughunt',
        name: 'Bug Hunt',
        description: 'Bug Hunt',
        href: getCommunityUrl('/tc?module=ReviewBoard&pt=9'),
        children: []
      };
      links.push(link);
      return links;
    }

    function getReviewOpportunitiesLinks() {
      var links = [];
      var link = {
        id: 'conceptulization',
        name: 'Conceptulization',
        description: 'Conceptulization',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=23'),
        children: []
      };
      links.push(link);
      link = {
        id: 'specification',
        name: 'Specification',
        description: 'Specification',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=6'),
        children: []
      };
      links.push(link);
      link = {
        id: 'architecture',
        name: 'Architecture',
        description: 'Architecture',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=7'),
        children: []
      };
      links.push(link);
      link = {
        id: 'componentdesign',
        name: 'Component Design',
        description: 'Component Design',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=1'),
        children: []
      };
      links.push(link);
      link = {
        id: 'componentdevelopment',
        name: 'Component Development',
        description: 'Component Development',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=2'),
        children: []
      };
      links.push(link);
      link = {
        id: 'assembly',
        name: 'Assembly',
        description: 'Assembly',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=14'),
        children: []
      };
      links.push(link);
      link = {
        id: 'first2finish',
        name: 'First2Finish',
        description: 'First2Finish',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=38'),
        children: []
      };
      links.push(link);
      link = {
        id: 'code',
        name: 'Code',
        description: 'Code',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=39'),
        children: []
      };
      links.push(link);
      link = {
        id: 'testsuites',
        name: 'Test Suites',
        description: 'Test Suites',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=13'),
        children: []
      };
      links.push(link);
      link = {
        id: 'report',
        name: 'Report',
        description: 'Report',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=36'),
        children: []
      };
      links.push(link);
      link = {
        id: 'uiprototype',
        name: 'UI Prototype',
        description: 'UI Prototype',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=19'),
        children: []
      };
      links.push(link);
      link = {
        id: 'riabuild',
        name: 'Ria Build',
        description: 'Ria Build',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=24'),
        children: []
      };
      links.push(link);
      link = {
        id: 'contentcreation',
        name: 'Content Creation',
        description: 'Content Creation',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=35'),
        children: []
      };
      links.push(link);
      link = {
        id: 'testscenarios',
        name: 'Test Scenarios',
        description: 'Test Scenarios',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=26'),
        children: []
      };
      links.push(link);
      link = {
        id: 'bughunt',
        name: 'Bug Hunt',
        description: 'Bug Hunt',
        href: getCommunityUrl('/tc?module=ViewReviewAuctions&pt=9'),
        children: []
      };
      links.push(link);
      return links;
    }
  }


})();