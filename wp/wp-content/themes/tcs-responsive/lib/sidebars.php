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
	
  // onboarding sidebar
  register_sidebar ( array (
      'name' => 'Member Onboarding Sidebar',
      'id' => 'member_onboarding_sidebar',
      'description' => 'Sidebar on Member Onboarding',
      'before_widget' => '',
      'after_widget' => ''
    ) );

  // generic sidebar
  register_sidebar ( array (
      'name' => 'Generic Sidebar',
      'id' => 'generic_sidebar',
      'description' => 'Sidebar on Generic Pages',
      'before_widget' => '',
      'after_widget' => ''
    ) );
}

