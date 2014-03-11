<?php

/* Register widgets */
locate_template('lib/widget.php', true);

if (function_exists ( 'register_sidebar' )) {

  /*
   * Sidebar community
  */
  register_sidebar ( array (
      'name' => 'Sidebar Community',
      'id' => 'community_sidebar',
      'description' => 'Sidebar widget on community page',
      'before_widget' => '',
      'after_widget' => ''
    ) );

  register_sidebar ( array (
      'name' => 'BottomBar Community',
      'id' => 'community_bottombar',
      'description' => 'Bottom bar widget on community page',
      'before_widget' => '',
      'after_widget' => ''
    ) );

  // overview template sidebar
  register_sidebar ( array (
      'name' => 'Case studies sidebar',
      'id' => 'case_studies_sidebar',
      'description' => 'Sidebar widget on Case studies single page',
      'before_widget' => '',
      'after_widget' => ''
    ) );

  // blog sidebar
  register_sidebar ( array (
      'name' => 'Blog Sidebar',
      'id' => 'blog_sidebar',
      'description' => 'Sidebar on Blog',
      'before_widget' => '',
      'after_widget' => ''
    ) );
}

