/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCS-ASSEMBLER
 * version 1.0
 */
'use strict';
angular.module('tc.badgeMemberProfileDirectives', [])

/**
 * Add a badge tooltip.
 */
.directive('tcBadgeTooltip', function ($timeout) {
  return {
    restrict: 'A',
    link : function(scope, element, attr){
      return new TcBadgeTooltipDirective(scope, element, attr);
    }
  }
});

/**
 * The link function of directive tc-badge-tooltip
 */
var TcBadgeTooltipDirective = function (scope, element, attr) {

  var tooltipHtml = $('#badgeTooltip');

  var tooltipFn = this;

  element.on('mouseenter', function(){
    tooltipFn.populateTooltip(scope, tooltipHtml, attr);

    tooltipHtml.css('z-index', '-2000');
    tooltipHtml.show();
    var ht = tooltipHtml.height();
    var wt = tooltipHtml.width() - element.width();
    var top  = element.offset().top - ht - 10;
    var lt = element.offset().left - wt / 2;
    tooltipHtml.offset({left : lt, top : top});
    tooltipHtml.css('z-index', '2000');
  });

  element.on('mouseleave', function(){
    tooltipHtml.hide();
  });
}
/**
 * Populate data into tooltip.
 */
TcBadgeTooltipDirective.prototype.populateTooltip = function(scope, tooltipHtml, attr){
    var options = this.getOptions(scope, attr);

    //console.log(options);

    tooltipHtml.find('header').html(options.title);
    if(!options.date){
      tooltipHtml.find('.earnedOn').html('Not Earned Yet');
    }else{
      tooltipHtml.find('.earnedOn').html('Earned on ' + options.date);
    }
    if(!options.current){
      tooltipHtml.find('.currentlyEarned').hide();
    }else{
      tooltipHtml.find('.currentlyEarned').show().html('Currently @ ' + options.current);
    }

}
/**
 * Parse data from the DOM attribute.
 */
TcBadgeTooltipDirective.prototype.getOptions = function(scope, attr){
  var text = attr.tcBadgeTooltip.split(' ');
  var options = {};
  options.current = scope.$eval(text[0]);
  options.date = scope.$eval(text[1]);
  options.title = scope.$eval(text[2]);
  return options;
}
