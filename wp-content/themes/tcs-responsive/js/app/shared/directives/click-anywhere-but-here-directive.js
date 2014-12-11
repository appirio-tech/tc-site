'use strict';

/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCS_ASSEMBLER
 * version 1.0
 */
(function(angular) {
  angular
    .module('tc.shared.directives.clickAnywhereButHere', [])
    .directive('clickAnywhereButHere', clickAnywhereButHere);
    
    /**
     * Inject dependencies
     * @type {string[]}
     */
    clickAnywhereButHere.$inject=['$document', '$timeout'];

    /**
     * This directive is applied on those pop-up modal. If the user click outside of such an modal, the 'expression'
     * will be executed. Specifically here it will dispose the modal.
     * There is also an attribute 'is-active' to indicate when this directive takes effect.
     *
     * The usage:
     * <any click-anywhere-but-here="close()" is-active="valid()" ></any> 
     *
     * @param $document the root place to judge the click/tap events.
     * @param $timeout to defer the activation of this directive so we can ignore the first bootstrap click.
     * @return the directive definition object.
     */
    function clickAnywhereButHere($document, $timeout) {
      var directive = {
        link : link
      };
      return directive;

      /**
       * The link function.
       */
      function link (scope, element, attrs) {
        var onClick = function (event) {
          var isChild = element.has(event.target).length > 0;
          var isSelf = element[0] == event.target;
          var isInside = isChild || isSelf;
          if (!isInside) {
            scope.$apply(attrs.clickAnywhereButHere)
          }
        }
        scope.$watch(attrs.isActive, function(newValue, oldValue) {
          if (newValue !== oldValue && newValue == true) {
            /*
             * The situation is that there is an external button when clicking it this modal will show, To defer the 
             * activation of this directive so that we can ignore the first bootstrap click. Otherwise the first click
             * will be treated as an outside-click and thus close the modal immediately.
             */
            $timeout(function(){
              $document.bind('click', onClick);
            });
          } else if (newValue !== oldValue && newValue == false) {
            $document.unbind('click', onClick);
          }
        });
      }
    };


})(angular);
