/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';
angular.module('tc.usersDirectives', [])

/**
 * draw a pie.
 */
.directive('tcChangeUrl', function ($location) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.on('click', function(){
        // 'user' is a global value defined in ng-page-users.php
        //This is a DOM event handler, the angluar framework don't know $location's
        //behavior in such a handler, So we can use it to just update url, but
        //without triggering a reload page event.
        $location.path('/users/' + user + '/' + attr.tcChangeUrl);
      });
    }
  }
})

/**
 * draw a pie.
 */
.directive('tcDrawPie', function ($interpolate, ChartService, $timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {

      scope.$watch('dataCtrl[dataCtrl.subTrack]', function () {

        if (!scope.dataCtrl[scope.dataCtrl.subTrack]){
          return;
        }

        $timeout(function () {
          var option = element.data('option');
          var successRate = parseFloat($interpolate(attr.tcDrawPie)(scope));
          ChartService.drawPie(element, option, successRate);
        });
      });
    }
  }
})

/**
 * draw a history.
 */
.directive('tcDrawHistory', function (ChartService, $timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {

      scope.$watch('dataCtrl[dataCtrl.subTrack].ingestedData', function () {

        if (!scope.dataCtrl[scope.dataCtrl.subTrack] || !scope.dataCtrl[scope.dataCtrl.subTrack].ingestedData){
          return;
        }

        $timeout(function () {
          var ingestedData = scope.dataCtrl[scope.dataCtrl.subTrack].ingestedData;
          ChartService.drawHistory(element, ingestedData);
        });
      });
    }
  }
})

/**
 * draw a distribution.
 */
.directive('tcDrawDistribution', function (ChartService, $timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      scope.$watch('dataCtrl[dataCtrl.subTrack].ingestedData', function () {

        if (!scope.dataCtrl[scope.dataCtrl.subTrack] || !scope.dataCtrl[scope.dataCtrl.subTrack].ingestedData){
          return;
        }

        $timeout(function () {
          var ingestedData = scope.dataCtrl[scope.dataCtrl.subTrack].ingestedData;
          var rating = scope.dataCtrl[scope.dataCtrl.subTrack].rating;
          ChartService.drawDistribution(element, ingestedData, rating);
        });
      });
    }
  }
})

/*
 * This directive render the Carousel when all slides' DOM have been loaded.
 *
 * The DOM should be like:
 * <div class="slider">
 *      <div class="slide" ng-repeat="...">...</div>
 * </div>
 * This directive should be apply on <slide> element.
 */

.directive('tcRenderCarousel', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {

        $timeout(function(){
          var slider = element.parent();
          var sliderScope = scope.$parent;

          slider.iCarousel({
            slides: 5,
            dir: 'rtl',
            easing: 'ease-in-out',
            slidesSpace: 190,
            mouseWheel: false,
            onAfterChange: function () {
              // This function is out of angular framework, So use $apply to notify angular.
              sliderScope.$apply(sliderScope.designCtrl.displaySlide(this.defs.slide));
            },
            onAfterLoad: function(){
              sliderScope.$apply(sliderScope.designCtrl.setCarouselRendered(true));
            }
          });


        });

      }
    }
  }
})

/**
 * This directive select the Carousel's slides.
 *
 * The DOM should be like:
 * <div class="submissionCarousel">
 *      <div class="slider"></div>
 *      ....
 *          <a tc-go-slide>...</a>
 *          <a tc-go-slide>...</a>
 * </div>
 * This directive should be apply on <a> element.
 */

.directive('tcGoSlide', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.off('click').on('click', function () {
        var slider = element.parents('.submissionCarousel').find('.slider');
        slider.trigger('iCarousel:goSlide', scope.$index);
      });
    }
  }
})
.directive('tcRatings', ['CODERBITS_TEMPLATE_URL','CODERBITS_API_HOST', function (CODERBITS_TEMPLATE_URL, CODERBITS_API_HOST) {
  return {
    restrict: 'A',
    scope: {
          tcRatings: '='
      },
    link: function (scope, element, attr) {
  alert(scope.parent)
      
    },
    templateUrl:  THEME_URL + CODERBITS_TEMPLATE_URL + '/ratings.tpl.html'
  }
}]);