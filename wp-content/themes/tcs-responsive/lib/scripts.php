<?php

/**
 * @file
 * Enqueue scripts and stylesheets
 *
 * CDN will also be used for jquery.  We will have a local fallback
 * The theme option jsCssUseCDN will be used to say if local files will be on the cdn.
 *  Grunt script is what pushes the script.
 * Theme option jsCssUseMin will be used to only enqueue the min version.
 *  Grunt will create a style.css and script.js file that will contain all of the local code
 */

function tcs_responsive_scripts() {
  // register all of the scripts
  $assets = array(
    'css' => '/css/style.min.css',
    'js' => '/js/script.min.js',
    'jquery' => '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
    'respond'   =>  '/js/vendor/respond.min.js',
    'modernizr' => '/js/vendor/modernizr.js',
    'html5shiv' => '/js/vendor/html5shiv.js',
    'auth0' => '//d19p4zemcycm7a.cloudfront.net/w2/auth0-1.2.2.min.js'
  );

  $assets_develop = array(
    'css' => array(
      '/css/blog.css',
      '/css/blog-responsive.css',
      '/css/base.css',
      '/css/style.css',
      '/css/style-profile.css',
      '/css/base-responsive.css',
      '/css/style-responsive.css',
      '/css/coder.css',
      '/css/contact-about.css',
      '/css/profileBadges.css',
      '/css/register-login.css',
      '/css/blog-base.css',
      '/css/community-landing.css',
      '/css/challenge-detail-software.css',
      '/css/ie.css'
    ),
    'js' => array(
      '/js/vendor/jquery/jquery.bxslider.js',
      '/js/vendor/jquery/jquery.easing.1.3.js',
      '/js/vendor/jquery/jquery.mousewheel.js',
      '/js/vendor/raphael-min.js',
      '/js/vendor/jquery/jquery.carousel.js',
      '/js/vendor/jquery/jquery.customSelect.min.js',
      '/js/vendor/swipe.js',
      '/js/vendor/jquery/jquery.inputhints.js',
      '/js/scripts.js',
      '/js/script-member.js',
      '/js/register-login.js',
      '/js/blog.js',
      '/js/contact-about.js',
      '/js/init-header.js',
      '/js/challenge-detail-software.js',
      '/js/vendor/jquery/jquery.jscrollpane.min.js',
      '/js/vendor/jquery/jquery.mousewheel.js',
      '/js/vendor/jquery/jquery.column-1.0.js'
    )
  );



  // Setup jquery cdn
  wp_deregister_script('jquery');
  wp_register_script('jquery', $assets['jquery'], array(), "1.10.2", false);
  add_filter('script_loader_src', 'tsc_jquery_local_fallback', 10, 2);

  // Always include auth0
  wp_register_script("auth0", $assets['auth0'] . $ext, array(), "1.2.2", true);

  // resgister stuff that is included at different times in the theme
  wp_register_script('modernizr', THEME_URL . $assets['modernizr'], array(), null, false);
  wp_register_script('respond', THEME_URL . $assets['respond'], array(), null, false);
  wp_register_script('html5shiv', THEME_URL, $assets['html5shiv'], array(), null, false);
  wp_register_style('ie', THEME_URL, $assets['ie']);

  $jsCssUseCDN = get_option("jsCssUseCDN", false);
  $jsCssCDNBase = get_option("jsCssCDNBase", THEME_URL);
  $jsCssVersioning = get_option("jsCssVersioning", false);
  $jsCssCurrentVersion = get_option("jsCssCurrentVersion", false);
  $jsCssUseMin = get_option("jsCssUseMin", false);


  // check if the browser supports gzip so we can specify the gzip version of resources
  $ext = '';
  if ($jsCssUseCDN && strpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') !== false) {
    $ext = '.gz';
  }

  // Setup up base url if using cdn.  safe fallback to theme url
  $base_url = $jsCssUseCDN ? $jsCssCDNBase : THEME_URL;

  // if we are using cdn and version then add the version to the path
  if ($jsCssUseCDN && $jsCssVersioning) {
    $base_url .= '/' . $jsCssCurrentVersion;
  }

  // If we are not using min/cat files then use all of the develop files
  if ($jsCssUseMin) {
    wp_register_script('custom', $base_url . $assets['js'] . $ext, array('jquery'), null, true);
    wp_register_style('custom', $base_url . $assets['css'] . $ext);
  } else {
    $i = 0;
    foreach ($assets_develop['js'] as $js_script) {
      //wp_register_script("custom-{$i}", $base_url . $js_script . $ext);
      wp_enqueue_script("custom-{$i}", $base_url . $js_script . $ext);
      $i++;
    }

    $i = 0;
    foreach ($assets_develop['css'] as $css_script) {
      wp_enqueue_style("custom-{$i}", $base_url . $css_script . $ext);
      $i++;
    }
  }
}

add_action('wp_enqueue_scripts', 'tcs_responsive_scripts', 100);

// http://wordpress.stackexchange.com/a/12450
function tsc_jquery_local_fallback($src, $handle = null) {
  static $add_jquery_fallback = false;

  if ($add_jquery_fallback) {
    echo '<script>window.jQuery || document.write(\'<script src="' .  THEME_URL . '/js/vendor/jquery/jquery.js"><\/script>\')</script>' . "\n";
    $add_jquery_fallback = false;
  }

  if ($handle === 'jquery') {
    $add_jquery_fallback = true;
  }

  return $src;
}
add_action('wp_head', 'tsc_jquery_local_fallback');