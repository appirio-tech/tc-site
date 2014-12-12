<?php
/**
 * Template Name: Account Profile Builder Using AngularJS
 */

/**
 * @file
 * This file build account profile using AngularJS
 */

// Add angular libraries
tc_setup_angular();

// Get the default header
get_header();
?>
<section class="container" id="top">
  <div class="loadingPlaceholder2" ng-class="{hidden : PB.callComplete}"></div>
  <div class="row opportunity-header opportunity-header-new hidden" ng-class="{visible : PB.callComplete}">
    <div class="title">

      <h2 class="builder-left">Account Integrations</h2>

      <a ui-sref="hide" ng-show="PB.currentView == 'base'" class="builder-right">Skills Found</a>
      <a ui-sref="base" ng-show="PB.currentView == 'hide'" class="builder-right">External Accounts</a>

      <div class="builder-clear"></div>
    </div>
  </div>
  <div ui-view class="hidden" ng-class="{visible : PB.callComplete}"></div>
  <div id="back-top" class="hidden" ng-class="{visible : PB.callComplete}">
	<div>
	  <a tc-scroll-to-top="top" tooltip-placement="left" tooltip="Top" tooltip-append-to-body="true"><i class="icon-arrow-up icon-white"></i></a>
	</div>
  </div>
</section>
<?php get_footer(); ?>