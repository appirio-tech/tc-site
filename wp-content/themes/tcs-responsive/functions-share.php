<?php

function add_share($post = null, $size = 32) {

  $url = NULL;

  if (isset($post)) {
    $dateObj = DateTime::createFromFormat('Y-m-d H:i:s', $post->post_date);
    $dateStr = $dateObj->format('M j, Y');

    $title = htmlspecialchars($post->post_title);
    $subject = htmlspecialchars(get_bloginfo('name')).' : '.$title;
    $body = htmlspecialchars($post->post_content);
    $excerpt = $post->post_excerpt;
    if (is_null($excerpt) || empty($excerpt)) {
      $excerpt = get_post_meta($post->ID, 'tc_excerpt', true);
    }
    if (is_null($excerpt) || empty($excerpt)) {
      $excerpt = str_replace(array("\r\n", "\r", "\n"), " ", substr($body, 0, 100));
    }

    $url = get_permalink( $post->ID );
  }

  $contestID = get_query_var('contestID');
  $contestType = $_GET['type'];

  if (isset($contestID) && isset($contestType)) {
    $contest = get_contest_detail('',$contestID, $contestType);
    if (isset($contest)) {
      $title = $contest->challengeName;
      $body = strip_tags($contest->detailedRequirements);
      $excerpt = str_replace(array("\r\n", "\r", "\n"), " ", substr($body, 0, 100));
    }
  }

  $addThisUrl = (!is_null($url)) ? 'addthis:url="'.$url.'"' : '';

  $addThisText = $title."\n".$excerpt;
  $email = ($force) ? 'addthis:title="'.$addThisText.'"' : '';
  $facebook = ($force) ? 'addthis:title="'.$addThisText.'"' : '';
  $gplus = ($force) ? 'addthis:title="'.$addThisText.'"' : '';
  $twitter = 'tw:text="'.$addThisText.'" addthis:title="'.$addThisText.'"';
  
  $style = ($size == 32) ? 'addthis_32x32_style' : '';

  $html = <<< EOD
<!-- AddThis Button BEGIN -->
<div class="addthis_toolbox addthis_default_style $style" addthis:title="$title" $addThisUrl>
<a class="addthis_button_email" $email></a>
<a class="addthis_button_facebook" $facebook></a>
<a class="addthis_button_twitter" $twitter></a>
<a class="addthis_button_google_plusone_share" $gplus></a>
<a class="addthis_button_compact"></a>
<a class="addthis_counter addthis_bubble_style"></a>
</div>
<script type="text/javascript">
var addthis_config = {"data_track_addressbar":true}; addthis_config.ui_email_note = "$excerpt"; 
var addthis_share = { url: location.href, title: "$title" }
</script>
<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-52f22306211cecfc"></script>
<!-- AddThis Button END -->
EOD;

  echo $html;
}
?>

