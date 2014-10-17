'use strict';

/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */

/*jslint nomen: true*/
/*global angular: true, _: true */
(function() {

  angular
    .module('tc.shared.directives.tcScrollToTop', [])

  /**
   * The directive scroll to top of the target div when clicking the <code>element</code>.
   * the target div's id is passed from attr.tcScrollToTop.
   * Usage:
   * <div id="targetId"></div>
   * <a tc-scroll-to-top="targetId"></a>
   */
  .directive('tcScrollToTop', ['$timeout',
    function($timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          element.on('click', function() {
            $timeout(function() {
              $('html, body').animate({
                scrollTop: $('#' + attr.tcScrollToTop).offset().top - 20
              }, 'slow');
            });
          });
        }
      }
    }
  ]);

})();