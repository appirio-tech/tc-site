/**
 * This code is copyright (c) 2014 Topcoder Corporation
 *
 * Changes in version 1.1 (Enhanced Member Profile Bugs Fixing):
 * - Updated to show overview tab on default.
 * - Showing mastery only if values are greater than 0.
 *
 * author: shubhendus, TCSASSEMBLER
 * version 1.1
 */
'use strict';
/**
 * The main controller for users page.
 */
angular.module('tc').controller('UsersCtrl', ['$location', '$state', '$scope', 'UsersService', 'CoderbitsService',
  'ColorService',  "PHOTO_LINK_LOCATION", "USERS_TEMPLATE_URL", "cfpLoadingBar", "$q",

  function ($location, $state, $scope, UsersService, CoderbitsService, ColorService,
    PHOTO_LINK_LOCATION, USERS_TEMPLATE_URL, cfpLoadingBar, $q) {

    //setter. work fine in different scope with closure
    $scope.setTrack = function (value) {
      $scope.track = value;
    };

    //setter. work fine in different scope with closure
    $scope.setSubTrack = function (value) {
      $scope.subTrack = value;
    };

    //switch between different tabs.
    $scope.switchTab = function(state, track, subTrack){
      $scope.setTrack(track);
      $scope.setSubTrack(subTrack);
      $state.go(state);
    }

    $scope.showAsTable = true;
    //setter. work fine in different scope with closure
    $scope.showTable = function (value) {
      $scope.showAsTable = value;
    };

    $scope.showAsDist = false;
    $scope.showAsHist = true;

    $scope.showDist = function () {
      $scope.showAsTable = false;
      $scope.showAsDist = true;
      $scope.showAsHist = false;
    };

    $scope.showHist = function () {
      $scope.showAsTable = false;
      $scope.showAsHist = true;
      $scope.showAsDist = false;
    };

    $scope.getRatingColor = function (rating) {
      return ColorService.getRatingColor(rating);
    };

    // Returns a url for coder's profile. Returns default photo when coder has no pic.
    $scope.getPhotoLink = function (coder) {
        if (coder && coder.photoLink !== '') {
        if (coder.photoLink.indexOf('//') != -1){
          return coder.photoLink;
        }
        return PHOTO_LINK_LOCATION + coder.photoLink;
      }
      return THEME_URL + '/i/default-photo.png';
    };

    // This template will be loaded by ng-include in the page.
    // Using this as the complete app is not angular based, routing will create dead links with HTML5 mode.
    // THEME_URL is defined in ng-page-users.php
    $scope.templateUrl = THEME_URL + USERS_TEMPLATE_URL;

    var regex = /users\/([^\/]+)\/?([^\/]+)\/?$/;
    var found = $location.absUrl().match(regex);
    var tab = found[2];

    var getTCUser = function() {
      UsersService.getUser(user).then(function (user) {
        $scope.coder = user;
        //var cat =  _.max(user.ratingSummary, function(category){ return category.rating; });
        $scope.userExisted = true;
        $scope.tcUserDataRetrieved = true;
      }, function errorCallback(){
        $scope.coder = {};
        $scope.userExisted = false;
        $scope.tcUserDataRetrieved = true;
        $scope.cbUserDataRetrieved = true;
      });
    }

    var getCBUser = function() {
      CoderbitsService.getUser(user).then(function (coderbits){

        $scope.coderbitsUserExisted = (typeof coderbits.name !== 'undefined');
        $scope.showBadge = ($scope.showDesign + $scope.showDevelop + $scope.showData) > 0;
        $scope.showMastery = $scope.mastery.length > 0;

        //Uncomment to activate design tab for hybrid coderbits design portfolio.
        //$scope.showDesign = ($scope.coderbitsUserExisted && coderbits.showDesigns);
        if((!tab || ['algorithm', 'marathon', 'design', 'overview', 'develop'].indexOf(tab) === -1) && mastery) {
          // If Coderbits account linked and data exists show default tab
          if ($scope.coderbitsUserExisted && coderbits.accounts.length > 0) {
            tab = 'overview';
          } else {
            tab = mastery.category.toLowerCase();
          };

          if(tab === 'data') {
            tab = mastery.name.toLowerCase();
            if(tab === 'srm') tab = 'algorithm';
          }
        }

        switch (tab) {
          case 'algorithm':
          case 'marathon':
            $scope.switchTab('base.common.dataScience.special', 'dataScience', tab);

            break;
          case 'design':
            $scope.switchTab('base.common.design', 'design', undefined);

            break;
          case 'overview':
            $scope.switchTab('base.common.overview', 'overview', undefined);

            break;
          case 'develop':
          case 'development':
            $scope.switchTab('base.common.develop.special', 'develop', undefined);

            break;
          default:
            if(!$scope.showDevelop || $scope.coderbitsUserExisted) {
              $scope.switchTab('base.common.overview', 'overview', undefined);
            } else {
              $scope.switchTab('base.common.develop.special', 'develop', undefined);
              $scope.cbUserDataRetrieved = true;
            }
            break;
        }

        $scope.showTrackNav = ($scope.coderbitsUserExisted + $scope.showDesign + $scope.showDevelop + $scope.showData) > 1;
        $scope.coderbits = coderbits;
        $scope.cbUserDataRetrieved = true;
      }, function errorCallback(e){
        $scope.cbUserDataRetrieved = true;
        $scope.coderbitsUserExisted = false;
        $scope.coderbits = {};
      });
    }
    
    $scope.userExisted = true;
    $scope.tcUserDataRetrieved = false;
    $scope.cbUserDataRetrieved = false;
    var mastery = false;
    $scope.mastery = [];
    // Get the user's profile. 'user' is defined in ng-page-users.php 
    UsersService.getMastery(user).then(function(resp){
      mastery = resp.mastery;
      $scope.showDesign = resp.showDesignSection;
      $scope.showDevelop = resp.showDevelopSection;
      $scope.showData = resp.showDataSection;

      if(mastery.rating) {
        $scope.mastery.push({
          label: 'Rating',
          value: mastery.rating,
          category: mastery.category,
          track: mastery.ratingName || mastery.name
        });
        if(mastery.wins > 0){
          $scope.mastery.push({
            label: 'Wins',
            value: mastery.wins,
            category: mastery.category,
            track: mastery.name
          });
        }
      } else {
        if(mastery.wins > 0) {
          $scope.mastery.push({
            label: 'Wins',
            value: mastery.wins,
            category: mastery.category,
            track: mastery.name
          });
        }
        if (mastery.submissions > 0) {
          $scope.mastery.push({
            label: 'Submissions',
            value: mastery.submissions,
            category: mastery.category,
            track: mastery.name
          });
        };
      }

      getTCUser();
      getCBUser();      
    }, function(e){
      getTCUser();
      getCBUser();
    });
  }
]);
