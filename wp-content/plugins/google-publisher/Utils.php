<?php
/*
Copyright 2013 Google Inc. All Rights Reserved.

This file is part of the Google Publisher Plugin.

The Google Publisher Plugin is free software:
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation,
either version 2 of the License, or (at your option) any later version.

The Google Publisher Plugin is distributed in the hope that it
will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General
Public License for more details.

You should have received a copy of the GNU General Public License
along with the Google Publisher Plugin.
If not, see <http://www.gnu.org/licenses/>.
*/

if(!defined('ABSPATH')) {
  exit;
}

/** Static class containing utility functions. */
class GooglePublisherPluginUtils {

  private static $REQUIRED_EXTENSIONS = array('filter', 'json', 'pcre', 'SPL');

  const MINIMUM_PHP_VERSION = '5.2.0';

  /**
   * Gets the page type from WordPress.
   *
   * @return string A string representation of the current page type,
   *     corresponding to the values used by publisherplugin.google.com.
   */
  public static function getWordPressPageType() {
    // is_front_page() returns true if (1) a static front page is set and this
    // is that page, or (2) the front page is the blog home page and this
    // is the blog home page.
    if (is_front_page()) {
      return 'front';
    }
    if (is_home()) {
      return 'home';
    }
    if (is_single()) {
      return 'singlePost';
    }
    if (is_page()) {
      return 'page';
    }
    if (is_category()) {
      return 'category';
    }
    if (is_archive()) {
      return 'archive';
    }
    if (is_search()) {
      return 'search';
    }
    if (is_404()) {
      return 'errorPage';
    }
    return '';
  }

  /**
   * @return array An array of URLs to be analyzed. The number of
   *     URLs varies based on the WordPress configuration.
   */
  public static function getUrlsToAnalyze() {
    $urls = array();

    $siteUrl = self::getFrontPageUrl();
    $urls['siteUrl'] = $siteUrl;

    $latestPostUrl = self::getLatestPostUrl();
    if ($latestPostUrl != '') {
      $urls['latestPostUrl'] = $latestPostUrl;
    }

    $postsUrl = self::getPostsUrl();
    if ($postsUrl != '') {
      $urls['postsUrl'] = $postsUrl;
    }

    $latestSinglePageUrl = self::getLatestSinglePageUrl($siteUrl, $postsUrl);
    if ($latestSinglePageUrl != '') {
      $urls['latestSinglePageUrl'] = $latestSinglePageUrl;
    }

    $latestArchiveUrl = self::getLatestArchiveUrl();
    if ($latestArchiveUrl != '') {
      $urls['latestArchiveUrl'] = $latestArchiveUrl;
    }

    $categoryUrl = self::getCategoryUrl();
    if ($categoryUrl != '') {
      $urls['categoryUrl'] = $categoryUrl;
    }

    $urls['searchUrl'] = get_search_link('wordpress');

    return $urls;
  }

  static function getFrontPageUrl() {
    return trailingslashit(get_home_url());
  }

  /**
   * Returns the permalink URL of the latest post if one exists.
   * Otherwise returns ''.
   */
  static function getLatestPostUrl() {
    $result = self::getRecentPosts('post', 1);
    if (is_array($result) && !empty($result)) {
      return esc_url(get_permalink($result[0]->ID));
    }
    return '';
  }

  /**
   * Returns the permalink URL of the posts page, aka, the (blog) home page,
   * if one exists. Otherwise returns ''.
   */
  static function getPostsUrl() {
    if (get_option('show_on_front') == 'page') {
      $postsPageId = get_option('page_for_posts');
      return esc_url(get_permalink($postsPageId));
    }
    return '';
  }

  /**
   * Returns the permalink URL to the latest single page which is different
   * from the site URL and the posts URL. If not found returns ''.
   */
  static function getLatestSinglePageUrl($siteUrl, $postsUrl) {
    $result = self::getRecentPosts('page', 3);
    foreach ($result as $page) {
      $pageUrl = esc_url(get_permalink($page->ID));
      if ($pageUrl != $siteUrl && $pageUrl != $postsUrl) {
        return $pageUrl;
      }
    }
    return '';
  }

  /**
   * Returns a latest monthly archive URL if one exists. Otherwise returns ''.
   */
  static function getLatestArchiveUrl() {
    $link = wp_get_archives(array('format' => 'link', 'echo' => 0,
        'limit' => 1, 'order' => 'DESC'));
    preg_match('/href\s*=\s*[\'\"]([^\'\"]+)[\'\"]/', $link, $matches);
    if (sizeof($matches) == 2) {
      return $matches[1];
    } else {
      return '';
    }
  }

  /**
   * Returns a category URL if one exists. Otherwise returns ''.
   */
  static function getCategoryUrl() {
    $category = get_categories(array('number' => 1));
    if (sizeof($category) == 1) {
      $categoryUrl = get_category_link($category[0]->term_id);
      return $categoryUrl;
    } else {
      return '';
    }
  }

  /**
   * Returns a given number of recent posts of the given type.
   *
   * @param string $type The type of posts to retrieve.
   * @param int $number The number of posts to retrieve.
   */
  private static function getRecentPosts($type, $number) {
    return get_posts(array('numberposts' => $number,
        'orderby' => 'post_date', 'order' => 'DESC', 'post_type' => $type,
        'post_status' => 'publish', 'suppress_filters' => true));
  }

  /**
   * Stops php interpretation.
   * When running unit tests, calls wp_die which can be intercepted by the
   * test environment.
   */
  public static function dieSilently() {
    global $GOOGLE_PUBLISHER_PLUGIN_UNIT_TESTS;
    if (isset($GOOGLE_PUBLISHER_PLUGIN_UNIT_TESTS)) {
      wp_die();
    }
    die();
  }

  /**
   * Checks whether the current user is an administrator and the current page
   * is an admin page. If not, wp_die is called.
   */
  public static function checkAdminRights() {
    if (is_admin() && current_user_can('manage_options'))  {
      return;
    }
    wp_die(__('You do not have sufficient permissions to access this page.'));
  }

  public static function meetsMinimumRequirements() {
    foreach (self::$REQUIRED_EXTENSIONS as $extension) {
      if (!extension_loaded($extension)) {
        return false;
      }
    }

    return version_compare(self::MINIMUM_PHP_VERSION, phpversion(), '<=');
  }

  public static function meetsMinimumRequirementsOrDie() {
    if (!self::meetsMinimumRequirements()) {
      wp_die(__('Plugin activation failed. Your WordPress installation ' .
                'doesn\'t meet the minimum requirements.',
                'google-publisher-plugin'),
             '',
             array('response' => 200, 'back_link' => true));
    }
  }
}
