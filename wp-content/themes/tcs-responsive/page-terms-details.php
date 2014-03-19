<?php
/**
 * Template Name: Terms Details Template
 */

$termType = 'detail';
get_header('terms');

?>

  <div class="content">
    <div id="main" class="registerForChallenge">
      <div class="pageTitleWrapper">
        <div class="pageTitle container">
          <h2 class="overviewPageTitle"></h2>
        </div>
      </div>
      <article id="mainContent splitLayout">
        <div class="container">
          <div class="formContent">
            <p class="terms termsText hide">

            </p>
            <p class="terms warning hide"></p>
            <div class="termsBtnRegister"><a href="javascript:;" class="btn">Submit</a></div>
          </div>
        </div>
        <!-- /#end form content-->
    </div>
    </article>
  </div>
  </div>
  <!-- /#mainContent -->
<?php get_footer(); ?>