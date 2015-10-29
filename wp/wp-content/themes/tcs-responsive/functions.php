<?php

// Define once because it's faster
define('THEME_URL', get_template_directory_uri());
define('CURRENT_FULL_URL', add_query_arg($wp->query_string, '', home_url($wp->request)));

@ini_set('display_errors', 1);

define("BLOG", "blog");

locate_template('config/env.php', TRUE);
locate_template('lib/config.php', TRUE);

// Setup config
tc_load_config();

locate_template('lib/scripts.php', TRUE);
locate_template('lib/widget.php', TRUE);
locate_template("config/rewrite-config.php", TRUE);
locate_template('lib/rewrite_rules.php', TRUE);
locate_template('lib/options.php', TRUE);
locate_template('lib/sidebars.php', TRUE);
locate_template('lib/menu.php', TRUE);
locate_template('lib/comments.php', TRUE);
locate_template('lib/meta.php', TRUE);
locate_template('lib/share.php', TRUE);
locate_template("lib/rss.php", TRUE);
locate_template("lib/post_types.php", TRUE);
locate_template("lib/ajax.php", TRUE);
locate_template("lib/images.php", TRUE);
locate_template("lib/member-profile/config.php", TRUE);

if (!empty($skipAdminSSL)) {
  force_ssl_admin(false);
}

// enables tags on pages
function tags_support_all() {
  register_taxonomy_for_object_type('post_tag', 'page');
}

add_action('init', 'tags_support_all');

date_default_timezone_set(get_option('timezone_string'));

function get_rel_url($url, $force = FALSE) {
  if (!strstr($url, $_SERVER['HTTP_HOST']) && !$force) {
    return $url;
  }
  $url_info = parse_url($url);
  $link = $url_info['path'];
  if (isset($url_info['query']) && strlen($url_info['query'])) {
    $link .= '?' . $url_info['query'];
  }
  return $link;
}

if( strpos(CURRENT_FULL_URL,ACTIVE_CONTESTS_PERMALINK) !== false ||
	strpos(CURRENT_FULL_URL,PAST_CONTESTS_PERMALINK) !== false ||
	strpos(CURRENT_FULL_URL,REVIEW_OPPORTUNITIES_PERMALINK) !== false )
{
	if( strpos(CURRENT_FULL_URL,"%20") !== false ) {
		$redirectUrl = str_replace("%20", "_", CURRENT_FULL_URL);
		$redirectString = "Location: $redirectUrl";
		print_r($redirectString);
		header($redirectString);
		exit;
	}
}

/**
 * Get the current full url
 *
 * @deprecated use CURRENT_FULL_URL
 *
 * @return string
 */
function curPageURL() {
  return CURRENT_FULL_URL;
}

function get_page_link_by_slug($page_slug) {
  $page = get_page_by_path($page_slug);
  if ($page) :
    return get_permalink($page->ID);
  else :
    return "#";
  endif;
}

function wpb_set_post_views($postID) {
  $count_key = 'wpb_post_views_count';
  $count = get_post_meta($postID, $count_key, TRUE);
  if ($count == '') {
    $count = 0;
    delete_post_meta($postID, $count_key);
    add_post_meta($postID, $count_key, '0');
  }
  else {
    $count++;
    update_post_meta($postID, $count_key, $count);
  }
}


function wpb_track_post_views($post_id) {
  if (!is_single()) {
    return;
  }
  if (empty ($post_id)) {
    global $post;
    $post_id = $post->ID;
  }
  wpb_set_post_views($post_id);
}

add_action('wp_head', 'wpb_track_post_views');
/**
 * add filter for query_vars
 */
function tcapi_query_vars($query_vars) {
  $query_vars [] = 'contest_type';
  $query_vars [] = 'contestID';
  $query_vars [] = 'page';
  $query_vars [] = 'pages';
  $query_vars [] = 'post_per_page';
  $query_vars [] = 'handle';
  $query_vars [] = 'slug';
  $query_vars [] = 'tab';
  $query_vars [] = 'ct';
  $query_vars [] = 'list';
  $query_vars [] = 'contestType';
  $query_vars [] = 'pageNumber';
  $query_vars [] = 'role';
  $query_vars [] = 'termsOfUseID';
  $query_vars [] = 'autoRegister';
  $query_vars [] = 'type';
  $query_vars [] = 'nocache';
  $query_vars [] = 'challenge-type';
  $query_vars [] = 'technologies';
  $query_vars [] = 'platforms';
  $query_vars [] = 'lc';
  return $query_vars;
}

add_filter('query_vars', 'tcapi_query_vars');


/* commonly used functions
 -----------------------------------*/
/* excerpt */
function new_excerpt_more($more) {
  return '...<br/>' . '<a href="' . get_permalink(get_the_ID()) . '" class="more">Read More</a>';
}

add_filter('excerpt_more', 'new_excerpt_more');

function custom_excerpt_length($length) {
  return 27;
}

add_filter('excerpt_length', 'custom_excerpt_length', 999);

function custom_excerpt($new_length = 20, $new_more = '...') {
  add_filter(
    'excerpt_length',
    function () use ($new_length) {
      return $new_length;
    },
    999
  );
  add_filter(
    'excerpt_more',
    function () use ($new_more) {
      return $new_more;
    }
  );
  $output = get_the_excerpt();
  $output = apply_filters('wptexturize', $output);
  $output = apply_filters('convert_chars', $output);
  $output = $output;
  echo $output;
}

function custom_content($new_length = 55) {
  $output = get_the_content();
  $output = apply_filters('wptexturize', $output);
  $output = substr($output, 0, $new_length);
  return $output;
}

/* singnup function from given theme */
function get_cookie() {
  global $_COOKIE;
  // $_COOKIE['main_user_id_1'] = '22760600|2c3a1c1487520d9aaf15917189d5864';
  $hid = explode("|", $_COOKIE ['main_tcsso_1']);
  $handleName = $_COOKIE ['handleName'];
  // print_r($hid);
  $hname = explode("|", $_COOKIE ['direct_sso_user_id_1']);
  $meta = new stdclass ();
  $meta->handle_id = $hid [0];
  $meta->handle_name = $handleName;
  return $meta;
}

// add menu support
add_theme_support('menus');

remove_filter('the_content', 'wpautop');

function fixIERoundedCorder() {
  $pieHtcLocation = get_bloginfo('stylesheet_directory') . "/css/PIE.htc";
  ?>
  <style>
    .btn, a.btn, .blogCategoryMenu a, .searchBox input, .subscribeBox input {
      behavior: url("<?php echo $pieHtcLocation;?>");
    }
  </style>
<?php
}

function get_user_browser() {
  $u_agent = $_SERVER['HTTP_USER_AGENT'];
  $ub = '';
  if (preg_match('/MSIE/i', $u_agent)) {
    $ub = "ie";
  }
  elseif (preg_match('/Firefox/i', $u_agent)) {
    $ub = "firefox";
  }
  elseif (preg_match('/Safari/i', $u_agent)) {
    $ub = "safari";
  }
  elseif (preg_match('/Chrome/i', $u_agent)) {
    $ub = "chrome";
  }
  elseif (preg_match('/Flock/i', $u_agent)) {
    $ub = "flock";
  }
  elseif (preg_match('/Opera/i', $u_agent)) {
    $ub = "opera";
  }

  return $ub;
}

/**
 * wrap content to $len length content, and add '...' to end of wrapped conent
 */
function wrap_content_strip_html($content, $len, $strip_html = FALSE, $sp = '\n\r', $ending = '...') {
  if ($strip_html) {
    $content = strip_tags($content);
    $content = strip_shortcodes($content);
  }
  $c_title_wrapped = wordwrap($content, $len, $sp);
  $w_title = explode($sp, $c_title_wrapped);
  if (strlen($content) <= $len) {
    $ending = '';
  }
  return $w_title[0] . $ending;
}

/* get page id by slug */
function get_ID_by_slug($page_slug) {
  $page = get_page_by_path($page_slug);
  if ($page) {
    return $page->ID;
  }
  else {
    return NULL;
  }
}

/* function convert category slug to category id  */
function getCategoryId($slug) {
  $idObj = get_category_by_slug($slug);
  $id = $idObj->term_id;
  return $id;
}

/* function to stop WordPress from hitting home page when search keyword is empty */
function empty_search_filter($query) {
    // If 's' request variable is set but empty
    if (isset($_GET['s']) && empty($_GET['s']) && $query->is_main_query()){
        $query->is_search = true;
        $query->is_home = false;
    }
    return $query;
}

/* function to get auth0 client ID string */
function auth0_clientID() {
  return defined('CONFIG_AUTH0_CLIENTID') ? CONFIG_AUTH0_CLIENTID : '6ZwZEUo2ZK4c50aLPpgupeg5v2Ffxp9P';
}

/* function to get auth0 callback url */
function auth0_callbackURL() {
  return defined('CONFIG_AUTH0_CALLBACKURL') ? CONFIG_AUTH0_CALLBACKURL : 'https://www.topcoder.com/reg2/callback.action';
}

/* function to get main auth0 url */
function auth0_URL() {
  return defined('CONFIG_AUTH0_URL') && strlen(CONFIG_AUTH0_URL) > 0 ? CONFIG_AUTH0_URL : 'topcoder.auth0.com';
}

/**
 * Function to get the registartion callback
 */
function tc_reg_callback() {
  return add_query_arg(array('action' => 'callback'), CURRENT_FULL_URL);
}

/* function to get auth0 LDAP */
function auth0_LDAP() {
  return defined('CONFIG_AUTH0_LDAP') ? CONFIG_AUTH0_LDAP : 'LDAP';
}

/* function to get the community URL */
function community_URL() {
  return defined('CONFIG_COMMUNITY_URL') ? CONFIG_COMMUNITY_URL : '//community.topcoder.com';
}

add_filter('pre_get_posts','empty_search_filter');

/*function to format text into twitter post*/
function createTwitterPost($text, $permalink) {
  return "//twitter.com/home?status=Blog:%20" . str_replace('%0A','',urlencode(wrap_content_strip_html(wpautop($text), 100, true,'\n\r')) . " " . $permalink . " via @topcoder");
}

/* Related posts */
if (!function_exists('mk_blog_similar_posts')) {
    function mk_blog_similar_posts($post_id)
    {
        
        global $post, $mk_options, $single_layout;
                
        $backup = $post;
        $categories = get_the_terms($post->ID, 'member-onboarding-categories');
        $categoriesIDs = array();
        $related_post_found = false;
        $showposts = 3;
        $column_css = 'three-cols';
        
        if ($categories) {
            foreach($categories as $key=>$category) {
                $categoriesIDs[$key] = $category->term_id;
            }
            $related = new WP_Query(array(
                'post_type' => 'member-onboarding',
                'tax_query' => array(
                    array(
                        'taxonomy' => 'member-onboarding-categories',
                        'field'    => 'id',
                        'terms'    => $categoriesIDs,
                    ),
                ),
                'post__not_in' => array(
                    $post->ID
                ) ,
                'showposts' => $showposts,
                'ignore_sticky_posts' => 1
            ));
            $output = '';
            if ($related->have_posts()) {
                $related_post_found = true;
                $output.= '<section class="blog-similar-posts">';
				$output.= '<div class="similar-post-title">' . __('Related content', 'mk_framework') . '</div>';
                $output.= '<ul class="' . $column_css . '">';
                while ($related->have_posts()) {
                    $related->the_post();
                    $output.= '<li><div class="similar-post-holder">';
                    $output.= '<a class="mk-similiar-thumbnail" href="' . get_permalink() . '" title="' . get_the_title() . '">';
                    if (has_post_thumbnail()) {
                        $image_src_array = wp_get_attachment_image_src(get_post_thumbnail_id() , 'full', true);
                        $image_src = $image_src_array[0];
                    } 
                    else {
                        $image_src = '/mf/i/dummy-images/dummy-'.mt_rand(1,7).'.png';
                    }
                    $output.= '<img src="' . $image_src . '" alt="' . get_the_title() . '" />';
                    $output.= '<div class="image-hover-overlay"></div></a>';
                    $output.= '<a href="' . get_permalink() . '" class="mk-similiar-title">' . get_the_title() . '</a>';
                    $output.= '</div></li>';
                }
                $output.= '</ul>';
                $output.= '<div class="clearboth"></div></section>';
            }
            $post = $backup;
        }
        if (!$related_post_found) {
            $recent = new WP_Query(array(
                'post_type' => 'member-onboarding',
                'showposts' => $showposts,
                'nopaging' => 0,
                'post_status' => 'publish',
                'ignore_sticky_posts' => 1
            ));
            $output = '';
            if ($recent->have_posts()) {
                $related_post_found = true;
                $output.= '<section class="blog-similar-posts">';
                $output.= '<div class="similar-post-title">' . __('Recent Articles', 'mk_framework') . '</div>';
                $output.= '<ul class="' . $column_css . '">';
                while ($recent->have_posts()) {
                    $recent->the_post();
                    $output.= '<li><div class="similar-post-holder">';
                    $output.= '<a class="mk-similiar-thumbnail" href="' . get_permalink() . '" title="' . get_the_title() . '">';
                    if (has_post_thumbnail()) {
                        $image_src_array = wp_get_attachment_image_src(get_post_thumbnail_id() , 'full', true);
                        $image_src = $image_src_array[0];
                        $output.= '<img src="' . $image_src . '" alt="' . get_the_title() . '" />';
                    } 
                    else {
                        $image_src = '/mf/i/dummy-images/dummy-'.mt_rand(1,7).'.png';
                        $output.= '<img src="' . $image_src . '" alt="' . get_the_title() . '" />';
                    }
                    $output.= '</a>';
                    $output.= '<a href="' . get_permalink() . '" class="mk-similiar-title">' . get_the_title() . '</a>';
                    $output.= '</div></li>';
                }
                $output.= '</ul>';
                $output.= '<div class="clearboth"></div></section>';
            }
        }
        wp_reset_postdata();
        echo $output;
    }
}

add_action('blog_similar_posts', 'mk_blog_similar_posts');

/**
 * Adds Next/Previous post navigations to single posts
 *
 */

function mk_post_nav($same_category = true, $taxonomy = 'member-onboarding-categories')
{

    global $mk_options;
  
    if(!is_singular('member-onboarding'))
        return false;

    $options = array();
    $options['same_category'] = true;
    $options['excluded_terms'] = '';

    $options['type'] = get_post_type();
    $options['taxonomy'] = $taxonomy;

    if(!is_singular() || is_post_type_hierarchical($options['type'])) 
        $options['is_hierarchical'] = true;

    $options = apply_filters('mk_post_nav_settings', $options);

    $entries['prev'] = get_previous_post($options['same_category'], $options['excluded_terms'], $options['taxonomy']);
    $entries['next'] = get_next_post($options['same_category'], $options['excluded_terms'], $options['taxonomy']);

    $entries = apply_filters('mk_post_nav_entries', $entries, $options);
    $output = "";


    foreach ($entries as $key => $entry) {
        if(empty($entry)) continue;

        $post_type =  get_post_type($entry->ID);

        $icon   = $post_image = "";
        $link  = get_permalink($entry->ID);
        $image = get_the_post_thumbnail($entry->ID, 'thumbnail');
        $class = $image ? "with-image" : "without-image";
        $icon = ($key == 'prev') ? '<i class="mk-icon-long-arrow-left"></i>' : '<i class="mk-icon-long-arrow-right"></i>';
        $output .= '<a class="mk-post-nav mk-post-'.$key.' '.$class.'" href="'.$link.'">';
          
          
        $output .= '<span class="pagnav-wrapper">';
        $output .= '<span class="pagenav-top">';

        $icon = '<span class="mk-pavnav-icon">'.$icon.'</span>';

        if($image) {
            $post_image = '<span class="pagenav-image">'.$image.'</span>';
        }

        $output .= $key == 'next' ?  $icon.$post_image : $post_image.$icon;
        $output .= "</span>";

        $output .= '<div class="nav-info-container">';
        $output .= '<span class="pagenav-bottom">';

        $output .= '<span class="pagenav-title">'.get_the_title($entry->ID).'</span>';

        $output .= "</span>";  
        $output .= "</div>";     
        $output .= "</span>";
        $output .= "</a>";
      }
      echo $output;
}
add_action( 'wp_footer', 'mk_post_nav' );
 
register_taxonomy( "member-onboarding-categories", 
	array( 	"member-onboarding" ), 
	array( 	"hierarchical" => true,
			"labels" => array('name'=>"Member Onboarding Type",'add_new_item'=>"Add New Type"), 
			"singular_label" => __( "Field" ), 
			"rewrite" => array( 'slug' => 'fields', // This controls the base slug that will display before each term 
							'with_front' => false)
		 ) 
);

// Video Autoplay
function autoplay_video( $provider ) {
  $provider = add_query_arg( 'autoplay', 1 , $provider );
  $provider = add_query_arg( 'loop', 1 , $provider );
  return $provider;
}
add_filter('oembed_fetch_url', 'autoplay_video', 10, 3);

// Youtube autoplay
function autoplay_youtube($html, $url, $args) {
    if(strstr($url, "youtube"))
        $html = str_replace("?feature=oembed", "?feature=oembed&autoplay=true&rel=0", $html);
    
    return $html;
}
add_filter('embed_oembed_html', 'autoplay_youtube', 10, 3);
 

?>
