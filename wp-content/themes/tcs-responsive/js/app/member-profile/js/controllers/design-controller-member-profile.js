/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';

/**
 * The Design controller function.
 * @param MemberProfileService the service used to retrieve recent wins stats.
 * @param ImageService the service used to load image asynchrous.
 */
var DesignCtrl = function (MemberProfileService, ImageService, $scope) {
  var designCtrl = this;

  designCtrl.init();

  //get the recent wins stats asynchrous.
  MemberProfileService.getRecentWins(user, $scope.track, $scope.baseCtrl.cache).then(function (recentWins) {
    designCtrl.dealWithRecentWins($scope, recentWins, ImageService);
  }, function errorCallback(){
    designCtrl.dealWithRecentWins($scope, {}, ImageService);
  });
};
/**
 * Deal with design statistics, this method can handle both sucessful and failure responses.
 */
DesignCtrl.prototype.dealWithRecentWins = function($scope, recentWins, ImageService){
  var designCtrl = this;
  //cache the design statistics.
  $scope.baseCtrl.cache[$scope.track] = recentWins;

  designCtrl.recentWins = recentWins;
  designCtrl.dataLoaded = true;
  if(!designCtrl.isEmptySubmission()){
    designCtrl.loadImagesAsync(ImageService);
    designCtrl.dateFormat();
    designCtrl.displaySlide(0);
  }
}

/**
 * set loading flags to uncompleted before data is loaded.
 */
DesignCtrl.prototype.init = function () {
  this.dataLoaded = false;
  this.fullImagesLoaded = false;
  this.previewLoaded = false;
  this.carouselRendered = false;
};


/**
 * judge if there is any recent wins.
 */
DesignCtrl.prototype.isEmptySubmission = function () {
  return !this.recentWins.recentWinningSubmissions || this.recentWins.recentWinningSubmissions.length === 0;
};

/**
 * Set the current slide index.
 * @param slide the slide index.
 */
DesignCtrl.prototype.displaySlide = function (slide) {
  this.currentIndex = slide;
};

/**
 * Set the current slide index.
 * @param slide the slide index.
 */
DesignCtrl.prototype.setCarouselRendered = function (rendered) {
  this.carouselRendered = rendered;
};

/**
 * format submission date with TC time zone(New York).
 */
DesignCtrl.prototype.dateFormat = function () {
  //some function is passing in undefined timezone_string variable causing js errors, so check if undefined and set default:
  if (typeof timezone_string === 'undefined') {
    var timezone_string = "America/New_York"; // lets set to TC timezone
  }

  $(this.recentWins.recentWinningSubmissions).each(function () {
    //using moment we can retrieve correct timezone, we can't do this with the default angularjs's date filter.
    this.submissionDate = moment(this.submissionDate).tz(timezone_string).format("MMM DD,YYYY HH:mm z");
  });
};

/**
 * load images asynchrous, set flags to completed when loaded.
 * @param ImageService the image service used to load images asynchrous.
 */
DesignCtrl.prototype.loadImagesAsync = function (ImageService) {
  var designCtrl = this;

  var lockedImage = THEME_URL + '/i/img-locked.png';

  var fullImageSources = [];
  var previewSources = [];
  fullImageSources.push(lockedImage);
  previewSources.push(lockedImage);

  $(this.recentWins.recentWinningSubmissions).each(function () {

    if (this.preview && this.viewable) {
      this.fullImage = this.preview.replace('sbt=small', 'sbt=full');
      fullImageSources.push(this.fullImage);
      previewSources.push(this.preview);
    } else {
      this.preview = lockedImage;
      this.fullImage = lockedImage;
    }
  });

  ImageService.load(previewSources).then(
    function (value) {
      //it will always be resolved, set "loaded" to true when all images have a result.
      designCtrl.previewLoaded = true;
    }
  );

  ImageService.load(fullImageSources).then(
    function (value) {
      //it will always be resolved, set "loaded" to true when all images have a result.
      designCtrl.fullImagesLoaded = true;
    }
  );
};

tc.controller('DesignCtrl', DesignCtrl);