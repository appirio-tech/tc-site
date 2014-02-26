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

/**
 * A singleton class that manages the plugin configuration, stored using
 * the WordPress options system.
 */
class GooglePublisherPluginConfiguration {

  /** Name used to store options in WordPress option table. */
  const OPTIONS_NAME = 'GooglePublisherPlugin';

  /** Name used to store the plugin's version in WordPress option table. */
  const PLUGIN_VERSION_KEY = 'GooglePublisherPlugin_Version';

  /** Key used for root entry in $this->options. */
  const SITE_VERIFICATION_TOKEN_KEY = 'token';

  /** Key used for root entry in $this->options. */
  const SITE_ID_KEY = 'siteId';

  /** Key used for root entry in $this->options. */
  const TAGS_CONFIGURATION_KEY = 'tags';

  public function __construct() {
    $this->options = get_option(self::OPTIONS_NAME);
    $this->createMissingDefaultOptions();
  }

  public function get() {
    return $this->options[self::TAGS_CONFIGURATION_KEY];
  }

  /**
   * Gets a tag to embed on the given page type, at the given position.
   *
   * @param string $page_type The page type to get the tag for.
   * @param string $position The position to get the tag for.
   * @return string The tag to embed, or an empty string if none is set.
   */
  public function getTag($page_type, $position) {
    foreach ($this->options[self::TAGS_CONFIGURATION_KEY] as $tag) {
      if (array_key_exists('pageType', $tag) &&
          $tag['pageType'] == $page_type &&
          array_key_exists('position', $tag) && $tag['position'] == $position &&
          array_key_exists('code', $tag)) {
        return $tag['code'];
      }
    }
    return '';
  }

  /**
   * Stores the latest site config.
   *
   * @return string 'OK' on success, or a string describing the error
   *     on failure.
   */
  public function updateConfig($jsonEncodedConfig) {
    $decoded = json_decode($jsonEncodedConfig, true);
    if ($decoded === null) {
      return 'Failed to decode configuration (invalid JSON)';
    }
    if (!is_array($decoded)) {
      return 'Unexpected object received (array expected)';
    }
    if (array_key_exists('tags', $decoded)) {
      $tags = $decoded['tags'];
    } else {
      $tags = array();
    }
    if (!is_array($tags)) {
      return 'Unexpected tags received (array expected)';
    }
    $this->options[self::TAGS_CONFIGURATION_KEY] = $tags;
    update_option(self::OPTIONS_NAME, $this->options);
    return 'OK';
  }

  /**
   * Writes the site verification token to the configuration. The configuration
   * allows multiple tokens to be set.
   *
   * @param string $token The token to add.
   */
  public function writeSiteVerificationToken($token) {
    array_push($this->options[self::SITE_VERIFICATION_TOKEN_KEY], $token);
    update_option(self::OPTIONS_NAME, $this->options);
    /*
     * Clears the WordPress object cache whenever we change the site
     * verification token.
     *
     * (http://codex.wordpress.org/Class_Reference/WP_Object_Cache).
     * Usually, WP object cache is cleared after each request. But some
     * cache plugins, e.g., batcache, keep cached object persistent across
     * requests. The cache buster URL parameter does not help in this situation.
     * But it does help over the page level cache, e.g., in W3 Total Cache.
     *
     * Plugins are free to cache under whatever namespace and key, there is
     * no way for us to know which cached object corresponds to the HTML
     * head. So we have to clear everything.
     */
    wp_cache_flush();
  }

  /**
   * Gets the site verification tokens from the configuration.
   *
   * @return array An array of tokens, or an empty array if none was set.
   */
  public function getSiteVerificationTokens() {
    return $this->options[self::SITE_VERIFICATION_TOKEN_KEY];
  }

  /**
   * Writes the site ID to the configuration.
   *
   * @param string $id The site ID to set.
   */
  public function writeSiteId($id) {
    $this->options[self::SITE_ID_KEY] = $id;
    update_option(self::OPTIONS_NAME, $this->options);
  }

  /**
   * Gets the site ID from the configuration.
   *
   * @return string|null The site ID, or null if none was set.
   */
  public function getSiteId() {
    return $this->options[self::SITE_ID_KEY];
  }

  /**
   * Creates the missing entries in $this->options.
   */
  private function createMissingDefaultOptions() {
    if (empty($this->options)) {
      $this->options = array();
    }
    $default_values = array(
        self::SITE_VERIFICATION_TOKEN_KEY => array(),
        self::SITE_ID_KEY => null,
        self::TAGS_CONFIGURATION_KEY => array());

    $this->options = array_merge($default_values, $this->options);
  }
}
