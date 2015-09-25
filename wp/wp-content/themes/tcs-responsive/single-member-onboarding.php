<?php
/**
 * Template Name: Single Blog
 */
?>
<?php

//require_once ("love-this.php");

get_header ();

$values = get_post_custom ( $post->ID );

$userkey = get_option ( 'api_user_key' );
$siteURL = site_url ();

$blogPageTitle = get_option("blog_page_title") == "" ? "Welcome to the topcoder Blog" : get_option("blog_page_title");
?>

<script type="text/javascript">
	var siteurl = "<?php bloginfo('siteurl');?>";
</script>
<div id="onboarding" class="content">
	<div id="main">

	<?php

	if (have_posts ()) :
		the_post ();
		$postId = $post->ID;
		$quote = get_post_meta ( $post->ID, "Quote", true );
		$qAuthor = get_post_meta ( $post->ID, "Quote author", true );

		$image = wp_get_attachment_image_src( get_post_thumbnail_id( $postId ), 'single-post-thumbnail' );
		if($image!=null) $imageUrl = $image[0];
		else $imageUrl = get_bloginfo('stylesheet_directory')."/i/story-side-pic.png";

		$dateObj = DateTime::createFromFormat('Y-m-d H:i:s', $post->post_date);
		$dateStr = $dateObj->format('M j, Y');

		$title = htmlspecialchars($post->post_title);
		$subject = htmlspecialchars(get_bloginfo('name')).' : '.$title;
		$body = htmlspecialchars($post->post_content);
		$email_article = 'mailto:?subject='.rawurlencode($subject).'&body='.get_permalink($postId);
		//Bugfix I-109975: Correct format of twitter blog post shares
		$twitterShare = createTwitterPost($title, get_permalink($postId));
		$fbShare = "http://www.facebook.com/sharer/sharer.php?s=100&p[url]=".get_permalink($postId)."&p[images][0]=".$imageUrl."&p[title]=".get_the_title()."&p[summary]=" . urlencode(wrap_content_strip_html(wpautop($title), 130, true,'\n\r',''));
		$gplusShare = "https://plus.google.com/share?url=".get_permalink($postId);

		$authorObj = get_user_by("id",$post->post_author);
		$authorLink = get_bloginfo("wpurl")."/author/".$authorObj->user_nicename;

		$categories = get_the_category();
		$arrCategoriesId;
		if($categories!=null){
			foreach($categories as $key=>$category) {
				$arrCategoriesId[] = $category->term_id;
			}
		}
	?>
	<!-- Start Overview Page-->

		<!-- page title -->
		<div class="pageTitleWrapper">
			<div class="pageTitle container">
				<h2 class="blogPageTitle"><?php the_title(); ?></h2>
                <!-- Blog Desc -->
                <div class="blogDescBox">                    
                    <!--<div class="postAuthor">By <a href="<?php echo $authorLink; ?>" class="author blueLink"><?php the_author();?></a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</div>
                    <div class="postDate">Posted <?php echo $dateStr;?></div>-->
                    <!-- Social -->
                    <div class="single-social-section">
                       <?php /*?> <div class="mk-love-holder"><?php mk_love_this(); ?></div>
                        <?php if ( get_post_meta( $post->ID, '_disable_comments', true ) != 'false' ) {
                                echo '<a href="'.get_permalink().'#comments" class="blog-modern-comment"><i class="mk-moon-bubble-9"></i><span> '.get_comments_number( '0', '1', '%').'</span></a>';
                        } ?>
						<?php */?>
                        <div class="blog-share-container">
                            <div class="blog-single-share mk-toggle-trigger"><i class="mk-moon-share-2"></i></div>
                            <ul class="single-share-box mk-box-to-trigger">
                                <li><a class="facebook-share" data-title="<?php $title ?>" data-url="<?php get_permalink() ?>" href="#"><i class="mk-moon-facebook"></i></a></li>
                                <li><a class="twitter-share" data-title="<?php $title ?>" data-url="'<?php get_permalink() ?>" href="#"><i class="mk-moon-twitter"></i></a></li>
                                <li><a class="googleplus-share" data-title="<?php $title ?>" data-url="<?php get_permalink() ?>" href="#"><i class="mk-moon-googleplus"></i></a></li>
                                <li><a class="pinterest-share" data-image="'.$image_src_array[0].'" data-title="<?php $title ?>" data-url="<?php get_permalink() ?>" href="#"><i class="mk-moon-pinterest"></i></a></li>
                                <li><a class="linkedin-share" data-title="<?php $title ?>" data-url="<?php get_permalink() ?>" href="#"><i class="mk-moon-linkedin"></i></a></li>
                            </ul>
                        </div>
                        <a class="mk-blog-print" onClick="window.print()" href="#" title="<?php __('Print', 'mk_framework') ?>"><i class="mk-moon-print-3"></i></a>
                        <div class="clearboth"></div>
                    </div>
                </div>
                <!--<a href=".." class="closePost"></a>-->
                <div class="clearboth"></div>
			</div>
		</div>
		<!-- page title end -->



		<article id="mainContent" class="splitLayout overviewPage"> 
			<div class="container blogPageMainContent">
				<div class="rightSplit  grid-3-3">
					<div class="mainStream grid-2-3">
						<section class="pageContent singleContent">
                        
							<!-- content wrapper -->
							<div id="single-member-onboarding" class="contentWrapper">
								<?php the_content();?>
							</div>
							<!-- content wrapper end -->
                            
                            <!-- Author -->
                           <?php /*?> <?php  if(get_post_meta( $post->ID, '_disable_about_author', true ) != 'false') : ?>
                            <div class="mk-about-author-wrapper">
								<div class="avatar-wrapper"><?php global $user; echo get_avatar( get_the_author_meta('email'), '65',false ,get_the_author_meta('display_name', $user['ID'])); ?></div>
								<div class="mk-about-author-meta">
								<a class="about-author-name" href="<?php echo get_author_posts_url(get_the_author_meta( 'ID' )); ?>"><?php the_author_meta('display_name'); ?></a>
								<div class="about-author-desc"><?php the_author_meta('description'); ?></div>
								<ul class="about-author-social">
									<?php
									if(get_the_author_meta( 'twitter' )) {
										echo '<li><a class="twitter-icon" title="'.__('Follow me on Twitter','mk_framework').'" href="'.get_the_author_meta( 'twitter' ).'"><i class="mk-moon-twitter"></i></a></li>';
									}
									if(get_the_author_meta('email')) {
										echo '<li><a class="email-icon" title="'.__('Get in touch with me via email','mk_framework').'" href="mailto:'.get_the_author_meta('email').'"><i class="mk-moon-envelop"></i></a></li>';
									}
									?>
								</ul>
								</div>
								<div class="clearboth"></div>
                            </div>
                            <?php endif;  ?><?php */?>

                            <!-- Related Posts -->
                            <?php do_action('blog_similar_posts', $post->ID); ?>
                            
                            <!-- Comments -->
                            <?php /*?><?php comments_template( '', true ); ?><?php */?>

						</section>

					<?php endif; wp_reset_query();?>


						<!-- /.pageContent -->
					</div>
					<!-- /.mainStream -->
					<aside class="sideStream  grid-1-3">

						<?php get_sidebar("member-onboarding"); ?>

					</aside>
					<!-- /.sideStream -->
					<div class="clear"></div>
				</div>
				<!-- /.rightSplit -->
			</div>
		</article>
		<!-- /#mainContent -->
<?php get_footer(); ?>