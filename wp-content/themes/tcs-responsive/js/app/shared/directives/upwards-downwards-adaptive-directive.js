/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * @author: TCS_ASSEMBLER
 * @version 1.0
 *
 * This directive can adaptively put the pop-up modal upwards or downwards. When put downwards, the pop-up is right
 * below the container, when put upwards, the pop-up is right above the container.
 *
 * The usage:
 * <any class="container" upwards-downwards-adaptive>
 *    <any class="pop-up-modal dropdown"></any>
 * </any>
 *
 * The css class 'dropdown' is required, other css classes are optional.
 */

/*jslint nomen: true*/
/*global angular: true, _: true */

(function(angular) {
  'use strict';
  angular
    .module('tc.shared.directives.upwardsDownwardsAdaptive', [])
    .directive('upwardsDownwardsAdaptive', upwardsDownwardsAdaptive);

  /**
   * This function defines the directive upwardsDownwardsAdaptive.
   * @return the directive definition object.
   */
  function upwardsDownwardsAdaptive() {
    var directive = {
      link: link
    };
    return directive;

    /**
     * The link function.
     */
    function link(scope, element, attrs) {
      var dropdown = element.find('.dropdown');

      setupEventListeners(dropdown, element);
      /*
       * Show the pop-up modal when mouse hovers on the reference DOM, hide it when mouse leaves.
       * @param dropdown the pop-up modal
       * @param container the reference DOM. i.e., when put downwards, the pop-up is right below this DOM, when put
       * upwards, the pop-up is right above this DOM.
       */
      function setupEventListeners(dropdown, container) {
        container.hover(function() {
          position(dropdown, container);
          dropdown.show();
        });

        container.mouseleave(function() {
          dropdown.hide();
        });

        scope.$on('$destroy', function() {
          container.off('hover');
          container.off('mouseleave')
        });
      };

      /*
       * This function can adaptively put the pop-up modal upwards or downwards.
       * @param dropdown the pop-up modal
       * @param container the reference DOM. i.e., when put downwards, the pop-up is right below this DOM, when put
       * upwards, the pop-up is right above this DOM.
       */
      function position(dropdown, container) {
        container.css({
          'position': 'relative'
        });
        dropdown.css({
          'position': 'absolute'
        });

        var css = {
          bottom: 'auto'
        };
        if (openUpwards(dropdown, container)) {
          css.top = -dropdown.outerHeight(false);
        } else {
          css.top = container.outerHeight(false);
        }
        dropdown.css(css);
      };

      /*
       * This function decides to show to pop-up modal upwards or downwards. The strategy to place above or below is
       * copied from select2.js source code.
       * @param dropdown the pop-up modal
       * @param container the reference DOM. i.e., when put downwards, the pop-up is right below this DOM, when put
       * upwards, the pop-up is right above this DOM.
       * @return true if upwards, false otherwise.
       */
      function openUpwards(dropdown, container) {
        var offset = container.offset(),
          height = container.outerHeight(false),
          dropHeight = dropdown.outerHeight(false),
          $window = $(window),
          windowHeight = $window.height(),
          viewportBottom = $window.scrollTop() + windowHeight,
          dropTop = offset.top + height,
          enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
          enoughRoomAbove = offset.top - dropHeight >= $window.scrollTop();

        // Default is below, if below is not enough, then show above.
        return !enoughRoomBelow && enoughRoomAbove;
      };
    }
  };


})(angular);
