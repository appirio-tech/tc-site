<?php

if (isset($_GET['_escaped_fragment_']) || 
	(isset($_SERVER['HTTP_USER_AGENT']) && strpos($_SERVER['HTTP_USER_AGENT'], 'facebookexternalhit') !== false)) {
	$opts = array('http'=>array('method'=>"GET", 'header'=>"X-Prerender-Token: fC07JMTM06w1k8RIdLDs\r\n"));
	$context = stream_context_create($opts);

	$renderer = 'http://service.prerender.io/http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
	$rendered = file_get_contents($renderer, false, $context);
	echo $rendered;
	return;
}

foreach ($_GET as $key => $value) {
	$_GET[$key] = filter_input(INPUT_GET, $key, FILTER_SANITIZE_STRING);
}

foreach ($_POST as $key => $value) {
	$_POST[$key] = filter_input(INPUT_POST, $key, FILTER_SANITIZE_STRING);
}

foreach ($_COOKIE as $key => $value) {
	$_COOKIE[$key] = filter_input(INPUT_COOKIE, $key, FILTER_SANITIZE_STRING);
}

foreach ($_SERVER as $key => $value) {
	$_SERVER[$key] = filter_input(INPUT_SERVER, $key, FILTER_SANITIZE_STRING);
}

foreach ($_ENV as $key => $value) {
	$_ENV[$key] = filter_input(INPUT_ENV, $key, FILTER_SANITIZE_STRING);
}

$_REQUEST = array_merge( $_GET, $_POST );

/**
 * Front to the WordPress application. This file doesn't do anything, but loads
 * wp-blog-header.php which does and tells WordPress to load the theme.
 *
 * @package WordPress
 */

/**
 * Tells WordPress to load the WordPress theme and output it.
 *
 * @var bool
 */
define('WP_USE_THEMES', true);

/** Loads the WordPress Environment and Template */
require( dirname( __FILE__ ) . '/wp-blog-header.php' );
