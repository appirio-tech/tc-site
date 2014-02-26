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

require_once 'ClassAutoloader.php';

class GooglePublisherPluginTags {

  private $configuration;
  private $current_page_type;

  /**
   * @param Configuration $configuration The configuration object to use
   *        (required).
   * @param boolean $display_ads True if ads should be displayed.
   */
  public function __construct($configuration, $display_ads) {
    $this->configuration = $configuration;
    add_action('wp_head', array($this, 'printPageType'));

    // To determine the current page type, WordPress needs to have
    // initialized wp_query. The template_redirect hook is the first
    // action hook after that initialization.
    add_action('template_redirect', array($this, 'determineCurrentPageType'));
    if ($display_ads) {
      add_action('wp_head', array($this, 'wpHead'), PHP_INT_MAX);
      add_filter('the_content', array($this, 'wpRepeating'), PHP_INT_MAX, 1);
      add_filter('the_excerpt', array($this, 'wpRepeating'), PHP_INT_MAX, 1);
      add_action('wp_footer', array($this, 'wpFooter'), ~PHP_INT_MAX);
    }
  }

  /**
   * Prints the page type to the page. Expected to be called on the wp_head
   * action hook.
   */
  public function printPageType() {
    printf('<meta name="google-publisher-plugin-pagetype" content="%s">',
           $this->current_page_type);
  }

  /**
   * Inserts tags into the <head> section. Expected to be called on the wp_head
   * action hook.
   */
  public function wpHead() {
    // Inserts a js script tag which don't need escaping.
    echo $this->configuration->getTag($this->current_page_type, 'head');
  }

  /**
   * Inserts the repeating tag before the content of every post and excerpt.
   * Executed as a filter on the_content and the_excerpt.
   *
   * @return string The given $content prefixed with the repeating tag for the
   *         current configuration.
   */
  public function wpRepeating($content) {
    $repeatingTag = $this->configuration->getTag(
        $this->current_page_type, 'repeating');

    return $repeatingTag . $content;
  }

  /**
   * Inserts tags at the end of the <body> section. Expected to be called on the
   * wp_footer action hook.
   */
  public function wpFooter() {
    // Inserts js script tags which don't need escaping.
    echo $this->configuration->getTag($this->current_page_type, 'repeating');
    echo $this->configuration->getTag($this->current_page_type, 'bodyEnd');
  }

  /**
   * Determines the current page type. This should be called after WordPress
   * has initialized wp_query.
   */
  public function determineCurrentPageType() {
    if (!isset($this->current_page_type)) {
      $this->current_page_type =
          GooglePublisherPluginUtils::getWordPressPageType();
    }
  }
}
