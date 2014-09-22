/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: ecnu_haozi
 * version 1.0
 *
 * TODO:
 * - bring up to style guide standards
 */
'use strict';

(function() {

  angular
    .module('tc.SubmissionDirectives', [])

  /**
   * The directive shows a full screen of image when clicking.
   * @ImageService to preload the image.
   */

  .directive('tcFullScreen', function (ImageService) {
    return {
      restrict: 'A',
      link: function(scope, element, attr){
        return new TcFullScreenLinker(scope, element, attr, ImageService);
      }
    }
  })
  /**
   *The directive which enable the jsScrollPane for given div.
   */
  .directive('tcScrollPane', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attr){
        element.jScrollPane({ autoReinitialise: true });
      }
    }
  })
  /**
   * The directive scroll to top of the target div when clicking the <code>element</code>.
   * the target div's id is passed from attr.tcScrollToTop.
   * Usage:
   * <div id="targetId"></div>
   * <a tc-scroll-to-top="#targetId"></a>
   */
  .directive('tcScrollToTop', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attr){
        element.on('click', function(){
          $('html, body').animate({scrollTop:$('#' + attr.tcScrollToTop).offset().top - 20}, 'slow');
        });
      }
    }
  });

  /**
   * The link function of directive tc-full-screen.
   * @scope the scope passed from directive linker function.
   * @element the element passed from directive linker function.
   * @attr the element passed from directive linker function.
   * @ImageService to preload the image.
   */
  var TcFullScreenLinker = function (scope, element, attr, ImageService) {
    var linker = this;
    linker.showSubmissionDiv = $('#showSubmission');
    linker.bgLoadingModalDiv = $('#bgLoadingModal');
    linker.bgOverlapModalDiv = $('#bgOverlapModal');

    element.on('click', function(){
      linker.showLoadingBar();
      var link = scope.subCtrl.singleViewSubmission.fullPreviewList[scope.subCtrl.selectedPreview];
      ImageService.load([link]).then(function(){
        linker.showSubmissionDiv.find('.content img').attr('src',link);
        linker.showModal(element.offset());
      });
    });

    linker.showSubmissionDiv.find('.closePopupModal').on('click', function(){
      linker.hideModal();
    });

    linker.bgOverlapModalDiv.on('click', function(){
      linker.hideModal();
    });
  };

  /**
   * Show loading bar at the center of page.
   */
  TcFullScreenLinker.prototype.showLoadingBar = function(){
    this.bgOverlapModalDiv.show();
    var loading = this.bgLoadingModalDiv.find('span');
    loading.css({
      'margin-top'  : '-' + Math.round(loading.height() / 2) + 'px',
      'margin-left' : '-' + Math.round(loading.width() / 2) + 'px',
    });
    this.bgLoadingModalDiv.show();
  }

  /**
   * Hide the loading bar.
   */
  TcFullScreenLinker.prototype.hideLoadingBar = function(){
    this.bgLoadingModalDiv.hide();
  }

  /**
   * Show full screen image at the center of page.
   * @offset the offset of the trigger button.
   */
  TcFullScreenLinker.prototype.showModal = function(offset){
    if($(window).width() >= 1003 || $('html').is('.ie6, .ie7, .ie8')){
      this.showSubmissionDiv.css({
        'width' : '940px'
      });
    }else {
      this.showSubmissionDiv.css({
        'width' : ($(window).width()-20)+'px'
      });
    }

    var top = - this.showSubmissionDiv.height() / 2 + offset.top;
    var left = - this.showSubmissionDiv.width() / 2 + $(window).width() / 2;
    top = top < 0 ? 0 : top;
    left = left < 0 ? 0 : left;

    this.hideLoadingBar();
    this.showSubmissionDiv.show();

    //The div must be visible before use jQuery .offset() method.
    this.showSubmissionDiv.offset({'top' : top, 'left' : left});
  }

  /**
   * Hide the full screen iamge.
   */
  TcFullScreenLinker.prototype.hideModal = function(){
    this.showSubmissionDiv.hide();
    this.bgOverlapModalDiv.hide();
  }

})();
