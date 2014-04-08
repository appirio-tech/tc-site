<?php
/**
 * Template Name: Challenges Upcoming Contest List Page
 * Author : evilkyro1965
 */
get_header('challenge-landing');

$values = get_post_custom ( $post->ID );

$siteURL = site_url ();
$postId = $post->ID;
?>

<?php
	$tcoTooltipTitle = get_option("tcoTooltipTitle");
	$tcoTooltipMessage = get_option("tcoTooltipMessage");

	// get contest details
	global $contest_type;
	$contest_type = get_query_var("contest_type") == "" ? "develop" : get_query_var("contest_type");
	$listType = "UPCOMING";	
	$listType = $contest_type == "design" ? "UPCOMING" : $listType;
	$listType = $contest_type == "develop" ? "ACTIVE" : $listType;
	$listType = $contest_type == "data" ? "UPCOMING" : $listType;
	$postPerPage = get_post_meta($postId,"Contest Per Page",true) == "" ? 10 : get_post_meta($postId,"Contest Per Page",true);
?>

<script type="text/javascript" >
	var siteurl = "<?php bloginfo('siteurl');?>";

	var reviewType = "upcoming";
	var isBugRace = false;
	var ajaxAction = "<?php echo ($contest_type=="data" ? "get_upcoming_data_challenges" : "get_challenges"); ?>";
	var stylesheet_dir = "<?php bloginfo('stylesheet_directory');?>";
	var currentPage = 1;
	var postPerPage = <?php echo $postPerPage;?>;
	var contest_type = "<?php echo $contest_type;?>";
	var listType = "<?php echo $listType;?>";
	<?php
		if($tcoTooltipTitle) echo "var tcoTooltipTitle= '$tcoTooltipTitle';";
		if($tcoTooltipMessage) echo "var tcoTooltipMessage= '$tcoTooltipMessage';";
	?>
</script>
<div class="content">
	<div id="main">

	<?php if(have_posts()) : the_post();?>
		<?php the_content();?>
	<?php endif; wp_reset_query();?>

		<div id="hero">
			<?php
				$activeDesignChallengesLink = get_bloginfo('siteurl')."/upcoming-challenges/design/";
				$activeDevlopChallengesLink = get_bloginfo('siteurl')."/upcoming-challenges/develop/";
				$activeDataChallengesLink = get_bloginfo('siteurl')."/upcoming-challenges/data/";
			?>
			<div class="container grid grid-float">
				<div class="grid-3-1 track trackUX<?php if($contest_type=="design") echo " isActive"; ?>" >
					<a href="<?php echo $activeDesignChallengesLink;?>"><i></i>Graphic Design Challenges
					</a><span class="arrow"></span>
				</div>
				<div class="grid-3-1 track trackSD<?php if($contest_type=="develop") echo " isActive"; ?>" >
					<a href="<?php echo $activeDevlopChallengesLink;?>"><i></i>Upcoming Development Challenges
					</a><span class="arrow"></span>
				</div>
				<div class="grid-3-1 track trackAn<?php if($contest_type=="data") echo " isActive"; ?>" >
					<a href="<?php echo $activeDataChallengesLink;?>">
						<i></i>Data Science Challenges
					</a><span class="arrow"></span>
				</div>
			</div>
		</div>
		<!-- /#hero -->

		<article id="mainContent" class="layChallenges">
			<div class="container">
				<header>
					<h1>
					  <?php
					    if($contest_type=="design")
						  echo "Upcoming Graphic Design Challenges";
						else if($contest_type=="develop")
						  echo "Upcoming Software Development Challenges";
						else if($contest_type=="data")
						  echo "Upcoming Data Science Challenges";
					  ?>
                      <?php $FeedURL = get_bloginfo('wpurl') . "/challenges-feed/?list=".$listType."&contestType=". $contest_type; ?>

					  <span class="subscribeTopWrapper">
					    <a class="feedBtn" href="<?php echo $FeedURL;?>"></a>
					  </span>
                    </h1>
					<aside class="rt">
						<span class="views"> 
							<?php if($contest_type!="data") : ?>
								<a href="#gridView" class="gridView"></a> <a href="#tableView" class="listView isActive"></a>
							<?php endif;?>
						</span>
					</aside>
				</header>
				<div class="actions">
					<div class="lt challengeType">
						<p class="mayChangePara">&nbsp;&nbsp;&nbsp;* All upcoming challenges may change</p>
					</div>
					<div class="rt">
					<?php if($contest_type!="data") : ?>
                        <a href="javascript:;" class="searchLink advSearch">
                            <i></i>Advanced Search
                        </a>
					<?php endif; ?>
                    </div>
                </div>
                <!-- /.actions -->

                <?php get_template_part("contest-advanced-search"); ?>

				<div id="tableView" class=" viewTab">
					<div class="tableWrap tcoTableWrap">
						<table class="dataTable tcoTable">
							<thead>
							<?php if($contest_type=="design") : ?>
								<tr>
									<th class="colCh" data-placeholder="challengeName">Challenges<i></i></th>
									<th class="colType" data-placeholder="challengeType">Type<i></i></th>
									<th class="colTime desc" data-placeholder="postingDate">Timeline<i></i></th>
									<th class="colTLeft noSort" data-placeholder="currentPhaseRemainingTime">Technologies<i></i></th>
									<th class="colPur noSort" data-placeholder="prize">Prizes<i></i></th>
									<th class="colPhase noSort" data-placeholder="currentPhase">Current Status<i></i></th>
									<th class="colReg noSort" data-placeholder="numRegistrants">Registrants<i></i></th>
									<th class="colSub noSort" data-placeholder="numSubmissions">Submissions<i></i></th>
								</tr>
							<?php elseif($contest_type=="develop") : ?>
								<tr>
									<th class="colCh" data-placeholder="challengeName">Challenges<i></i></th>
									<th class="colType" data-placeholder="challengeType">Type<i></i></th>
									<th class="colTime desc" data-placeholder="postingDate">Timeline<i></i></th>
									<th class="colTLeft noSort" data-placeholder="currentPhaseRemainingTime">Technologies<i></i></th>
									<th class="colPur noSort" data-placeholder="prize">Prizes<i></i></th>
									<th class="colPhase noSort" data-placeholder="currentPhase">Current Status<i></i></th>
									<th class="colReg noSort" data-placeholder="numRegistrants">Registrants<i></i></th>
									<th class="colSub noSort" data-placeholder="numSubmissions">Submissions<i></i></th>
								</tr>
							<?php elseif($contest_type=="data") : ?>
								<tr>
									<th class="colCh  noSort" data-placeholder="">Challenges<i></i></th>
									<th class="colRstart noSort" data-placeholder="">Type<i></i></th>
									<th class="colRstart noSort" data-placeholder="">Timeline<i></i></th>
									<th class="colSub noSort" data-placeholder="">Registrants<i></i></th>
								</tr>							
							<?php endif; ?>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
				</div>
				<!-- /#tableView -->
				<div id="gridView" class="viewTab hide">
					<div class="contestGrid alt">

					</div>
					<!-- /.contestGrid -->
				</div>
				<!-- /#gridView -->
				<div class="dataChanges">
					<div class="lt">
						<a href="javascript:;" class="viewAll">View All</a>
					</div>
					<div id="challengeNav" class="rt">
						<a href="javascript:;" class="prevLink">
							<i></i> Prev
						</a>
						<a href="javascript:;" class="nextLink">
							Next <i></i>
						</a>
					</div>
					<div class="mid onMobi">
						<a href="#" class="viewPastCh">
							View Past Challenges<i></i>
						</a>
					</div>
				</div>
				<!-- /.dataChanges -->
			</div>
		</article>
		<!-- /#mainContent -->
<?php get_footer(); ?>
