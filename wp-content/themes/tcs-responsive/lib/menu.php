<?php

// header menu walker
class nav_menu_walker extends Walker_Nav_Menu {

  // add classes to ul sub-menus
  function start_lvl(&$output, $depth) {
    // depth dependent classes
    $indent = ($depth > 0 ? str_repeat("\t", $depth) : ''); // code indent
    $display_depth = ($depth + 1); // because it counts the first submenu as 0
    $classes = array('child');
    $class_names = implode(' ', $classes);

    // build html
    $output .= "\n" . $indent . '<ul class="' . $class_names . '">' . "\n";
  }

  // add main/sub classes to li's and links
  function start_el(&$output, $item, $depth, $args) {
    global $wp_query;
    $indent = ($depth > 0 ? str_repeat("\t", $depth) : ''); // code indent

    // passed classes
    $classes = empty($item->classes) ? array() : (array) $item->classes;
    $class_names = esc_attr(implode(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item)));

    // build html
    $output .= $indent . '<li id="nav-menu-item-' . $item->ID . '">';

    // link attributes
    $attributes = !empty($item->attr_title) ? ' title="' . esc_attr($item->attr_title) . '"' : '';
    $attributes .= !empty($item->target) ? ' target="' . esc_attr($item->target) . '"' : '';
    $attributes .= !empty($item->xfn) ? ' rel="' . esc_attr($item->xfn) . '"' : '';
    $attributes .= !empty($item->url) ? ' href="' . esc_attr($item->url) . '"' : '';
    $attributes .= ' class="' . (!empty ($item->post_name) ? esc_attr($item->post_name) : '') . '"';

    $item_output = sprintf(
      '%1$s<a%2$s><i></i>%3$s%4$s%5$s</a>%6$s',
      $args->before,
      $attributes,
      $args->link_before,
      apply_filters('the_title', $item->title, $item->ID),
      $args->link_after,
      $args->after
    );

    // build html
    $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
  }
}

// footer menu walker
class footer_menu_walker extends Walker_Nav_Menu {

  // add classes to ul sub-menus
  function start_lvl(&$output, $depth) {
    // depth dependent classes
    $indent = ($depth > 0 ? str_repeat("\t", $depth) : ''); // code indent
    $display_depth = ($depth + 1); // because it counts the first submenu as 0
    $classes = array('child');
    $class_names = implode(' ', $classes);

    // build html
    $output .= "\n" . $indent . '<ul class="' . $class_names . '">' . "\n";
  }

  // add main/sub classes to li's and links
  function start_el(&$output, $item, $depth, $args) {
    global $wp_query;
    $indent = ($depth > 0 ? str_repeat("\t", $depth) : ''); // code indent

    // passed classes
    $classes = empty($item->classes) ? array() : (array) $item->classes;
    $class_names = esc_attr(implode(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item)));

    // build html
    $deptClass = "";
    if ($depth == 0) {
      $deptClass = "rootNode";
    }
    $output .= $indent . '<li id="nav-menu-item-' . $item->ID . '" class="' . $deptClass . '">';


    // link attributes
    $attributes = !empty($item->attr_title) ? ' title="' . esc_attr($item->attr_title) . '"' : '';
    $attributes .= !empty($item->target) ? ' target="' . esc_attr($item->target) . '"' : '';
    $attributes .= !empty($item->xfn) ? ' rel="' . esc_attr($item->xfn) . '"' : '';
    $attributes .= !empty($item->url) ? ' href="' . esc_attr($item->url) . '"' : '';
    $attributes .= ' class="' . (!empty ($item->post_name) ? esc_attr($item->post_name) : '') . '"';

    $item_output = sprintf(
      '%1$s<a%2$s>%3$s%4$s%5$s</a>%6$s',
      $args->before,
      $attributes,
      $args->link_before,
      apply_filters('the_title', $item->title, $item->ID),
      $args->link_after,
      $args->after
    );

    // build html
    $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
  }
}