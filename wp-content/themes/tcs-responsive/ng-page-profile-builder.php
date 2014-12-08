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

      <h2>Build your profile</h2>

      <a ui-sref="hide" ng-show="PB.currentView == 'base'">Skills Found</a>
      <a ui-sref="base" ng-show="PB.currentView == 'hide'">External Accounts</a>

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