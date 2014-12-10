/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */

'use strict';

(function(angular) {

  var profileBuilder = angular.module('tc.profileBuilder');
  profileBuilder.controller('profileBuilderCtrl', ['ProfileBuilderService', '$scope', '$state', '$timeout', '$cookies', '$location',
    function (ProfileBuilderService, $scope, $state, $timeout, $cookies, $location) {

      var vm = this;
      vm.scope = $scope;

      // Coderbits api url
      vm.cbUrl = cbApiURL;

      // for showing the loading bar on page load
      vm.callComplete = false;

      // update current view name upon state change
      vm.scope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
          $state.current = toState;
          vm.currentView = $state.current.name;
          vm.pageTitle = $state.current.title;
        }
      )

      var params = {};

      //fetch data from api only if logged in else show login modal
      if (app.isLoggedIn()) {

        // for initial page load fetch all accounts
        params.page_size = 100;
        ProfileBuilderService.getAccounts(params).then(function (accounts) {

          vm.callComplete = true;

          // remove first 3 items (topcoder, bitly, twitter social)
          // no need for topcoder and bitly, twitter social api is not complete
          vm.accounts = accounts.items.splice(3, accounts.items.length);
          delete params.page_size;

          // get integrated accounts for the user
          ProfileBuilderService.getIntegrations().then(function (integratedAccounts) {
            // map through all accounts and update them using user's integrated account data
            vm.integratedAccounts = integratedAccounts;
            _.map(vm.accounts, function (account) {
              var integratedAccount = _.find(vm.integratedAccounts, function(tempAccount) { return tempAccount.id == account.id});
              if (integratedAccount) {
                if (integratedAccount.username) {
                  account.username = integratedAccount.username;
                  account.linking = false;
                }
                else {
                  account.linking = true;

                  ProfileBuilderService.updateOAuth(account.id).then(function (response) {
                    ProfileBuilderService.checkIntegration(account.id).then(function (response) {
                      account.username = response.username;
                      account.integratedLink = response.link;
                      account.last_updated = response.last_updated;
                      account.linking = false;
                    })
                  })
                }

                account.last_updated = integratedAccount.last_updated;
                account.integratedLink = integratedAccount.link;
              };
            });
          })
        });

        // Get user skills for skill hide page
        ProfileBuilderService.getSkills().then(function (response) {
          vm.userSkills = response;
        });
      } else {
        showModal('#login');
      }

      vm.unLink = unLink;
      /**
       * Unlinks the account
       *
       * @param account
       */
      function unLink(account) {

        if (confirm('Are you sure you want to unlink this account? Upon unlinking all your data will be removed. This includes historical and statistical information that cannot be retrieved when linking again.')) {
          account.loading = true;
          ProfileBuilderService.removeIntegration(account.id).then(function (response) {
            account.loading = false;
            delete account.username;
            delete account.last_updated;
            delete account.integratedLink;
          })
        };
      }

      var delay = 400;
      var timer = false;

      vm.checkLink = checkLink;
      /**
       * Checks if specified username can be integrated
       *
       * @param account
       * @param usernameInput
       */
      function checkLink(account, usernameInput) {
        if (!usernameInput.length) {
          account.linkable = false;
          return false;
        };
        if(timer){
          $timeout.cancel(timer);
        }
        timer = $timeout(function(){
          account.linkable = false;
          account.loading = true;
          params.username = usernameInput;
          params.accountId = account.id;
          ProfileBuilderService.checkAccount(params).then(
            function (response) {
              account.loading = false;
              account.linkable = true;
          }, function (reason) {
              account.loading = false;
              account.linkable = false;
          })
        }, delay)
      };

      vm.linkAccount = linkAccount;
      /**
       * Links account to user's profile
       *
       * @param account
       */
      function linkAccount(account) {
        if (account.linkable && account.usernameInput) {
          account.loading = true;
          account.linking = true;
          ProfileBuilderService.addIntegration(account.id, account.usernameInput).then(function (response) {
            ProfileBuilderService.checkIntegration(account.id).then(function (response) {
              account.username = response.username;
              account.integratedLink = response.link;
              //account.last_updated = response.last_updated;
              account.loading = false;
              account.linking = false;
            })
          })
        };
      }

      vm.authAccount = authAccount;
      /* For linking account using oAuth
       * for github and bitbucket show permission modal first
       * for others redirect them
       *
       * @param account
       */
      function authAccount(account) {
        vm.tcjwt = $cookies.tcjwt.replace(/["]/g, "");
        vm.callback = '//' + $location.host() + '/account/integrations';
        if (account.oAuthAllowed) {
          if (account.name == 'github') {
            showModal('#githubPermission');
          } else if (account.name == 'bitbucket') {
            showModal('#bitbucketPermission');
          } else {
            window.location = cbApiURL + '/auth?provider=' + account.oAuthAction + '&tcjwt=' + vm.tcjwt + '&cb=' + vm.callback;
          }
        };
      }

      vm.changeSkillVisibility = changeSkillVisibility;
      /**
       * Changes skill visibility i.e if hidden then show it and vice-versa
       *
       * @param skill
       */
      function changeSkillVisibility(skill) {
        if (skill.Hidden) {
          ProfileBuilderService.hideSkill(skill.SkillTagId);
        } else {
          ProfileBuilderService.showSkill(skill.SkillTagId);
        }
      }

      vm.getTemplateUrl = getTemplateUrl;
      /**
       * generates template url for loading them through ng-include
       *
       * @param templatename
       * @returns templateUrl
       */
      function getTemplateUrl(template) {
        return base_url + '/js/app/profile-builder/partials/' + template;
      }

    }

  ]);
}(angular));
/*
 * currently ui.bootstrap popover directive does not support html in popover body
 * https://github.com/angular-ui/bootstrap/issues/220
 * for now using custom template
 * it updates popover template for binding trusted html
 */
angular.module("template/popover/popover.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/popover/popover.html",
      "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
      "  <div class=\"arrow\"></div>\n" +
      "\n" +
      "  <div class=\"popover-inner\">\n" +
      "      <h3 class=\"popover-title\" ng-bind-html=\"title | trust\" ng-show=\"title\"></h3>\n" +
      "      <div class=\"popover-content\"ng-bind-html=\"content | trust\"></div>\n" +
      "  </div>\n" +
      "</div>\n" +
      "");
}]);