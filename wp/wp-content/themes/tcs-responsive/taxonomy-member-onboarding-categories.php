<?php
/**
 * Template Name: Category Blog
 */
?>
<?php

get_header ();

$values = get_post_custom ( $post->ID );

$currUrl = curPageURL();
$userkey = get_option ( 'api_user_key' );
$currPage = (int) get_query_var ( 'page' ) != "" ? (int) get_query_var ( 'page' ) : 1;
$postPerPage = get_option("posts_per_page") == "" ? 5 : get_option("posts_per_page");
$siteURL = site_url ();

$blogPageTitle = "Member Onboarding";
?>

<script type="text/javascript">
	var siteurl = "<?php bloginfo('siteurl');?>";
	var page = <?php echo $currPage; ?>;
</script>
<div class="content">
	<div id="onboarding">
	<?php
        $tax = 'member-onboarding-categories';
        $slug = get_query_var($wp_query->query_vars['taxonomy']);
        $cat = get_term_by('slug', $slug, $tax);
		$catId = $cat->term_id;		
		$categories = $cat->name;
		 
		  
 
	?>
	<!-- Start Overview Page-->
	
		<!-- page title -->
		<div class="pageTitleWrapper">
			<div class="pageTitle container">
				<h2 class="blogPageTitle"><?php echo $blogPageTitle;?> Category</h2>
				<div class="clearboth"></div>
			</div>
			<div id="member-category" class="blogCategoryWrapper">
				<div class="container">
					<div class="innerWrapper">
						<div class="blogCategoryMenu">
						<?php
							$items = wp_get_nav_menu_items("member-onboarding");
							if($items!=null)
							foreach($items as $menu) :
								$active = $catId == $menu->object_id ? "active" : "";
						?>
							<a href="<?php echo $menu->url;?>" class="<?php echo $active;?>"><?php echo $menu->title;?></a>
						<?php endforeach; ?>
						</div>
						<?php /*?><ul class="blogMenuMobile">
							<div class="default">Categories<span class="arrow"></span></div>
							<div class="current"><?php echo $categories;?><span class="arrow"></span></div>
							<?php
								if($items!=null)
								foreach($items as $menu) :
							?>
								<li><a href="<?php echo $menu->url;?>"><?php echo $menu->title;?></a></li>
							<?php endforeach; ?>
						</ul><?php */?>
					</div>
				</div>
			</div>
		</div>
		<!-- page title end -->
		 


		<article id="mainContent" class="splitLayout overviewPage">
			<div id="onboarding" class="container blogPageMainContent">
				<div class="rightSplit  grid-3-3">
					<div class="mainStream grid-2-3">
						<section id="blogPageContent" class="pageContent">
						<div class="subscribeTopWrapper">
							<?php
								$catName = $cat->name;
								$catDesc = $cat->description;
								$feedUrl = get_bloginfo("wpurl")."/feed/?cat=$catId&post_type=member-onboarding";
								$termname = strtolower($categories);
           						$termname = str_replace(' ', '-', $termname); 
							?>
							<h1><?php echo $catName;?></h1>
                            <h2><?php echo $catDesc;?></h2>
							<?php /*?><a class="feedBtn" href="<?php echo $feedUrl;?>">Subscribe to <?php echo $catName;?></a><?php */?>
						</div>
						<div id="box-<?php echo $termname; ?>" class="single-member-onboarding">
							<input type="hidden" class="pageNo" value="<?php echo $currPage; ?>" />
							<input type="hidden" class="catId" value="<?php echo $catId; ?>" />
						<?php 
							//wp_reset_query();
                            $args = array(
                                'post_type' => 'member-onboarding',
                                'tax_query' => array(
                                    array(
                                        'taxonomy' => $tax,
                                        'field'    => 'id',
                                        'terms'    => $catId,
                                    ),
                                ),
                                'order'     => 'DESC',
                            );
							
							//query_posts($args);
							$postQuery = new WP_Query($args);
							if ( $postQuery->have_posts() ) :
								while ( $postQuery->have_posts() ) : 
									$postQuery->the_post();  // iterate and set global $post var
									$postId = $post->ID;
									$image = wp_get_attachment_image_src( get_post_thumbnail_id( $postId ), 'blog-thumb' );
									if($image!=null) $imageUrl = $image[0];
									else $imageUrl = get_bloginfo('stylesheet_directory')."/i/blog-thumb-placeholder.png";
									
									$imageMobile = wp_get_attachment_image_src( get_post_thumbnail_id( $postId ), 'blog-thumb' );
									if($imageMobile!=null) $imageUrlMobile = $imageMobile[0];
									else $imageUrlMobile = get_bloginfo('stylesheet_directory')."/i/story-side-pic.png";
									
									$dateObj = DateTime::createFromFormat('Y-m-d H:i:s', $post->post_date);
									$dateStr = $dateObj->format('M j, Y');
									
									$title = htmlspecialchars($post->post_title);
									$subject = htmlspecialchars(get_bloginfo('name')).' : '.$title;
									$body = htmlspecialchars($post->post_content);
									$email_article = 'mailto:?subject='.rawurlencode($subject).'&body='.rawurlencode($body);
									//Bugfix I-109975: Correct format of twitter blog post shares
									$twitterShare = createTwitterPost($title, get_permalink($postId));
									$fbShare = "http://www.facebook.com/sharer/sharer.php?s=100&p[url]=".get_permalink()."&p[images][0]=".$imageUrl."&p[title]=".get_the_title()."&p[summary]=" . urlencode(wrap_content_strip_html(wpautop($title), 130, true,'\n\r',''));
									$gplusShare = "https://plus.google.com/share?url=".get_permalink();
									
									$authorObj = get_user_by("id",$post->post_author);
									$authorLink = get_bloginfo("wpurl")."/author/".$authorObj->user_nicename;
						?>		
							<!-- Blog Item --> 
								<!-- Thumb place holder -->
                                
                                <div class="flip-container" ontouchstart="this.classList.toggle('hover');">
                                <div class="flipper">
                                    <div class="front">
                                        <span class="name">
                                        <?php echo get_the_title(); ?>
                                        </span>
                                    </div>
                                    <div class="back"> 
                                        <span class="excerpt">
                                        <?php 
                                        $excerpts = get_post_meta($post->ID, 'excerpt', false); ?> 
                                        <?php foreach($excerpts as $excerpt) {
                                            echo $excerpt;
                                            }
                                        ?>
                                        </span>
                                        <a href="<?php echo get_the_permalink(); ?>" class="read-more">Read More</a>
                                    </div>
                                </div>
                            </div>
                            
                            
                                <?php /*?><a class="onboarding-item" href="<?php the_permalink();?>"> 
                                <span class="thumbnail"><img src="<?php echo $imageUrlMobile;?>"/></span>
                                <span class="info">
                                <span class="title">
                                <?php the_title();?>
                                </span>
                                </span>  
								
                                </a><?php */?>
                                
								<!-- Blog Desc -->
								<?php /*?><div class="blogDescBox">
									<div class="postDate"><?php echo $dateStr;?> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; By:&nbsp;&nbsp;</div>
									<div class="postAuthor"><a href="<?php echo $authorLink; ?>" class="author blueLink"><?php the_author();?></a></div>
									<div class="postCategory">In : 
									<?php
										$categories = get_the_terms($post->ID, $tax);
										$separator = ', ';
										$output = '';
										if($categories){
											foreach($categories as $category) {
												if(strtolower($category->name)!="member-onboarding")
													$output .= '<a href="'.get_term_link( $category->slug, $tax ).'" title="' . esc_attr( sprintf( __( "View all posts in %s" ), $category->name ) ) . '">'.$category->name.'</a>'.$separator;
											}
										}
										echo trim($output, $separator);
                                        echo $categories[11];
									?>									
									</div>
								</div><?php */?>
								<!-- Blog Desc End -->
								
								<!-- Blog Right Section -->
								 
								<!-- Blog Right Section End -->
								 
							<!-- Blog Item End -->
						<?php 
								endwhile;
						?>
							</div>
						<?php
							else :
						?>
							<div class="noResult">No Article in <?php echo $cat->name;?></div>
						<?php
							endif;
						?>
						<?php
							//wp_reset_query();
							wp_reset_postdata(); // reset post global var since it was updated above
							$args = "post_type=member-onboarding";
							$args .= "&posts_per_page=-1&cat=$catId";
							//$wpQueryAll = query_posts($args);
							$allPostsQuery = new WP_Query($args);
							$allPostsQuery->get_posts();
							$postCount = $allPostsQuery->found_posts;
							//$postCount = count($wpQueryAll);
							
							$prevLink = add_query_arg("page",($currPage-1),$currentUrl);
							$nextLink = add_query_arg("page",($currPage+1),$currentUrl);
							
							if($postCount > $postPerPage) :
						?>
							<div class="pagingWrapper">
								<?php if($currPage>1) :?><a class="prev" href="<?php echo $prevLink;?>">Newer Posts</a><?php endif; ?>
								<?php if( $postCount > ($currPage * $postPerPage)) : ?><a class="next" href="<?php echo $nextLink;?>">Older Posts</a><?php endif;?>
							</div>
						<?php endif; ?>	
							
						</section>
					
					
						<!-- /.pageContent -->

					</div>
					<!-- /.mainStream -->
					<aside id="" class="sideStream  grid-1-3">
						
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