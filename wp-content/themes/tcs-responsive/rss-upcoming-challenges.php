<?php
/**
 * Template Name: RSS Upcoming Challenges
 * Challenges Feed Template
 */
header('Content-Type: ' . feed_content_type('rss-http') . '; charset=' . get_option('blog_charset'), true);
echo '<?xml version="1.0" encoding="' . get_option('blog_charset') . '"?' . '>';
echo '<?xml-stylesheet type="text/xsl" media="screen" href="' . get_stylesheet_directory_uri() . '/css/rss2full.xsl"?>';
$contestName = "";
$contestName = $contestType=="develop" ? "Development" : $contestName;
$contestName = $contestType=="design" ? "Design" : $contestName;
$contestName = $contestType=="data" ? "Data" : $contestName;
?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
    <?php do_action('rss2_ns'); ?>>
    <channel>
        <title><?php bloginfo_rss('name'); ?> - Upcoming <?php echo $contestName;?> Challenges</title>
        <atom:link href="<?php self_link(); ?>" rel="self" type="application/rss+xml"/>
        <link><?php bloginfo_rss('url') ?></link>
        <description><?php bloginfo_rss('description') ?></description>
        <sy:updatePeriod><?php echo apply_filters('rss_update_period', 'hourly'); ?></sy:updatePeriod>
        <sy:updateFrequency><?php echo apply_filters('rss_update_frequency', '1'); ?></sy:updateFrequency>
        <?php do_action('rss2_head'); ?>
        <?php
        $userkey = get_option('api_user_key');
        $listType = $_GET['list'];
        $contestType = $_GET['contestType'];
        $contests = array();

        if (!is_array($contests)) {
            $contests = array();
        }
		if($contestType=="data") {
			$contestsArr = get_upcoming_data_challenges_ajax($listType)->data;
			$contestsJson = json_encode($contestsArr);
			$contests = json_decode($contestsJson);
		}
		else {
			$contests = get_challenges_ajax($listType,$contestType)->data;
        }
		?>
        <?php if(count($contests)) foreach ($contests as $contest): ?>
            <?php if ($contestType == 'design' || $contestType== 'develop') : ?>
                <?php
                $contestDetail = get_contest_detail('', $contest->challengeId, $contestType, $noCache);
				//print_r($contestDetail);
                ?>
                <item>
                    <title><?php echo $contest->challengeName; ?></title>
                    <link><?php echo bloginfo(
                                'siteurl'
                            ) . '/challenge-details/' . $contest->challengeId . '?type=' . $contestType ?></link>
                    <description><![CDATA[<?php echo $contestDetail->introduction ?>]]></description>
                    <content:encoded><![CDATA[<?php if(property_exists($contestDetail, 'detailedRequirements')) echo $contestDetail->detailedRequirements; ?>]]></content:encoded>
                    <?php rss_enclosure(); ?>
                    <?php do_action('rss2_item'); ?>
                </item>
            <?php else:?>
                <item>
                    <title><?php echo $contest->name; ?></title>
					<link><![CDATA[<?php echo "http://community.topcoder.com/tc?module=MatchDetails&rd=".$contest->roundId; ?>]]></link>
					<description><![CDATA[<?php echo $contest->name; ?> will start at <?php echo $contest->startDate; ?>]]></description>
					<content:encoded><![CDATA[<?php echo $contest->name; ?> will start at <?php echo $contest->startDate; ?>]]></content:encoded>
                    <?php rss_enclosure(); ?>
                    <?php do_action('rss2_item'); ?>
                </item>
            <?php endif; ?>
        <?php endforeach; ?>
    </channel>
</rss>
