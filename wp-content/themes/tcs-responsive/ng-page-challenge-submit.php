<?php
/**
 * Template Name: Challenge Submit Template Using AngularJS
 */

/**
 * @file
 * This file shows challenge submit page using AngularJS
 */

// Add angular libraries
tc_setup_angular();

function tc_header_challenge_submit_js() {
?>
  <script type="text/javascript">
    var challengeId = "<?php echo get_query_var('contestID');?>";
    var challengeType = "<?php echo get_query_var('type');?>";
    var THEME_URL="<?php echo THEME_URL;?>";
  </script>
<?php
}

add_action("wp_head", "tc_header_challenge_submit_js");

get_header();

?>

<div ng-app="tc.submissionUpload" ng-controller="uploadCtrl as uCtrl" class="submitDesign registerForChallenge submitForChallenge" ng-class="{ develop : uCtrl.challengeType === 'develop' }">
    <div class="content">
        <div id="main">
            <article id="mainContent">
                <div class="container" ng-hide="uCtrl.callComplete">
                    <div class="loadingPlaceholder2"></div>
                </div>
                <ng-include src="uCtrl.baseTemplateUrl" ng-show="uCtrl.callComplete"></ng-include>
            </article>
        </div>
        <!-- /#main -->
    </div>
</div>

<?php get_footer(); ?>