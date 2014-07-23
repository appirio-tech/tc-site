/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */
'use strict';
/**
 * The main controller for member-profile page.
 */
tc.controller('MemberProfileCtrl', ['$location', '$state', '$scope', 'MemberProfileService',
  'ColorService', "PHOTO_LINK_LOCATION", "MEMBER_PROFILE_TEMPLATE_URL",

  function ($location, $state, $scope, MemberProfileService, ColorService,
    PHOTO_LINK_LOCATION, MEMBER_PROFILE_TEMPLATE_URL) {

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


    $scope.getRatingColor = function (rating) {
      return ColorService.getRatingColor(rating);
    };

    // Returns a url for coder's profile. Returns default photo when coder has no pic.
    $scope.getPhotoLink = function (coder) {
      if (coder && coder.photoLink !== '') {
        return PHOTO_LINK_LOCATION + coder.photoLink;
      }
      return THEME_URL + '/i/default-photo.png';
    };

    // This template will be loaded by ng-include in the page.
    // Using this as the complete app is not angular based, routing will create dead links with HTML5 mode.
    // THEME_URL is defined in ng-page-member-profile.php
    $scope.templateUrl = THEME_URL + MEMBER_PROFILE_TEMPLATE_URL;

    var regex = /member-profile\/([^\/]+)\/?([^\/]+)\/?$/;
    var found = $location.absUrl().match(regex);
    var tab = found[2];
    switch (tab) {
    case 'algorithm':
    case 'marathon':
      $scope.switchTab('base.common.dataScience.special', 'dataScience', tab);

      break;
    case 'design':
      $scope.switchTab('base.common.design', 'design', undefined);

      break;
    default:
      $scope.switchTab('base.common.develop.special', 'develop', undefined);
    }

    // Get the user's profile. 'user' is defined in ng-page-member-profile.php
    MemberProfileService.getUser(user).then(function (user) {
      $scope.coder = user;
    }, function errorCallback(){
      $scope.coder = {};
    });

  }
]);