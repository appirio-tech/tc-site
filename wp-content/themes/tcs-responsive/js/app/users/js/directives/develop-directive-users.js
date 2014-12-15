/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCS-ASSEMBLER
 * version 1.0
 */
'use strict';
angular.module('tc.developUsersDirectives', [])

/**
 * Add a badge tooltip.
 */
.directive('tcAdjustHeader', function ($timeout) {
  return {
    restrict: 'A',
    link : function(scope, element, attr){
      return new TcAdjustHeaderDirective(scope, element, attr, $timeout);
    }
  }
});

/**
 * The link function of directive tc-adjust-header.
 */
var TcAdjustHeaderDirective = function (scope, element, attr, $timeout) {
  var directive = this;
  if (scope.$last === true) { 
    $timeout(function() {
      var header = element.parent();
      if(!directive.nowrap(header)) {
        directive.adjustHeader(header);
      }
    });
  }
};

/**
 * An method which use binary-search algorithm to find the best font-size.
 */
 
TcAdjustHeaderDirective.prototype.adjustHeader = function(header) {
  var directive = this;
  var low = 0, high = 100, result = 100;
  while(low <= high){
    //keep the middle as an integer
    var middle = Math.floor(( low + high ) / 2); 
    //try middle percentage.
    header.css('font-size', middle + '%');
    //force the element to repaint, so we can execute business logic when css() takes effect.
    header.hide().show(0);
    if(directive.nowrap(header)) {
      result = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  header.css('font-size', result + '%');
};

/**
 * Test if the header don't wrap, true indicate no wrap.
 */

TcAdjustHeaderDirective.prototype.nowrap = function(header) {
  var prev = -1, now = 0, wrap = false;
  header.find('li').each(function() {
    now = $(this).offset().left;
    if(now <= prev) {
      wrap = true;
    }
    prev = now;
  });
  return !wrap;
};
