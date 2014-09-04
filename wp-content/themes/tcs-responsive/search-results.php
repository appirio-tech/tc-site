<?php
/*
Template Name: Search Results
*/
?>
<?php
get_header ();
?>

<div class="content">
	<div id="main">

	<!-- Start Overview Page-->
		<div class="pageTitleWrapper">
			<div class="pageTitle container">
				<?php if ($_GET['scope'] && $_GET['scope'] == member): ?>
				<h2 class="overviewPageTitle SingleColumnTestPageTitle">Member Search Results</h2>
				<?php else : ?>
				<h2 class="overviewPageTitle SingleColumnTestPageTitle">Search Results</h2>
				<?php endif; ?>
			</div>
		</div>

		<div class="searchBox container">
			<form id="formSearch" action="/search" method="GET">
				<input type="text" name="s" class="text isBlured" value="<?php echo $_GET['s']; ?>">
				<?php if ($_GET['scope'] && $_GET['scope'] == member): ?>
				<input name="scope" value="member" style="display:none">
				<?php endif; ?>
				<input type="submit" style="display:none">
				<a class="btn" href="javascript:$('#formSearch').submit();">Search</a>
			</form>		
		</div>		

		<article id="mainContent" class="splitLayout singleColumnPage">


			<div class="container">
				<div class="rightSplit  grid-1-1">
					<div class="mainStream grid-2-3">
						<section id="searchPageContent" class="pageContent">
							<?php if ($_GET['scope'] && $_GET['scope'] == member): ?>
								<div id="searchMemberWrapper">
								<?php
									$keyword = $_GET['s'];
									$page = 1;
									if ($_GET['page'])
										$page = $_GET['page'];
									$result = search_users($keyword.'%', $page);
									$total = $result->total;
									$pageIndex = $result->pageIndex;
									$pageSize = $result->pageSize;
									$users = (array)$result->users;
								?>
								<?php if ($result->total > 0): ?>
									<div class="pagingBox">
								        Search Results:
								        <strong><?php echo ($pageIndex-1)*$pageSize+1; ?></strong> to
								        <strong><?php echo min($pageIndex*$pageSize,$total); ?></strong> of
								        <strong><?php echo $total; ?></strong>
								        <br>
								        <?php if ($pageIndex>1) echo '<a href="/search?s='.$keyword.'&scope=member&page='.($pageIndex-1).'">prev</a>';else echo "prev";?> | <?php if ($pageIndex*$pageSize<$total) echo '<a href="/search?s='.$keyword.'&scope=member&page='.($pageIndex+1).'">next</a>';else echo "next";?>
								    </div>
								    <table id="memberSearchTable">
									    <tr>
									        <td class="header">No.</td>
									        <td class="header">Handle</td>
									        <!-- <td class="header">Country</td>
									        <td class="header">Earning</td>  -->
									    </tr>

										<?php
											$no = 0;
											foreach($users as $user):
												$no++;
										?>
											<tr class="light">
										        <td class="value"><?php echo $no + $pageSize * ($pageIndex-1); ?></td>
										        <td class="value"><a href="/member-profile/<?php echo $user->handle; ?>"><?php echo $user->handle; ?></a></td>
										      <!-- <td class="value"></td> 
										       <td class="value"></td>  -->
										   </tr>
										<?php endforeach; ?>
									</table>
								<?php else: ?>
									<div class="noResult">No matches found</div>
								<?php endif; ?>
								</div>
							<?php else: ?>
								<div id="searchBlogsWrapper">
								<?php
									//print_r(search_users('yepx'));
									//wp_reset_query();
									$args = array(
											'post_type' => array ( 'blog', 'page','post'),
											'posts_per_page' => 10,
											'paged' => $pageNumber,
											's' => $searchKey
									);
									//query_posts($args);
									$postQuery = new WP_Query($args);
									if ( $postQuery->have_posts() ) :
										while ( $postQuery->have_posts() ) :
											$postQuery->the_post();
								?>
									<!-- Blog Item -->
									<div class="searchResultItem">

										<h3><a href="<?php the_permalink();?>" class="blueLink"><?php the_title();?></a></h3>

										<!-- Blog Desc -->
										<div class="searchResultDescBox">
											<div class="postCategory">Post type: <?php echo get_post_type( $post ) ?>
											</div>
										</div>
										<!-- Blog Desc End -->
										<?php
												$excerpt = wrap_content_strip_html(wpautop($post->post_content), 400, true,'\n\r','');
												echo $excerpt;
										?>
									</div>
									<!-- Blog Item End -->
								<?php
										endwhile;
								?>
								<?php
								if(function_exists('wp_paginate')) {
								wp_paginate();
								}
								?>
								<?php
									else :
								?>
								<div class="noResult">No matches found</div>
								<?php
									endif;
									wp_reset_postdata();
								?>
								</div>
							<?php endif; ?>
						</section>
						<!-- /.pageContent -->
					</div>
					<!-- /.mainStream -->			
				</div>
				<!-- /.rightSplit -->
				<div class="clear"></div>
			</div>
			</article>
			<!-- /#mainContent -->
	</div>
</div>		
		
<?php get_footer(); ?>