'use strict';

/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCS_ASSEMBLER
 * version 1.0
 */
(function(angular) {
  angular
    .module('tc.shared.directives.upwardsDownwardsAdaptive', [])
    .directive('upwardsDownwardsAdaptive', upwardsDownwardsAdaptive);

    function upwardsDownwardsAdaptive() {
      var directive = {
        link : link
      };
      return directive;

      /**
       * The link function.
       */
      function link (scope, element, attrs) {
        var dropdown = element.find('.dropdown');

        setupEventListeners(dropdown, element);

        function setupEventListeners(dropdown, container){
          container.hover(function () {
            position(dropdown, container);
            dropdown.show();
          });
          
          container.mouseleave(function () {
            dropdown.hide();
          });

          scope.$on('$destroy', function() {
            container.off('hover');
            container.off('mouseleave')
          });
        }


        function position(dropdown, container){
          container.css({'position' : 'relative'});
          dropdown.css({'position' : 'absolute'});

          var css = {bottom : 'auto'};
          if (openUpwards(dropdown , container)) {
              css.top = -dropdown.outerHeight(false);
          } else {
              css.top = container.outerHeight(false);
          }
          dropdown.css(css);
        }


        // The strategy to place above or below is copied from select2.js source code.
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
