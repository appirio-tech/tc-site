<?php
/**
 * Template Name: Member Profile Using AngularJS
 */

/**
 * @file
 * This file shows member profile using AngularJS
 */

// Add angular libraries
tc_setup_angular();

// Get the default header
if (!isset($handle) ) {
  wp_redirect(site_url('404.php'));
  exit;
}
get_header();

?>

<script>var user="<?php echo $handle;?>";var THEME_URL="<?php echo THEME_URL;?>";</script>

<div class="content" ng-app="tc" ng-controller="MemberProfileCtrl">
	<div id="main" class="coderProfile">
    <ng-include src="templateUrl"></ng-include>

		<article id="mainContent" class="noShadow">
			<article class="coderRatings">
				<div class="container">
					<div class="actions" ng-class="{'trackdesign' : track === 'design'}">
						<ul class="trackSwitch switchBtns">
							<li class="first"><a ng-click="switchTab('base.common.design', 'design', undefined);" ng-class="{ isActive : $state.includes('**.design.**') }" tc-change-url="design">Design</a></li>
							<li><a ng-click="switchTab('base.common.develop.special', 'develop', undefined);" ng-class="{ isActive : $state.includes('**.develop.**') }" tc-change-url="develop">Develop</a></li>
							<li class="last"><a ng-click="switchTab('base.common.dataScience.special', 'dataScience', 'algorithm');" ng-class="{ isActive : $state.includes('**.dataScience.**') }" tc-change-url="algorithm">Data Science</a></li>
						</ul>
						<!-- /.trackSwitch -->
						<ul class="viewSwitch switchBtns">
							<li class="graphView first"><a id="graphButton" ng-click="showTable(false)" ng-class="{isActive : !showAsTable}"></a></li>
							<li class="tabularView last"><a id="tableButton" ng-click="showTable(true)" ng-class="{isActive : showAsTable}"></a></li>
						</ul>
					</div>
					<!-- /.actions -->
					<div ui-view class="dataTabs">
						<div class="loadingPlaceholder2"></div>
					</div>
					<!-- /.dataTabs -->
				</div>
				<div class="clear"></div>
				<div class="forumWrap hide">
						<?php // get_template_part('content', 'forum');?>
				</div>
				<!-- /.forumWrap -->
			</article>
			<!-- /.coderRatings -->
		</article>
		<!-- /#mainContent -->
<?php get_footer(); ?>
