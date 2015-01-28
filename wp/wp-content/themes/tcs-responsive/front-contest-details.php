<?php
/*
 * Template Name: Front Contest Details
 */
get_header ( 'contests' );

$values = get_post_custom ( $post->ID );

$userkey = get_option ( 'api_user_key' );
$contestID = get_query_var ( 'contestID' );
$siteURL = site_url();
$contestJson = get_contest_info($contestID);
$contestObj = json_decode('{
    "type": "Web Design",
    "contestName": "Cornell - Responsive Storyboard Economics Department Site Redesign Contest",
    "description": "Welcome to Cornell C Responsive Storyboard Economics Site Redesign contest. The goal of this contest is to redesign look and feel for one of our college site departments (economics) using base design and customer feedback provided in this contest. There are two pages that needs to be redesigned a",
    "numberOfSubmissions": 16,
    "numberOfRegistrants": 27,
    "numberOfPassedScreeningSubmissions": 27,
    "contestId": 30036096,
    "projectId": 6789,
    "registrationEndDate": "10.31.2013 10:10 EDT",
    "submissionEndDate": "10.31.2013 10:09 EDT",
    "prize":[1000, 250],
    "milestone":
        [
            {"prize": 100,
            "number": 5}
        ],
    "reliabilityBonus": 0,
    "digitalRunPoints": 500,
    "registrants" :
        [
            {
                "handle": "iRabbit",
                "reliability": "100%",
                "registrationDate": "10.31.2013 10:10 EDT"
            },
            {
                "handle": "hohosky",
                "reliability": "100%",
                "registrationDate": "10.31.2013 10:10 EDT"
            }
        ],
    "submissions" :
        [
            {
                "handle": "iRabbit",
                "placement": 1,
                "screeningScore": 97,
                "initialScore": 97,
                "final": 97,
                "points": 100,
                "submissionDate": "10.31.2013 10:10 EDT"
            },
            {
                "handle": "hohosky",
                "placement": 2,
                "screeningScore": 97,
                "initialScore": 96,
                "final": 96,
                "points": 50,
                "submissionDate": "10.31.2013 10:10 EDT"
            }
        ]
}');

$contestObj = $contestJson;

if($contestObj!=null) :
?>
<div id="content" class="contestContent">
	<div class="container">
		<div class="mainRail">

			<h2>Module Assembly - Cloud Spokes</h2>
			<div class="prizeTable">
				<div class="prizeItem placePrize">
					<label>1st Place</label>
					<span>$<?php echo $contestObj->prize[0];?></span>
				</div>
				<div class="prizeItem placePrize secondPrize">
					<label>2st Place</label>
					<span>$<?php echo $contestObj->prize[1];?></span>
				</div>
				<div class="prizeItem reabilityPrize">
					<label>Reability Bonus</label>
					<span>$<?php echo $contestObj->reliabilityBonus;?></span>
				</div>
				<div class="prizeItem drPoint">
					<label>DR Points</label>
					<span><?php echo $contestObj->digitalRunPoints;?></span>
				</div>
			</div>
			
			<h3 class="contestOverviewTitle">Contest Overview</h3>
			<div class="contestDescription">
				<?php echo $contestObj->description;?>
			</div>
			
		</div>
		<!-- End of .mainRail -->
			
		<aside class="rightRail">
			<div class="commonWidget posts">
				<header>
					<ul>
						<li class="current">
							Contest Timeline
						</li>
					</ul>
				</header>
				<div class="content">
					<div class="contestTimelinePara">
						<span class="label">Register By :</span>
						<?php echo $contestObj->registrationEndDate;?>
					</div>
					<div class="contestTimelinePara">
						<span class="label">Submit By :</span>
						<?php echo $contestObj->submissionEndDate;?>
					</div>
				</div>
				
				
				<div class="corner tl"></div>
				<div class="corner tr"></div>
				<div class="corner bl"></div>
				<div class="corner br"></div>
			</div>
			
			<div class="commonWidget archWidg posts">
				<header>
					<ul>
						<li class="current">Links</li>
					</ul>
				</header>
				<div class="content">
				<ul class="archList">
					<li><a href='http://community.topcoder.com/tc?module=ProjectDetail&pj=<?php echo $contestObj->contestId;?>' title='Register'>Register</a></li>
				</ul>

				</div>


				<div class="corner tl"></div>
				<div class="corner tr"></div>
				<div class="corner bl"></div>
				<div class="corner br"></div>
			</div>

			
		</aside>
			
		<div class="clear"></div>
		
	</div>
	<!-- End of .contentInner -->

</div>
<!-- End of #content -->
<?php endif; ?>
<?php get_footer(); ?>
