<?php

/* RSS Feeds for challenge listings */
add_action('init', 'challengesRSS');

function challengesRSS() {
  add_feed('challenges-feed', 'challengesRSSFunc', 10, 1);
}

function challengesRSSFunc() {
  get_template_part('rss', 'challenges');
}
