<?php
/**
 * Template Name: Case studies template
 */
?>
<?php

global $page, $paged;
global $clients;
get_header ();

$siteURL = site_url ();
?>

<script type="text/javascript">
	var siteurl = "<?php bloginfo('siteurl');?>";	
	$(document).ready(function(){
	$('.dataChanges').off();
	});
</script>
<div class="content">
	<div id="main">
		<div class="pageTitleWrapper">
			<div class="pageTitle pageTitleWithBackLink container">
				<h2 class="casePageTitle">Case Studies</h2>
			</div>
		</div>

		<article id="mainContent" class="casePage">
			<div class="grid-4">		
					

					<?php
					$thumbHtml = "";
					$detailHtml = "";
					
					if (get_query_var ( 'page' )) {
						$paged = get_query_var ( 'page' );
					} else {
						$paged = 1;
					}
					$num = $paged = get_query_var ( 'num' );
					$post_per_page = get_option ( 'case_studies_per_page' );
					if ($paged == 'all') {
						$post_per_page = - 1;
					}
					
					$args = array (
							'post_type' => 'case-studies',
							'paged' => $paged,
							'posts_per_page' => $post_per_page 
					);
					$count = 0;
					$clients = new WP_Query ( $args );
					$total_pages = $clients->max_num_pages;
					$total_posts = $clients->found_posts;
					
					if ($clients->have_posts ()) {
						while ( $clients->have_posts () ) :
							$clients->the_post ();
							
							$pid = $post->ID;
							$thumbId = get_post_thumbnail_id ( $pid );
							$iurl = wp_get_attachment_url ( $thumbId );
							$sector = get_post_meta ( $pid, "Sector", true );
							$quote = get_post_meta ( $pid, "Quote", true );
							$qAuthor = get_post_meta ( $pid, "Quote author", true );
							$qAutDesig = get_post_meta ( $pid, "Author designation", true );
							$customContent = get_post_meta ( $pid, "Description Content", true );
							?>	
					<?php if ($count % 4==0): ?>					
						<?php $thumbHtml = '<div class="caseGrid caseGridRowFirst">' ;?>
					
					
					<?php elseif(($count+1) % 4==0):?>
						<?php $thumbHtml .= '<div class="caseGrid caseGridRowLast">'?>
					<?php else:?>
						<?php $thumbHtml .='<div class="caseGrid">'?>
					<?php endif;?>	
							
					<?php
							$thumbHtml .= '<a href="javascript:;" class="jsShowCaseDetails">
								<img src="' . $iurl . '" alt="' . get_the_title () . '" width="230" height="112">
								<i></i>
							</a>							
						</div>';
							
							$detailHtml .= '<div class="caseDetailItem hide"><div class="caseDetailItemInner">
                                <div class="container">
                                    <a href="javascript:;" class="jsCloseCaseDetails">X</a>
                                    <div class="caseBriefWrapper group">
                                        <div class="caseTitle">
                                            <h3>' . get_the_title () . '</h3>
                                            <p>' . $sector . '</p>
                                        </div>
                                        <div class="caseQuote">
                                            <p class="quoteTxt">“' . $quote . '”</p>
                                            <p class="quoterName">' . $qAuthor . '</p>
                                            <p class="quoterTitle">' . $qAutDesig . '</p>
                                        </div>
                                        <div class="caseBrief">
                                            ' . custom_content ( 400, $customContent ) . '<div class="moreBtnWrapper"><a class="btn" href="' . get_permalink ( $pid ) . '">Read More</a></div>
                                        </div>
                                    </div>
                                </div>
                            </div></div>';
							?>	
					<?php
							$count += 1;
							
							if ($count % 4 == 0) {
								echo '<div class="casesView container group ">' . $thumbHtml . '</div>';
								echo '<div class="caseDetailsWrapper">' . $detailHtml . '</div>';
								$thumbHtml = $detailHtml = "";
							}
						endwhile
						;
						
						if ($count % 4 != 0) {
							echo '<div class="casesView container group ">' . $thumbHtml . '</div>';
							echo '<div class="caseDetailsWrapper">' . $detailHtml . '</div>';
							$thumbHtml = $detailHtml = "";
						}
						
						$current_page = $paged;
						if ($paged == "") {
							$current_page = 1;
						}
						?>
			</div>
			<?php if ($paged !='all'){?>
			<div class="dataChanges container">
				<div class="lt">
				<!-- <a class="btn" href="<?php echo get_site_url().'/case-studies/page/all';?>">Show All</a> -->
				</div>
				<div class="rt">
					<?php
							
if (($current_page > 1)) {
								echo '<a class="prevLink" href="' . get_site_url () . '/case-studies/page/' . ($current_page - 1) . '"><i></i> Prev</a>';
							}
							?>
					
					<?php
							
if ($current_page < $total_pages) {
								echo '<a class="nextLink" href="' . get_site_url () . '/case-studies/page/' . ($current_page + 1) . '">Next <i></i></a>';
							}
							;
							?>
					
				</div>
			</div>
			<?php }?>
			<?php
					}
					wp_reset_query ();
					?>

		</article>
		<!-- /#mainContent -->
<?php get_footer(); ?>
