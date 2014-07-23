/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';

/**
 * The develop tab controller function, responsible for software develop competitions.
 */
var DevelopCtrl = function ($scope, MemberProfileService, ChartService) {
  var dataCtrl = this;


  dataCtrl.init($scope);

  $scope.$watch('subTrack', function () {
    //only serve for develop tab.
    if($scope.track !== 'develop')return;

    dataCtrl.subTrack = $scope.subTrack;

    if ($scope.stats === undefined) {
      //get the stats, the 'user' is a global variable.
      MemberProfileService.getStatistics(user, $scope.track, $scope.baseCtrl.cache).then(function (stats) {
        dataCtrl.dealWithDevelopStatistics($scope, stats, ChartService, MemberProfileService);
      }, function errorCallback(){
        dataCtrl.dealWithDevelopStatistics($scope, {}, ChartService, MemberProfileService);
      });
    } else {
      dataCtrl.requestRatingAndDistribution($scope, ChartService, MemberProfileService);
    }

  });
};
/**
 * Deal with develop statistics, this method can handle both sucessful and failure responses.
 */
DevelopCtrl.prototype.dealWithDevelopStatistics = function($scope, stats, ChartService, MemberProfileService){
  var dataCtrl = this;

  //cache the develop statistics.
  $scope.baseCtrl.cache[$scope.track] = stats;

  //read-only
  $scope.stats = stats;
  dataCtrl.emptyFlag = dataCtrl.isEmptySubTrack($scope);
  dataCtrl.dataLoaded = true;

  if (!dataCtrl.emptyFlag) {
    //This will trigger the 'subTrack' watch, and thus will send a requestRatingAndDistribution request.
    //Thus no need the second line of code.
    $scope.setSubTrack(Object.keys($scope.stats.Tracks)[0]);
    //dataCtrl.requestRatingAndDistribution($scope, ChartService, MemberProfileService);
  }
}
/**
 * Send a request for rating and distribution data.
 */
DevelopCtrl.prototype.requestRatingAndDistribution = function($scope, ChartService, MemberProfileService){
  var dataCtrl = this;
  if ($scope.subTrack) {
    dataCtrl.subTrack = $scope.subTrack;
    dataCtrl.populateData($scope);

    //retrieve the history and distribution only once.
    if (dataCtrl[dataCtrl.subTrack] === undefined) {
      MemberProfileService.getRatingAndDistribution(
        user, $scope.subTrack, $scope.track, $scope.baseCtrl.cache).then(function (data) {
          dataCtrl.dealWithRatingAndDistribution($scope, data, ChartService);
      }, function errorCallback(){
          dataCtrl.dealWithRatingAndDistribution($scope, {}, ChartService);
      });
    }
  }
};
/**
 * Deal with rating and distribution data, this method can handle both sucessful and failure responses.
 */
DevelopCtrl.prototype.dealWithRatingAndDistribution = function($scope, data, ChartService){
  var dataCtrl = this;
  //cache the develop statistics.
  $scope.baseCtrl.cache[$scope.track][$scope.subTrack] = data;

  if(data.history && data.distribution){
    dataCtrl[dataCtrl.subTrack] = {};
    dataCtrl[dataCtrl.subTrack].rating = $scope.stats.Tracks[dataCtrl.subTrack].rating;
    dataCtrl[dataCtrl.subTrack].ingestedData = ChartService.ingest(data.history, data.distribution);
  }
};

/**
 * Return true if the competitor doesn't take part in any software development competition.
 */
DevelopCtrl.prototype.isEmptySubTrack = function ($scope) {

  return jQuery.isEmptyObject($scope.stats) || jQuery.isEmptyObject($scope.stats.Tracks);
};

/**
 * The init function, which initialize the grid congfiguration.
 */
DevelopCtrl.prototype.init = function ($scope) {
  this.dataLoaded = false;
  this.emptyFlag = false;

  $scope.devData = [];

  $scope.gridOptions = {
    data: 'devData',
    enableRowSelection: false,
    enableSorting: false,
    rowHeight: 28,
    headerRowHeight: 25,
    columnDefs: [{
      field: 'details',
      displayName: 'Details'
    }, {
      field: 'total',
      displayName: 'Total'
    }]
  };
};

/**
 * This function populates data into ngGrids.
 */
DevelopCtrl.prototype.populateData = function ($scope) {
  $scope.devData = [{
    details: "Inquiries",
    total: this.format($scope, 'inquiries')
  }, {
    details: "Submissions",
    total: this.format($scope, 'submissions')
  }, {
    details: "Submission Rate",
    total: this.format($scope, 'submissionRate')
  }, {
    details: "Passed Screening",
    total: this.format($scope, 'passedScreening')
  }, {
    details: "Screening Success Rate",
    total: this.format($scope, 'screeningSuccessRate')
  }, {
    details: "Passed Review",
    total: this.format($scope, 'passedReview')
  }, {
    details: "Review Success Rate",
    total: this.format($scope, 'reviewSuccessRate')
  }, {
    details: "Maximum Score",
    total: this.format($scope, 'maximumScore')
  }, {
    details: "Minimum Score",
    total: this.format($scope, 'minimumScore')
  }, {
    details: "Appeals",
    total: this.format($scope, 'appeals')
  }, {
    details: "Appeal Success Rate",
    total: this.format($scope, 'appealSuccessRate')
  }, {
    details: "Average Score",
    total: this.format($scope, 'averageScore')
  }, {
    details: "Average Placement",
    total: this.format($scope, 'averagePlacement')
  }, {
    details: "Wins",
    total: this.format($scope, 'wins')
  }, {
    details: "Win Percentage",
    total: this.format($scope, 'winPercentage')
  }];


};

/**
 * This function return the value for given property name in a sub track competition.
 */
DevelopCtrl.prototype.format = function ($scope, propertyName) {
  var result = $scope.stats.CompetitionHistory[$scope.subTrack][propertyName];
  //if(result == 0)result = 'n/a';
  return result;
};
/**
 * Register the controller into Angular <code>tc</code> module.
 */
tc.controller('DevelopCtrl', DevelopCtrl);