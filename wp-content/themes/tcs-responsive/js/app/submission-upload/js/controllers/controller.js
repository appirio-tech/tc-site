'use strict';

/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */

/*jslint nomen: true*/
/*global angular: true, _: true */
(function(angular) {
  'use strict';
  var submissionUpload = angular.module('tc.submissionUpload');
  submissionUpload.controller('uploadCtrl', ['ChallengeService', '$scope',

    function(ChallengeService, $scope) {
      /* jshint validthis: true */
      var vm = this;

      vm.callComplete = false;
      vm.challenge = {};
      vm.challengeId = challengeId;
      vm.challengeType = challengeType;

      var CHALLENGE_SUBMIT_PARTIALS_DIR = '/js/app/submission-upload/partials/';
      vm.baseTemplateUrl = THEME_URL + CHALLENGE_SUBMIT_PARTIALS_DIR + 'base.tpl.html';
      vm.developTemplateUrl = THEME_URL + CHALLENGE_SUBMIT_PARTIALS_DIR + 'develop-submit.tpl.html';
      vm.designTemplateUrl = THEME_URL + CHALLENGE_SUBMIT_PARTIALS_DIR + 'design-submit.tpl.html';
      vm.designUploadedTemplateUrl = THEME_URL + CHALLENGE_SUBMIT_PARTIALS_DIR + 'design-uploaded.tpl.html';

      vm.termsAgreed = false;

      vm.uploadState = 'none';
      /*states : none, uploading, success, fail*/
      vm.setUploadState = setUploadState;

      ChallengeService
        .getChallenge(challengeId)
        .then(function(challenge) {
          vm.callComplete = true;
          vm.challenge = challenge;
          vm.stockArtAllowed = challenge.allowStockArt;
          vm.type = setType(challenge.phases);
        });

      /*Only for design-submit.*/
      if (vm.challengeType === 'design') {
        vm.addFont = addFont;
        vm.fonts = [{
          site: '',
          name: '',
          url: ''
        }];

        vm.addStockArt = addStockArt;
        vm.stockArts = [{
          photo: '',
          number: '',
          url: ''
        }];

        vm.fontOptions = setFontOptions();
        vm.rank = 1;
        vm.thumbnail = THEME_URL + '/i/thumbnail.png';
        vm.viewSubmission = false;
      }

      function addFont() {
        vm.fonts.push({
          site: '',
          name: '',
          url: ''
        });
        $scope.$broadcast('jqtransform-select');
      }

      function addStockArt() {
        vm.stockArts.push({
          photo: '',
          number: '',
          url: ''
        });
      }

      function setFontOptions() {
        return [{
          select: '',
          label: 'Choose from this menu'
        }, {
          select: 'Studio Standard Fonts list',
          label: 'Studio Standard Fonts list'
        }, {
          select: 'Fonts.com',
          label: 'Fonts.com'
        }, {
          select: 'MyFonts',
          label: 'MyFonts'
        }, {
          select: 'Adobe Fonts',
          label: 'Adobe Fonts'
        }, {
          select: 'Font Shop',
          label: 'Font Shop'
        }, {
          select: 'T.26 Digital Type Foundry',
          label: 'T.26 Digital Type Foundry'
        }, {
          select: 'Font Squirrel',
          label: 'Font Squirrel'
        }, {
          select: 'Linotype',
          label: 'Linotype'
        }, {
          select: 'Typography.com',
          label: 'Typography.com'
        }, {
          select: 'No New Fonts',
          label: 'I did not introduce any new fonts'
        }];
      }

      function setType(phases) {
        var type = 'submission';
        $.each(phases, function(index, phase) {
          if (phase.type === 'Checkpoint Submission' && phase.status === 'Open') {
            type = 'checkpoint';
          }
        });
        return type;
      }

      function setUploadState(state) {
        vm.uploadState = state;
      }
    }
  ]);
}(angular));