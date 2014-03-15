<?php

/* RSS Feeds for challenge listings */
add_action('init', 'challengesRSS');
function challenges_rss_rewrite_rules($wp_rewrite) {
  $new_rules = array(
    'challenges/feed/?' => 'index.php?feed=challenges-feed'
  );
  $wp_rewrite->rules = $new_rules + $wp_rewrite->rules;
}

function challengesRSS() {
  global $wp_rewrite;
  add_feed('challenges-feed', 'challengesRSSFunc');
  add_action('generate_rewrite_rules', 'challenges_rss_rewrite_rules');
  $wp_rewrite->flush_rules();
}

function challengesRSSFunc() {
  get_template_part('rss', 'challenges');
}
