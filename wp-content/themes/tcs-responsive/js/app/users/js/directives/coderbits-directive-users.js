/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCS-ASSEMBLER
 * version 1.0
 */
'use strict';
angular.module('tc.coderbitsDirectives', [])
.directive('tcCoderbits', ['CODERBITS_TEMPLATE_URL', 'CODERBITS_API_HOST', function (CODERBITS_TEMPLATE_URL, CODERBITS_API_HOST) {
  return {
    link : function(scope, element, attr){
      scope.apiHost = CODERBITS_API_HOST;
    },
    restrict: 'E',
    templateUrl:  THEME_URL + CODERBITS_TEMPLATE_URL + '/coderbits.tpl.html'
  }
}])
.directive('tcCoderbitsSection', ['CODERBITS_TEMPLATE_URL', function (CODERBITS_TEMPLATE_URL) {
  return {
    restrict: 'E',
    scope: {
          section: '=page'
    },

    templateUrl:  THEME_URL + CODERBITS_TEMPLATE_URL + '/coderbits-section.tpl.html'
  }
}])
.directive('tcCoderbitsBadges', ['CODERBITS_TEMPLATE_URL','CODERBITS_API_HOST', function (CODERBITS_TEMPLATE_URL, CODERBITS_API_HOST) {
  return {
    restrict: 'A',
    link : function(scope, element, attr){
      scope.badgeCtrl = tc.controller('BadgeCtrl');
    },
  templateUrl:  THEME_URL + CODERBITS_TEMPLATE_URL + '/badge.tpl.html'

  }
}])
.directive('tcCoderbitsItem', ['CODERBITS_TEMPLATE_URL','CODERBITS_API_HOST', function (CODERBITS_TEMPLATE_URL, CODERBITS_API_HOST) {
  return {
    restrict: 'A',
    link : function(scope, element, attr){
      scope.contentUrl = THEME_URL + CODERBITS_TEMPLATE_URL + '/coderbits-' +  scope.section.type + '.tpl.html';
      scope.apiHost = CODERBITS_API_HOST;
      
    },
    scope: {
          tcCoderbitsItem: '=',
          section: '='
      },
      template: '<div ng-include="contentUrl"></div>'
  // templateUrl:  function(elem, attr){
    //      return THEME_URL + CODERBITS_TEMPLATE_URL + '/coderbits-'+attr.type+'.tpl.html'
      //  }
  }

}])
.directive('tcChart', ['CODERBITS_TEMPLATE_URL','CODERBITS_API_HOST', function (CODERBITS_TEMPLATE_URL, CODERBITS_API_HOST) {
  return {
    restrict: 'A',
    link : function(scope, element, attr){

      // Get context with jQuery - using jQuery's .get() method.
      var ctx = element.get(0).getContext("2d");

      var colors = [
        '#acd373',
        '#39b54a',
        '#09baec',
        '#34495e',
        '#e7c318',
        '#c08e37',
        '#dd6b5f',
        '#e12c1a'
      ]

      // This will get the first returned node in the jQuery collection.
      var data = [];
      var ct = 0;
      _.each(scope.items, function(item, idx){
        ct+=item.count;
        data.push({
          value: item.count,
          label: item.name,
          color: colors[idx%colors.length],
          highlight: colors[idx%colors.length]

        })
      })
      _.each(data, function(d,i){
        if(d.value/ct < 0.01) data.splice(i,1);
        d.label =  (d.value/ct).toFixed(2).replace('0.','')+'% - ' + d.label;

      });

      var options = {
          //Boolean - Whether we should show a stroke on each segment
          segmentShowStroke : true,

          //String - The colour of each segment stroke
          segmentStrokeColor : "#fff",

          //Number - The width of each segment stroke
          segmentStrokeWidth : 2,

          //Number - The percentage of the chart that we cut out of the middle
          percentageInnerCutout : 75, // This is 0 for Pie charts

          //Number - Amount of animation steps
          animationSteps : 100,

          //String - Animation easing effect
          animationEasing : "easeOutBounce",

          //Boolean - Whether we animate the rotation of the Doughnut
          animateRotate : true,

          //Boolean - Whether we animate scaling the Doughnut from the centre
          animateScale : false,

          //String - A legend template
          legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%=segments[i].ct%><%}%></li><%}%></ul>"

      }

      var myDoughnutChart = new Chart(ctx).Doughnut(data,options);

      var legend = myDoughnutChart.generateLegend();
      element.parent().append(legend);

    },
    scope: {
          items: '='
      }
  }
}]);