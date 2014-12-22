/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';

/**
 * The Data Science controller function, responsible for algorithm and marathon competition.
 */
var DataScienceCtrl = function ($scope, UsersService, ChartService) {
  var dataCtrl = this;

  dataCtrl.init($scope);

  //using user details api to determine his ratings in the contests
  $scope.$watch('coder', function () {
    if($scope.coder !== undefined){
      jQuery.map($scope.coder.ratingSummary, function (obj) {
        if (obj.name == 'Marathon Match') {
          dataCtrl.marathonFlag = obj.rating;
        } else if (obj.name == 'Algorithm') {
          dataCtrl.algorithmFlag = obj.rating;
        };
      });
    };
  });

  $scope.$watch('subTrack', function () {

    //only serve for data science tab.
    if($scope.track !== 'dataScience')return;

    dataCtrl.subTrack = $scope.subTrack;
    if (dataCtrl[dataCtrl.subTrack] === undefined) {
      dataCtrl.dataLoaded = false;

      //get the stats, the 'user' is a global variable.
      UsersService.getDataScienceStats(user, dataCtrl.subTrack, $scope.baseCtrl.cache).then(function (stats) {
        dataCtrl.dealWithDataScienceStatistic($scope, stats, ChartService);
      }, function errorCallback() {
        dataCtrl.dealWithDataScienceStatistic($scope, {}, ChartService);
      });
    }
  });
};
/**
 * Deal with data science statistics, this method can handle both sucessful and failure responses.
 */
DataScienceCtrl.prototype.dealWithDataScienceStatistic = function($scope, stats, ChartService){
  var dataCtrl = this;

  if (stats.rank == 'not ranked') stats.rank = 'N/A';
  if (stats.countryRank == 'not ranked') stats.countryRank = 'N/A';
  if (stats.schoolRank == 'not ranked') stats.schoolRank = 'N/A';

  //cache the data science statistics.
  $scope.baseCtrl.cache['dataScience'][dataCtrl.subTrack] = stats;

  dataCtrl[dataCtrl.subTrack] = stats;
  //if this is rated user, then populate statistics.
  if(dataCtrl[dataCtrl.subTrack].rating){
    dataCtrl.populateData($scope);

    var historyData = dataCtrl[dataCtrl.subTrack].History;
    var distributionData = dataCtrl[dataCtrl.subTrack].Distribution;
    dataCtrl[dataCtrl.subTrack].ingestedData = ChartService.ingest(historyData, distributionData);
  }

  dataCtrl.dataLoaded = true;
};

/**
 * The init function, which initialize the grid congfiguration.
 */
DataScienceCtrl.prototype.init = function ($scope) {

  this.subTrack = $scope.subTrack;
  this.dataLoaded = false;

  $scope.div1Data = [];
  $scope.div1GridOptions = {
    data: 'div1Data',
    enableRowSelection: false,
    enableSorting: false,
    rowHeight: 28,
    headerRowHeight: 25,
    columnDefs: [{
      field: 'problem',
      displayName: 'Problem',
      width: '129px'
    }, {
      field: 'submitted',
      displayName: 'Submitted',
      width: '83px'
    }, {
      field: 'failedChallenge',
      displayName: 'Failed Challenges',
      width: '123px'
    }, {
      field: 'failedSysTest',
      displayName: 'Failed Sys.Test',
      width: '115px'
    }, {
      field: 'successRate',
      displayName: 'Success %',
      width: '80px'
    }]
  };

  $scope.div2Data = [];
  $scope.div2GridOptions = {
    data: 'div2Data',
    enableRowSelection: false,
    enableSorting: false,
    rowHeight: 28,
    headerRowHeight: 25,
    columnDefs: [{
      field: 'problem',
      displayName: 'Problem',
      width: '129px'
    }, {
      field: 'submitted',
      displayName: 'Submitted',
      width: '83px'
    }, {
      field: 'failedChallenge',
      displayName: 'Failed Challenges',
      width: '123px'
    }, {
      field: 'failedSysTest',
      displayName: 'Failed Sys.Test',
      width: '115px'
    }, {
      field: 'successRate',
      displayName: 'Success %',
      width: '80px'
    }]
  };

  $scope.chaData = [];
  $scope.chaGridOptions = {
    data: 'chaData',
    enableRowSelection: false,
    enableSorting: false,
    rowHeight: 28,
    headerRowHeight: 25,
    columnDefs: [{
      field: 'problem',
      displayName: 'Problem',
      width: '158px'
    }, {
      field: 'failedChallenge',
      displayName: '#Failed Challenges',
      width: '162px'
    }, {
      field: 'challenges',
      displayName: '#Challenges',
      width: '112px'
    }, {
      field: 'successRate',
      displayName: 'Success %',
      width: '98px'
    }]
  };

  $scope.marData = [];

  $scope.marGridOptions = {
    data: 'marData',
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
DataScienceCtrl.prototype.populateData = function ($scope) {
  var dataCtrl = this;

  if (dataCtrl.subTrack === 'algorithm') {
    var div1 = dataCtrl[dataCtrl.subTrack].Divisions['Division I'];
    $scope.div1Data = [
      dataCtrl.construct(div1['Level One'], 'Level One'),
      dataCtrl.construct(div1['Level Two'], 'Level Two'),
      dataCtrl.construct(div1['Level Three'], 'Level Three'),
      dataCtrl.construct(div1['Level Total'], 'Total')
    ];
    var div2 = dataCtrl[dataCtrl.subTrack].Divisions['Division II'];
    $scope.div2Data = [
      dataCtrl.construct(div2['Level One'], 'Level One'),
      dataCtrl.construct(div2['Level Two'], 'Level Two'),
      dataCtrl.construct(div2['Level Three'], 'Level Three'),
      dataCtrl.construct(div2['Level Total'], 'Total')
    ];

    var cha = dataCtrl[dataCtrl.subTrack].Challenges.Levels;
    $scope.chaData = [
      dataCtrl.construct(cha['Level One'], 'Level One'),
      dataCtrl.construct(cha['Level Two'], 'Level Two'),
      dataCtrl.construct(cha['Level Three'], 'Level Three'),
      dataCtrl.construct(cha['Total'], 'Total')
    ];
  } else {
    var mar = dataCtrl[dataCtrl.subTrack];
    $scope.marData = [{
      details: 'Best Rank',
      total: mar.bestRank
    }, {
      details: 'Wins',
      total: mar.wins
    }, {
      details: 'Top Five Finishes',
      total: mar.topFiveFinishes
    }, {
      details: 'Top Ten Finishes',
      total: mar.topTenFinishes
    }, {
      details: 'Avg. Rank',
      total: mar.avgRank
    }, {
      details: 'Avg. Num. Submissions',
      total: mar.avgNumSubmissions
    }, {
      details: 'Competitions',
      total: mar.competitions
    }, {
      details: 'Most Recent Event',
      total: mar.mostRecentEventName
    }];
  }

};
/**
 * Extend the given object <code>obj</code> with {problem, <code>problem</code>}.
 */
DataScienceCtrl.prototype.construct = function (obj, problem) {

  var result = $.extend({}, obj, {
    'problem': problem
  });
  this.changePropertyName(result, 'failedSysTest', 'failedSys.Test');
  this.changePropertyName(result, 'successRate', 'success%');
  return result;
};

/**
 * Replace some property name with no hazard character.
 */
DataScienceCtrl.prototype.changePropertyName = function (obj, newName, oldName) {
  if (oldName in obj) {
    obj[newName] = obj[oldName];
    $(obj).removeProp(oldName);
  }
};
/**
 * Register the controller into Angular <code>tc</code> module.
 */
tc.controller('DataScienceCtrl', DataScienceCtrl);
