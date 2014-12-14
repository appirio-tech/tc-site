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
}]);