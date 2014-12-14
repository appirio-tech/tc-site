/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';

/**
 * The overview controller function.
 * @param UsersService the service used to retrieve recent wins stats.
 * @param ImageService the service used to load image asynchrous.
 */
var OverviewCtrl = function (UsersService, ImageService, $scope, CoderbitsService) {

  CoderbitsService.getOverview(user).then(function(overview){
    $scope.topTraits = overview;
    $scope.page = 0;

    $scope.nextPage = function(){
      if($scope.page === 1) return;
      $scope.page++;
      $('#overview-top-traits-container').scrollLeft($scope.page*1000);
    }

    $scope.prevPage = function(){
      if($scope.page === 0) return;
      $scope.page--;
      $('#overview-top-traits-container').scrollLeft($scope.page*1000);
    }

  });

  var overviewCtrl = this;

  overviewCtrl.init();
};

/**
 * set loading flags to uncompleted before data is loaded.
 */
OverviewCtrl.prototype.init = function () {
  this.dataLoaded = false;
  this.fullImagesLoaded = false;
  this.previewLoaded = false;
  this.carouselRendered = false;
};

tc.controller('OverviewCtrl', ['UsersService', 'ImageService', '$scope', 'CoderbitsService', OverviewCtrl]);