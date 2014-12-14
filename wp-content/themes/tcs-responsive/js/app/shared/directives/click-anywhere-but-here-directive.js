/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * @author: TCS_ASSEMBLER
 * @version 1.0
 *
 * This directive execute some logic when there is any click outside the DOM which this directive decorates.
 */

/*jslint nomen: true*/
/*global angular: true, _: true */

(function (angular) {
  'use strict';
  angular
    .module('tc.shared.directives.clickAnywhereButHere', [])
    .directive('clickAnywhereButHere', clickAnywhereButHere);
    
    /**
     * Inject dependencies
     * @type {string[]}
     */
    clickAnywhereButHere.$inject=['$document'];

    /**
     * This directive is typically applied on those pop-up modals. If the user click outside of such an modal, the 
     * 'expression'(attrs.clickAnywhereButHere) will be executed. Specifically here it will dispose the modal.
     *
     * There is also an attribute 'is-active' to indicate when this directive takes effect.
     *
     * The usage:
     * <any click-anywhere-but-here="close()" is-active="valid()" ></any> 
     *
     * @param $document the root place to judge the click/tap events.
     * @return the directive definition object.
     */
    function clickAnywhereButHere($document) {
      var directive = {
        link : link
      };
      return directive;

      /**
       * The link function.
       */
      function link (scope, element, attrs) {
        /*
         * This event handler executes some logic if clicking outside the <code>element</code>.
         * @param event the event object.
         */
        var onClick = function (event) {
          var isChild = element.has(event.target).length > 0;
          var isSelf = element[0] == event.target;
          var isInside = isChild || isSelf;
          if (!isInside) {
            scope.$apply(attrs.clickAnywhereButHere)
          }
        }
        scope.$watch(attrs.isActive, function(value) {
          if (value) {
            $document.bind('click', onClick);
          } else {
            $document.unbind('click', onClick);
          }
        });
      }
    };


})(angular);
