<?php
/**
 * Template Name: Community Page
 */

get_header ();

$values = get_post_custom ( $post->ID );

$userkey = get_option ( 'api_user_key' );
$siteURL = site_url ();

// get contest details
$contest_type = get_query_var ( 'contest_type' );
$contest_type = str_replace ( "_", " ", $contest_type );
$postPerPage = get_option ( "contest_per_page" ) == "" ? 30 : get_option ( "contest_per_page" );

?>

<style>
.bx-controls{display:none}
</style>
<div class="content">
	<div id="main">
		<div class="header-container">
      <header>
        <h1>
					COMMUNITY
					<div class="flr statistics ilb">
						<?php $summary = get_activity_summary(); ?>
						<div class="activeMembers ilb">
							<p class="val"><?php echo number_format($summary->memberCount); ?></p>
							<p class="lbl">ACTIVE MEMBER</p>
						</div>
						<div class="competingToday ilb">
							<p class="val"><?php echo number_format($summary->activeMembersCount); ?></p>
							<p class="lbl">COMPETING TODAY</p>
						</div>
						<div class="availPrize ilb">
							<p class="val"><?php echo '$' . number_format($summary->prizePurse); ?></p>
							<p class="lbl">AVAILABLE PRIZE</p>
						</div>
						<div class="activeChallenges ilb">
							<p class="val"><?php echo number_format($summary->activeContestsCount); ?></p>
							<p class="lbl">ACTIVE CHALLENGES</p>
						</div>
					</div>
				</h1>
      </header>
		</div>



		<article id="mainContent" class="splitLayout ">
			<input type="hidden" class="contestType" value="activeContest"/>
			<input type="hidden" class="postPerPage" value="<?php echo $postPerPage;?>"/>

			<div class="container">
				<div class="grid-3-3">
					<div class="mainStream partialList  grid-2-3">
						<div class=" viewTab">
							<div class="tableWrap">
								<table class="dataTable challenges">
									<thead>
										<tr>
          	<!-- I-106081: add disabled to the class -->
											<th class="colCh disabled">Challenges</th>
											<th class="colTime disabled">Timeline</th>
											<th class="colPur disabled">Prizes</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td colspan="3">&nbsp;</td>
										</tr>
									</tbody>
									<tfoot>
										<td colspan="3"><a href="/challenges" class="viewAll">View All</a></td>
									</tfoot>
								</table>
							</div>
						</div>
						<!-- /#tableView -->
					</div>
					<!-- /.mainStream -->
					<aside class="sideStream  grid-1-3">
								<?php dynamic_sidebar('Sidebar Community');?>
					</aside>
					<!-- /.sideStream -->
					<div class="clear"></div>
				</div>
				<!-- /.rightSplit -->

					</div>
		</article>

					<?php dynamic_sidebar('BottomBar Community');?>


		<!-- /#mainContent -->
		<div id="whatsHappening">
			<div class="container grid grid-float">
				<div class="inner">
					<div class="grid-3-1">
						<section>
							<h2>News</h2>
							<div class="slider">
								<ul>
								<?php
								$args = array (
										'post_type' => 'blog',
										'posts_per_page' => '1',
										'category_name' => 'news-blog'
								);
								$news = new WP_Query ( $args );

								if ($news->have_posts ()) :
									while ( $news->have_posts () ) :
										$news->the_post ();
										$thumbId = get_post_thumbnail_id ( $news->ID );
										$iurl = wp_get_attachment_url ( $thumbId );
										?>
										<li class="slide">
										<div class="slideCon">
											<?php if($iurl != null):?>
											<div class="featuredImg">
												<img src="<?php echo $iurl;?>" alt="<?php the_title();?>" />
											</div>
											<?php endif;?>
												<p class="title"><?php the_title();?></p>
											<!-- <p class="postedBy">
												Posted by
												<a href="<?php bloginfo('wpurl');?>/member-profile/<?php the_author();?>" class="coderTextOrange"><?php the_author();?></a>
													on <?php the_time('F jS, Y');?>
												</p>
											-->
											<div class="excerpt">
													<?php echo the_excerpt();?>
												</div>
										</div>
									</li>
								<?php endwhile; endif; wp_reset_query();?>
									</ul>
							</div>
						</section>
						<!-- /News -->
					</div>
					<div class="grid-3-1 grid-mid">
						<section>
							<h2>Events</h2>
							<div class="slider">
								<ul>
										<?php
										$args = array (
												'post_type' => 'blog',
												'posts_per_page' => '1',
												'category_name' => 'events'
										);
										$news = new WP_Query ( $args );

										if ($news->have_posts ()) :
											while ( $news->have_posts () ) :
												$news->the_post ();
												$thumbId = get_post_thumbnail_id ( $news->ID );
												$iurl = wp_get_attachment_url ( $thumbId );
												?>
										<li class="slide">
										<div class="slideCon">
											<?php if($iurl != null):?>
											<div class="featuredImg">
												<img src="<?php echo $iurl;?>" alt="<?php the_title();?>" />
											</div>
											<?php endif;?>
												<p class="title"><?php the_title();?></p>
											<!-- <p class="postedBy">
												Posted by
												<a href="<?php bloginfo('wpurl');?>/member-profile/<?php the_author();?>" class="coderTextOrange"><?php the_author();?></a>
													on <?php the_time('F jS, Y');?>
												</p>
											-->
											<div class="excerpt">
													<?php echo the_excerpt();?>
												</div>
										</div>
									</li>
								<?php endwhile; endif; wp_reset_query();?>
									</ul>
							</div>
						</section>
						<!-- /Events -->
					</div>
					<div class="grid-3-1 grid-rt">
						<section>
							<h2>Community Highlights</h2>
							<div class="slider">
								<ul>
								<?php
								$args = array (
										'post_type' => 'blog',
										'posts_per_page' => '1',
										'category_name' => 'community-highlights'
								);
								$news = new WP_Query ( $args );

								if ($news->have_posts ()) :
									while ( $news->have_posts () ) :
										$news->the_post ();
										$thumbId = get_post_thumbnail_id ( $news->ID );
										$iurl = wp_get_attachment_url ( $thumbId );
										?>
										<li class="slide">
										<div class="slideCon">
											<?php if($iurl != null):?>
											<div class="featuredImg">
												<img src="<?php echo $iurl;?>" alt="<?php the_title();?>" />
											</div>
											<?php endif;?>
												<p class="title"><?php the_title();?></p>
											<!--<p class="postedBy">
												Posted by
												<a href="<?php bloginfo('wpurl');?>/member-profile/<?php the_author();?>" class="coderTextOrange"><?php the_author();?></a>
													on <?php the_time('F jS, Y');?>
												</p>
											-->
											<div class="excerpt">
													<?php echo the_excerpt();?>
												</div>
										</div>
									</li>
								<?php endwhile; endif; wp_reset_query();?>
							</ul>
							</div>
						</section>
						<!-- /Community Highlights -->
					</div>
				</div>
			</div>
		</div>
		<!-- /#whatsHappening -->

<?php get_footer(); ?>

<script type="text/javascript">
  var siteurl = "<?php bloginfo('siteurl');?>";
  var activePastContest = "active";
  $(document).ready(function() {
    app.buildRequestData("activeContest","<?php echo $contest_type;?>","");
    app.community.init();
    //listActiveContest("activeContest","activeContest","<?php // echo $contest_type;?>");
  });
</script>
