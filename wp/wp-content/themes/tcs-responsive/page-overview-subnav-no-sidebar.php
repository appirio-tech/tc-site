<?php
/**
 * Template Name: Overview with subnav no sidebar template
 */
?>
<?php

get_header ();

$values = get_post_custom ( $post->ID );

$userkey = get_option ( 'api_user_key' );
$siteURL = site_url ();
?>

<script type="text/javascript">
  var siteurl = "<?php bloginfo('siteurl');?>";
</script>
<div class="content">
  <div id="main">

    <?php

if (have_posts ()) :
the_post ();
$quote = get_post_meta ( $post->ID, "Quote", true );
$qAuthor = get_post_meta ( $post->ID, "Quote author", true );
    ?>
    <!-- Start Overview Page-->
    <div class="pageTitleWrapper">
      <div class="pageTitle container">
        <h2 class="overviewPageTitle"><?php the_title();?></h2>
      </div>
      <div class="blogCategoryWrapper">
        <div class="container">
          <div class="innerWrapper">
            <div class="blogCategoryMenu">
              <?php
				$childPages = get_pages( array( 'child_of' => $post->ID, 'sort_column' => 'post_date', 'sort_order' => 'desc' ) );
				if($childPages!=null)
				  foreach( $childPages as $page ):
              ?>
              <a href="<?php echo get_page_link( $page->ID );?>" class=""><?php echo $page->post_title;?></a>
              <?php endforeach; ?>
            </div>
            <ul class="blogMenuMobile">
              <div class="default">-- navigate to --<span class="arrow"></span></div>
              <div class="current">-- navigate to --<span class="arrow"></span></div>
              <?php
				if($childPages!=null)
				  foreach($childPages as $page) :
              ?>
              <li><a href="<?php echo get_page_link( $page->ID );?>"><?php echo $page->post_title;?></a></li>
              <?php endforeach; ?>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <article id="mainContent" class="splitLayout overviewPage">
      <div class="container">
        <div class="mainStream">
		  <section class="pageContent">
		    <?php the_content();?>
		  </section>
		  <?php endif; wp_reset_query();?>
		  <!-- /.pageContent -->
	    </div>
	    <!-- /.mainStream -->

	    <!-- /.sideStream -->
	    <div class="clear"></div>
      </div>
    </article>
    <!-- /#mainContent -->
    <?php get_footer(); ?>
