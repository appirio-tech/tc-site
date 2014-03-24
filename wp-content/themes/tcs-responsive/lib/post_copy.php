<?php

/**
 * @file
 * Post Domain copy steps
 */

/**
 * Post Domain Copy Steps
 *
 * @TODO make this an action
 *
 * @param $settings array
 */
function tc_post_copy_steps($settings) {
  tc_update_base_url($settings);
  tc_clear_resgistry_cache();
}


/**
 * Update the base url
 *
 * @param $new_url string
 */
function tc_update_base_url($settings) {
  update_option("siteurl", $settings['new_url']);
  update_option("home", $settings['new_url']);
}

/**
 * Clear the script cache registry
 */
function tc_clear_resgistry_cache() {
  delete_transient('tsc_get_asset_map');
}


