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
    .module('tc.submissionUpload')

  /**
   *The directive which jqTransform for given element.
   *
   * jqTransform has few contributors and thus its functoins is fragile and not flexible. So this directive is
   * restricted to the root form element.
   *
   * When a select is added (in fonts uploader section), It needs tranformation by jqTransform. An message
   * 'jqtransform-select' is used to notify such an event. The event handler will re-transform all selects, based on
   * current jqTransform logic.
   *
   * The tc-site code base have an existing jquery.jqtransform.js before this assembly. While this assembly introduce a
   * different one in ui-prototype, some issues such as $.browser is deprecated is fixed in latter one. So I adopted the
   * latter one and named it jquery.jqtransform.v2.js.
   */
  .directive('tcJqTransform', ['$timeout',
    function($timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          $timeout(function() {
            element.jqTransform();
          });
          scope.$on('jqtransform-select', function() {
            $timeout(function() {
              element.removeClass('jqtransformdone');
              element.jqTransform();
            });
          });
        }
      }
    }
  ]);
})();