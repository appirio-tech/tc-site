<?php
/**
 * @file
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 * @author TCSASSEMBLER
 * @version 1.1
 *
 * This is sidebar widget page
 *
 * Changed in 1.1
 * Loading recent challenges data using ajax
 */
/* Register the widget */
function theme_load_widgets() {
  register_widget('Related_Content');
  register_widget('Search_blog_widget');
  register_widget('Search_member_onboarding_widget');
  register_widget('Blog_category_widget');
  register_widget('Popular_post_widget');
  register_widget('Subscribe_widget');
  register_widget('Download_banner_widget');
  register_widget('Quote_widget');
  register_widget('Recent_challenges');
  register_widget('Onboarding_Recent_Posts');
  register_widget('Onboarding_Recent_Comments');
  register_widget('Onboarding_Categories');
}

add_action('widgets_init', 'theme_load_widgets');


class Related_Content extends WP_Widget {

  /* Widget setup */
  function Related_Content() {
    /* Widget settings. */
    $widget_ops = array(
      'classname' => 'Related_Content',
      'description' => __('Related Content', 'inm')
    );

    /* Widget control settings. */
    $control_ops = array(
      'id_base' => 'related_content'
    );

    /* Create the widget. */
    $this->WP_Widget('related_content', __('Related_Content', 'inm'), $widget_ops, $control_ops);
  }

  function form( $instance ) {
    if(isset($instance['num_posts'])) {
      $num_posts = $instance['num_posts'];
    }
    else {
      $num_posts = __( 4, 'inm' );
    }
    ?>
    <p>
      <label for="<?php echo $this->get_field_id( 'num_posts' ); ?>"><?php _e( 'Number of Posts:' ); ?></label>
      <input class="widefat" id="<?php echo $this->get_field_id( 'num_posts' ); ?>" name="<?php echo $this->get_field_name( 'num_posts' ); ?>" type="text" value="<?php echo esc_attr( $num_posts ); ?>" />
    </p>
    <?php
  }

  // Updating widget replacing old instances with new
  public function update( $new_instance, $old_instance ) {
    $instance = array();
    $instance['num_posts'] = ( ! empty( $new_instance['num_posts'] ) ) ? strip_tags( $new_instance['num_posts'] ) : '';
    return $instance;
  }


  /* Display the widget */
  function widget($args, $instance) {
    extract($args);
     /* Set up some default widget settings. */
    $defaults = array(
      'num_posts' => __(4, num_posts)
    );
    $instance = wp_parse_args(( array ) $instance, $defaults);

    /* Before widget (defined by themes). */
    echo $before_widget;
    $displayedTitle = "Related Content";
    /* Display the widget title if one was input (before and after defined by themes). */
    if ($title) {
      $displayedTitle = $before_title . $title . $after_title;
    }
    ?>
    <div class="sideFindRelatedContent">
     <h3><?php echo $displayedTitle; ?></h3>
			<ul class="relatedContentList">
			<?php
			// for use in the loop, list 4 post titles related to first tag on current post
			$tags = wp_get_post_tags ( $GLOBALS['post']->ID );
			if ($tags) {
			    $num_posts = apply_filters( 'num_posts', $instance['num_posts'] );
					$first_tag = $tags [0]->term_id;
					$args = array (
							'tag__in' => array (
									$first_tag
							),
							'post__not_in' => array (
									$post->ID
							),
							'post_type' => array (
									'post',
									'page'
							),
							'posts_per_page' => $num_posts,
							'ignore_sticky_posts' => 1
					);
					$related_query = new WP_Query ( $args );
					if ($related_query->have_posts ()) {
						while ( $related_query->have_posts () ) :
							$related_query->the_post ();

							$pid = $post->ID;
							$thumbId = get_post_thumbnail_id ( $pid );
							$iurl = wp_get_attachment_url ( $thumbId );
							?>
						<li><a class="contentLink" href="<?php the_permalink() ?>">
							<img class="contentThumb" src="<?php echo $iurl;?>" alt="<?php the_title(); ?>">
							<?php the_title(); ?>
						</a> <span class="contentBrief"><?php echo custom_excerpt(10) ?></span></li>

				<?php
						endwhile
						;
					}
					wp_reset_query ();
				}
				?>
				</ul>
    </div>
    <!-- /.sideFindRelatedContent -->

    <?php
    echo $after_widget;
  }
}

class External_Links extends WP_Widget {

  /* Widget setup */
  function External_Links() {
    /* Widget settings. */
    $widget_ops = array(
      'classname' => 'External_Links',
      'description' => __('External Links', 'inm')
    );

    /* Widget control settings. */
    $control_ops = array(
      'id_base' => 'external_links'
    );

    /* Create the widget. */
    $this->WP_Widget('external_links', __('External_Links', 'inm'), $widget_ops, $control_ops);
  }

  /* Display the widget */
  function widget($args, $instance) {
    extract($args);

    /* Before widget (defined by themes). */
    echo $before_widget;

    /* Display the widget title if one was input (before and after defined by themes). */
    if ($title) {
      echo $before_title . $title . $after_title;
    }
    ?>
    <div class="sideFindRelatedContent">
      <h3>Links</h3>

    </div>
    <!-- /.sideFindRelatedContent -->

    <?php
    echo $after_widget;
  }
}


/**
 * Search Blog Widget
 */
class Search_blog_widget extends WP_Widget {
  // setup widget
  function Search_blog_widget() {

    // widget settings
    $widget_ops = array(
      'classname' => 'search_blog_widget',
      'description' => __('Search blogs widget', 'search_blog_widget')
    );

    // widget control settings
    $control_ops = array(
      'width' => 388,
      'height' => 327,
      'id_base' => 'search_blog_widget'
    );

    // create widget
    $this->WP_Widget('search_blog_widget', __('Search blogs widget', 'search_blog_widget'), $widget_ops, $control_ops);
  }

  /**
   * How to display the widget on the screen.
   */
  function widget($args, $instance) {
    // Widget output
    extract($args);

    /* Our variables from the widget settings. */
    $title = $instance ['contest'];

    /* Before widget (defined by themes). */
    echo $before_widget;
    ?>
    <div class="searchBox">
      <div class="group">
        <form id="formSearchContest" action="<?php bloginfo("wpurl"); ?>" method="GET">
          <input type="text" name="s" class="text isBlured"/>
          <input type="submit" style="display:none"/>
          <a class="btn" href="javascript:$('#formSearchContest').submit();">Find</a>
        </form>
      </div>
    </div>

    <?php
    /* After widget (defined by themes). */
    echo $after_widget;
  }

  /**
   * Update the widget settings.
   */
  function update($new_instance, $old_instance) {
    $instance = $old_instance;

    /* Strip tags for title and name to remove HTML (important for text inputs). */
    $instance ['title'] = strip_tags($new_instance ['title']);

    return $instance;
  }

  /**
   * Displays the widget settings controls on the widget panel.
   * Make use of the get_field_id() and get_field_name() function
   * when creating your form elements. This handles the confusing stuff.
   */
  function form($instance) {

    /* Set up some default widget settings. */
    $defaults = array(
      'title' => __('Blog Search', event_widget)
    );
    $instance = wp_parse_args(( array ) $instance, $defaults);
    ?>
  <?php
  }
}

/**
 * Search Blog Widget End
 */
 
/**
 * Search Member Onboarding Widget
 */
class Search_member_onboarding_widget extends WP_Widget {
  // setup widget
  function Search_member_onboarding_widget() {

    // widget settings
    $widget_ops = array(
      'classname' => 'search_member_onboarding_widget',
      'description' => __('Search onboarding widget', 'search_member_onboarding_widget')
    );

    // widget control settings
    $control_ops = array(
      'width' => 388,
      'height' => 327,
      'id_base' => 'search_member_onboarding_widget'
    );

    // create widget
    $this->WP_Widget('search_member_onboarding_widget', __('Search member onboarding widget', 'search_member_onboarding_widget'), $widget_ops, $control_ops);
  }

  /**
   * How to display the widget on the screen.
   */
  function widget($args, $instance) {
    // Widget output
    extract($args);

    /* Our variables from the widget settings. */
    $title = $instance ['contest'];

    /* Before widget (defined by themes). */
    echo $before_widget;
    ?>
    <div class="widget_search">
        <form class="mk-searchform" method="get" id="searchform" action="<?php bloginfo("wpurl"); ?>" novalidate="">
            <input type="text" class="text-input" placeholder="Search" value="" name="s" id="s">
            <i class="mk-icon-search"><input value="" type="submit" class="search-button"></i>
        </form>
    </div>

    <?php
    /* After widget (defined by themes). */
    echo $after_widget;
  }

  /**
   * Update the widget settings.
   */
  function update($new_instance, $old_instance) {
    $instance = $old_instance;

    /* Strip tags for title and name to remove HTML (important for text inputs). */
    $instance ['title'] = strip_tags($new_instance ['title']);

    return $instance;
  }

  /**
   * Displays the widget settings controls on the widget panel.
   * Make use of the get_field_id() and get_field_name() function
   * when creating your form elements. This handles the confusing stuff.
   */
  function form($instance) {

    /* Set up some default widget settings. */
    $defaults = array(
      'title' => __('Blog Search', event_widget)
    );
    $instance = wp_parse_args(( array ) $instance, $defaults);
    ?>
  <?php
  }
}

/**
 * Search Member Onboarding Widget End
 */

/**
 * Blog Categories Widget
 */
class Blog_category_widget extends WP_Widget {
  // setup widget
  function Blog_category_widget() {

    // widget settings
    $widget_ops = array(
      'classname' => 'blog_category_widget',
      'description' => __('Blog category widget', 'blog_category_widget')
    );

    // widget control settings
    $control_ops = array(
      //'width' => 388,
      //'height' => 327,
      'id_base' => 'blog_category_widget'
    );

    // create widget
    $this->WP_Widget(
      'blog_category_widget',
      __('Blog category widget', 'blog_category_widget'),
      $widget_ops,
      $control_ops
    );
  }

  /**
   * How to display the widget on the screen.
   */
  function widget($args, $instance) {
    // Widget output
    extract($args);

    /* Our variables from the widget settings. */
    $title = $instance ['title'];
    $postPerPage = $instance['post_per_page'];

    $title = $title == "" ? "Categories" : $title;
    $postPerPage = $postPerPage == "" ? 7 : $postPerPage;


    /* Before widget (defined by themes). */
    echo $before_widget;

    $blogCategoryId = getCategoryId('blog');
    $args = array(
      'type' => 'blog',
      'child_of' => $blogCategoryId,
      'orderby' => 'name',
      'order' => 'ASC',
      'hide_empty' => 0,
      'hierarchical' => 0,
      'exclude' => '0'
    );
    $categoryPerPage = $postPerPage;
    $arrCategory = get_categories($args);
    $categoryCount = count($arrCategory);
    $count = 1;
    if ($arrCategory != NULL) :
      if ($categoryCount > $postPerPage) {
        $count = (int) ($categoryCount / $categoryPerPage);
      }
      $count += $categoryCount % $categoryPerPage > 0 ? 1 : 0;
      ?>
      <div class="categoriesWidget">
        <h3><?php echo $title; ?></h3>

        <div id='mySwipe' class='swipe'>
          <div class='swipe-wrap'>
            <?php
            for ($i = 0; $i < $count; $i++) {
              $adder = $count > 1 ? $i * $categoryPerPage : 0;
              echo "<ul>";
              for ($j = 0; $j < $categoryPerPage; $j++) {
                $index = $j + $adder;
                if ($index < $categoryCount) :
                  ?>
                  <li><a class="contestName" href="<?php echo get_category_link(
                      $arrCategory[$index]->term_id
                    ); ?>"><i></i><?php echo $arrCategory[$index]->cat_name; ?></a></li>
                <?php
                endif;
              }
              echo "</ul>";
            }
            ?>
          </div>
          <?php
          if ($count > 1) :
            ?>
            <div id="categoryNav" class="swipeNavWrapper">
              <?php
              for ($i = 0; $i < $count; $i++) :
                $active = $i == 0 ? "on" : "";
                ?>
                <a id="swipeNav<?php echo $i; ?>" href="javascript:;" class="<?php echo $active; ?>">&nbsp;</a>
              <?php endfor; ?>
            </div>
          <?php endif; ?>
        </div>
      </div>
      <!-- /.categories-->
    <?php endif; ?>

    <?php
    /* After widget (defined by themes). */
    echo $after_widget;
  }

  /**
   * Update the widget settings.
   */
  function update($new_instance, $old_instance) {
    $instance = $old_instance;

    /* Strip tags for title and name to remove HTML (important for text inputs). */
    $instance ['title'] = strip_tags($new_instance ['title']);
    $instance ['post_per_page'] = strip_tags($new_instance ['post_per_page']);

    return $instance;
  }

  /**
   * Displays the widget settings controls on the widget panel.
   * Make use of the get_field_id() and get_field_name() function
   * when creating your form elements. This handles the confusing stuff.
   */
  function form($instance) {

    /* Set up some default widget settings. */
    $defaults = array(
      'title' => __('Categories', widget_title),
      'post_per_page' => __(7, post_per_page)
    );
    $instance = wp_parse_args(( array ) $instance, $defaults);
    ?>

    <!-- Title: Text Input -->
    <p>
      <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:', 'widget_title'); ?></label>
      <input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>"
             value="<?php echo $instance['title']; ?>" style="width: 100%;"/>
    </p>

    <!-- Post Per Page -->
    <p>
      <label for="<?php echo $this->get_field_id('post_per_page'); ?>"><?php _e(
          'Category Per Page:',
          'post_per_page'
        ); ?></label>
      <input id="<?php echo $this->get_field_id('post_per_page'); ?>"
             name="<?php echo $this->get_field_name('post_per_page'); ?>"
             value="<?php echo $instance['post_per_page']; ?>" style="width: 100%;"/>
    </p>
  <?php
  }
}

/**
 * Blog Categories Widget End
 */

/**
 * Popular Post Widget
 */
class Popular_post_widget extends WP_Widget {
  // setup widget
  function Popular_post_widget() {

    // widget settings
    $widget_ops = array(
      'classname' => 'popular_post_widget',
      'description' => __('Popular post widget', 'popular_post_widget')
    );

    // widget control settings
    $control_ops = array(
      //'width' => 388,
      //'height' => 327,
      'id_base' => 'popular_post_widget'
    );

    // create widget
    $this->WP_Widget(
      'popular_post_widget',
      __('Popular post widget', 'popular_post_widget'),
      $widget_ops,
      $control_ops
    );
  }

  /**
   * How to display the widget on the screen.
   */
  function widget($args, $instance) {
    // Widget output
    extract($args);

    /* Our variables from the widget settings. */
    $title = $instance ['title'];
    $postPerPage = $instance['post_per_page'];

    /* Before widget (defined by themes). */
    echo $before_widget;

    //wp_reset_query();
    $title = $title == "" ? "Popular Posts" : $title;
    $postPerPage = $postPerPage == "" ? 4 : $postPerPage;
    $args = array(
      'post_type' => 'blog',
      'posts_per_page' => $postPerPage,
      'meta_key' => 'wpb_post_views_count',
      'orderby' => 'meta_value_num',
      'order' => 'DESC'
    );
    //query_posts($args);
    $postQuery = new WP_Query($args);
    if ($postQuery->have_posts()) :
      ?>
      <div class="sideFindRelatedContent sideFindRelatedContentNoBorder">
        <input class="popularPostPage" type="hidden" value="<?php echo $postPerPage; ?>"/>
        <input type="hidden" class="pageNo" value="1"/>

        <h3 class="popularPostTitle"><?php echo $title; ?></h3>
        <ul class="relatedContentList">
          <?php
          while ($postQuery->have_posts()) : 
            $postQuery->the_post(); // advance to next record and set global $post var
            $post;
            /*Bugfix: show correct thumbnail for posts*/
            $postId = get_the_ID();
            $thumbId = get_post_thumbnail_id ( $postId );
            $iurl = wp_get_attachment_url ( $thumbId );
            //if empty, show default thumbnail
            if (empty($iurl)) {
              $iurl = get_bloginfo('stylesheet_directory') . "/i/content-thumb.png";
            }
            ?>
            <li>
              <a class="contentLink" href="<?php the_permalink() ?>">
                <img class="contentThumb" src="<?php echo $iurl;?>"
                     alt="<?php the_title(); ?>">
                <?php the_title(); ?>
              </a> <span class="contentBrief"><?php echo wrap_content_strip_html(
                  wpautop(get_the_content()),
                  70,
                  TRUE,
                  '\n\r',
                  '...'
                ) ?></span>
            </li>
          <?php
          endwhile;
          ?>
        </ul>
      </div>
      <!-- /.popular post-->
    <?php endif; 
          wp_reset_postdata();
    ?>

    <?php
    /* After widget (defined by themes). */
    echo $after_widget;
  }

  /**
   * Update the widget settings.
   */
  function update($new_instance, $old_instance) {
    $instance = $old_instance;

    /* Strip tags for title and name to remove HTML (important for text inputs). */
    $instance ['title'] = strip_tags($new_instance ['title']);
    $instance ['post_per_page'] = strip_tags($new_instance ['post_per_page']);

    return $instance;
  }

  /**
   * Displays the widget settings controls on the widget panel.
   * Make use of the get_field_id() and get_field_name() function
   * when creating your form elements. This handles the confusing stuff.
   */
  function form($instance) {

    /* Set up some default widget settings. */
    $defaults = array(
      'title' => __('Popular Posts', widget_title),
      'post_per_page' => __(7, post_per_page)
    );
    $instance = wp_parse_args(( array ) $instance, $defaults);
    ?>

    <!-- Title: Text Input -->
    <p>
      <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:', 'widget_title'); ?></label>
      <input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>"
             value="<?php echo $instance['title']; ?>" style="width: 100%;"/>
    </p>

    <!-- Post Per Page -->
    <p>
      <label for="<?php echo $this->get_field_id('post_per_page'); ?>"><?php _e(
          'Popular Post Per Page:',
          'post_per_page'
        ); ?></label>
      <input id="<?php echo $this->get_field_id('post_per_page'); ?>"
             name="<?php echo $this->get_field_name('post_per_page'); ?>"
             value="<?php echo $instance['post_per_page']; ?>" style="width: 100%;"/>
    </p>
  <?php
  }
}

/**
 * Popular Post Widget End
 */

/**
 * Subscribe Widget
 */
class Subscribe_widget extends WP_Widget {
  // setup widget
  function Subscribe_widget() {

    // widget settings
    $widget_ops = array(
      'classname' => 'subscribe_widget',
      'description' => __('Subscribe widget', 'subscribe_widget')
    );

    // widget control settings
    $control_ops = array(
      'width' => 388,
      'height' => 327,
      'id_base' => 'subscribe_widget'
    );

    // create widget
    $this->WP_Widget('subscribe_widget', __('Subscribe widget', 'subscribe_widget'), $widget_ops, $control_ops);
  }

  /**
   * How to display the widget on the screen.
   */
  function widget($args, $instance) {
    // Widget output
    extract($args);

    /* Our variables from the widget settings. */
    $title = $instance ['title'];
    $title = $title == "" ? "Subscribe" : $title;

    /* Before widget (defined by themes). */
    echo $before_widget;
    ?>
    <div class="subscribeBox">
      <h3><?php echo $title; ?></h3>

      <div class="group">
        <form action="http://www.feedblitz.com/f/f.fbz?AddNewUserDirect" method="POST"
              name="FeedBlitz_0fd529537e2d11e392f6002590771251">
          <input type="text" name="EMAIL" class="text isBlured subscribeInput"
                 placeholder="Enter Your Email Address : "/>
          <input type="hidden" value="34610190" name="PUBLISHER">
          <input type="hidden" value="926643" name="FEEDID">
        </form>
        <span class="errorInput"></span>

        <p class="subscribeSuccess">Thanks for subscription our blog</p>
      </div>
      <div class="showMoreWrapper"><a class="subscribeButton btn" href="javascript:;">Subscribe</a></div>
    </div>

    <?php
    /* After widget (defined by themes). */
    echo $after_widget;
  }

  /**
   * Update the widget settings.
   */
  function update($new_instance, $old_instance) {
    $instance = $old_instance;

    /* Strip tags for title and name to remove HTML (important for text inputs). */
    $instance ['title'] = strip_tags($new_instance ['title']);

    return $instance;
  }

  /**
   * Displays the widget settings controls on the widget panel.
   * Make use of the get_field_id() and get_field_name() function
   * when creating your form elements. This handles the confusing stuff.
   */
  function form($instance) {

    /* Set up some default widget settings. */
    $defaults = array(
      'title' => __('Subscribe', event_widget)
    );
    $instance = wp_parse_args(( array ) $instance, $defaults);
    ?>

    <!-- Title: Text Input -->
    <p>
      <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:', 'event_widget'); ?></label>
      <input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>"
             value="<?php echo $instance['title']; ?>" style="width: 100%;"/>
    </p>
  <?php
  }
}

/**
 * Subscribe Widget end
 */

/**
 * Download Widget
 */
class Download_banner_widget extends WP_Widget {
  // setup widget
  function Download_banner_widget() {

    // widget settings
    $widget_ops = array(
      'classname' => 'download_banner_widget',
      'description' => __('Download banner widget', 'download_banner_widget')
    );

    // widget control settings
    $control_ops = array(
      'width' => 388,
      'height' => 327,
      'id_base' => 'download_banner_widget'
    );

    // create widget
    $this->WP_Widget(
      'download_banner_widget',
      __('Download banner widget', 'download_banner_widget'),
      $widget_ops,
      $control_ops
    );
  }

  /**
   * How to display the widget on the screen.
   */
  function widget($args, $instance) {
    // Widget output
    extract($args);

    /* Our variables from the widget settings. */
    $downloadLink = $instance ['downloadLink'];
    $downloadLink = $downloadLink == "" ? "javascript:;" : $downloadLink;
    $download = $instance ['download'];
    $download = $download == "" ? "download :" : $download;
    $para1 = $instance ['para1'];
    $para1 = $para1 == "" ? "THE TALENT WAR SURVIVAL GUIDE:" : $para1;
    $para2 = $para2 ['para2'];
    $para2 = $para2 == "" ? "MASTERING APPLICATION" : $para2;
    $para3 = $para3 ['para3'];
    $para3 = $para3 == "" ? "DEVELOPMENT" : $para3;

    /* Before widget (defined by themes). */
    echo $before_widget;
    ?>
    <a class="downloadWidget" href="<?php echo $downloadLink; ?>">
      <span class="download"><?php echo $download; ?></span>
      <span class="para1"><?php echo $para1; ?></span>
      <span class="para2"><?php echo $para2; ?></span>
      <span class="para3"><?php echo $para3; ?></span>
    </a>

    <?php
    /* After widget (defined by themes). */
    echo $after_widget;
  }

  /**
   * Update the widget settings.
   */
  function update($new_instance, $old_instance) {
    $instance = $old_instance;

    /* Strip tags for title and name to remove HTML (important for text inputs). */
    $instance ['download'] = strip_tags($new_instance ['download']);
    $instance ['para1'] = strip_tags($new_instance ['para1']);
    $instance ['para2'] = strip_tags($new_instance ['para2']);
    $instance ['para3'] = strip_tags($new_instance ['para3']);

    return $instance;
  }

  /**
   * Displays the widget settings controls on the widget panel.
   * Make use of the get_field_id() and get_field_name() function
   * when creating your form elements. This handles the confusing stuff.
   */
  function form($instance) {

    /* Set up some default widget settings. */
    $defaults = array(
      'download_link' => __('javascript:;', event_widget),
      'download' => __('download :', event_widget),
      'para1' => __('THE TALENT WAR SURVIVAL GUIDE:', event_widget),
      'para2' => __('MASTERING APPLICATION', event_widget),
      'para3' => __('DEVELOPMENT', event_widget),
    );
    $instance = wp_parse_args(( array ) $instance, $defaults);
    ?>

    <!-- Title: Text Input -->
    <p>
      <label for="<?php echo $this->get_field_id('download_link'); ?>"><?php _e(
          'Download Link:',
          'event_widget'
        ); ?></label>
      <input id="<?php echo $this->get_field_id('download_link'); ?>"
             name="<?php echo $this->get_field_name('download_link'); ?>"
             value="<?php echo $instance['download_link']; ?>" style="width: 100%;"/>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id('download'); ?>"><?php _e('Download text:', 'event_widget'); ?></label>
      <input id="<?php echo $this->get_field_id('download'); ?>" name="<?php echo $this->get_field_name('download'); ?>"
             value="<?php echo $instance['download']; ?>" style="width: 100%;"/>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id('para1'); ?>"><?php _e('Paragraph 1 Text:', 'event_widget'); ?></label>
      <input id="<?php echo $this->get_field_id('para1'); ?>" name="<?php echo $this->get_field_name('para1'); ?>"
             value="<?php echo $instance['para1']; ?>" style="width: 100%;"/>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id('para2'); ?>"><?php _e('Paragraph 2 Text:', 'event_widget'); ?></label>
      <input id="<?php echo $this->get_field_id('para2'); ?>" name="<?php echo $this->get_field_name('para2'); ?>"
             value="<?php echo $instance['para2']; ?>" style="width: 100%;"/>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id('para3'); ?>"><?php _e('Paragraph 3 Text:', 'event_widget'); ?></label>
      <input id="<?php echo $this->get_field_id('para3'); ?>" name="<?php echo $this->get_field_name('para3'); ?>"
             value="<?php echo $instance['para3']; ?>" style="width: 100%;"/>
    </p>
  <?php
  }
}

/**
 * Download Widget end
 */

/**
 * Quote Widget
 */
class Quote_widget extends WP_Widget {
  /* Widget setup */
  function Quote_widget() {
    /* Widget settings. */
    $widget_ops = array(
      'classname' => 'Quote_widget',
      'description' => __('Quote widget', 'inm')
    );

    /* Widget control settings. */
    $control_ops = array(
      'id_base' => 'quote_widget'
    );

    /* Create the widget. */
    $this->WP_Widget('quote_widget', __('Quote_widget', 'inm'), $widget_ops, $control_ops);
  }

  /* Display the widget */
  function widget($args, $instance) {
    extract($args);

    /* Before widget (defined by themes). */
    echo $before_widget;

    /* Display the widget title if one was input (before and after defined by themes). */
    if ($title) {
      echo $before_title . $title . $after_title;
    }
    $quote = get_post_meta ( $GLOBALS['post']->ID, "Quote", true );
		$qAuthor = get_post_meta ( $GLOBALS['post']->ID, "Quote author", true );
    ?>
    <div class="sideQuote">
			<p class="quoteTxt"><?php echo $quote;?></p>
			<p class="quoterName"><?php echo $qAuthor;?></p>
		</div>

    <?php
    echo $after_widget;
  }
}
/**
 * Quote Widget End
 */

/**
 * Recent challenges Widget
 */
class Recent_challenges extends WP_Widget {
  /* Widget setup */
  function Recent_challenges() {
    /* Widget settings. */
    $widget_ops = array(
      'classname' => 'Recent_challenges',
      'description' => __('Recent Challenges', 'inm')
    );

    /* Widget control settings. */
    $control_ops = array(
      'id_base' => 'recent_challenges'
    );

    /* Create the widget. */
    $this->WP_Widget('recent_challenges', __('Recent_challenges', 'inm'), $widget_ops, $control_ops);
  }

  /* Display the widget */
  function widget($args, $instance) {
    extract($args);

    /* Before widget (defined by themes). */
    echo $before_widget;
    $displayedTitle = "Most Recent Challenges";
    /* Display the widget title if one was input (before and after defined by themes). */
    if ($title) {
      $displayedTitle =  $before_title . $title . $after_title;
    }

    ?>
    <div class="sideMostRecentChallenges">
			<h3><?php echo $displayedTitle; ?></h3>
			<?php
				$recentDesign = get_active_contests_ajax('','design',1,1);
				$recentDesign = $recentDesign->data[0];
				$recentDev= get_active_contests_ajax('','develop',1,1);
				$recentDev = $recentDev->data[0];
				$recentData= get_active_contests_ajax('','data/marathan');
				$recentData = $recentData->data[0];
				$chLink =  get_page_link_by_slug('challenge-details');
			?>
			<ul>
				<li><a class="contestName contestType1" href="<?php echo $chLink.$recentDev->challengeId ?>">
						<i></i><?php echo $recentDev->challengeName ?>
					</a></li>
				<li class="alt"><a class="contestName contestType2" href="<?php echo $chLink.$recentDesign->challengeId ?>/?type=design">
						<i></i><?php echo $recentDesign->challengeName ?>
					</a></li>

			</ul>
		</div>

    <?php
    echo $after_widget;
  }
}
/**
 * Recent challenges Widget End
 */

 
/*
	RECENT POSTS
*/

class Onboarding_Recent_Posts extends WP_Widget {

	function Onboarding_Recent_Posts() {
		$widget_ops = array( "classname" => "widget_posts_lists", "description" => "Displays the Recent posts" );
		$this-> WP_Widget( "onboarding_recent_posts", "Onboarding Recent Posts", $widget_ops );
		$this-> alt_option_name = "widget_onboarding_recent_posts";

		add_action( "save_post", array( &$this, "flush_widget_cache" ) );
		add_action( "deleted_post", array( &$this, "flush_widget_cache" ) );
		add_action( "switch_theme", array( &$this, "flush_widget_cache" ) );
	}


	function widget( $args, $instance ) {

		$cache = array();
		if ( ! $this->is_preview() ) {
			$cache = wp_cache_get( 'widget_onboarding_recent_posts', 'widget' );
		}

		if ( ! is_array( $cache ) ) {
			$cache = array();
		}

		if ( ! isset( $args['widget_id'] ) ) {
			$args['widget_id'] = $this->id;
		}

		if ( isset( $cache[ $args['widget_id'] ] ) ) {
			echo $cache[ $args['widget_id'] ];
			return;
		}

		ob_start();

        $title = ( ! empty( $instance['title'] ) ) ? $instance['title'] : __( 'Recent Articles' ); 

		/** This filter is documented in wp-includes/default-widgets.php */
		$title = apply_filters( 'widget_title', $title, $instance, $this->id_base );

		$number = ( ! empty( $instance['number'] ) ) ? absint( $instance['number'] ) : 5;
		if ( ! $number )
			$number = 5;
		$show_date = isset( $instance['show_date'] ) ? $instance['show_date'] : false;

		/**
		 * Filter the arguments for the Recent Posts widget.
		 *
		 * @since 3.4.0
		 *
		 * @see WP_Query::get_posts()
		 *
		 * @param array $args An array of arguments used to retrieve the recent posts.
		 */
        $r = new WP_Query( apply_filters( 'widget_posts_args', array(
            'post_type' => 'member-onboarding',
            'posts_per_page'      => $number,
            'no_found_rows'       => true,
            'post_status'         => 'publish',
            'ignore_sticky_posts' => true,
        )));

		if ($r->have_posts()) :
?>
		<?php echo $args['before_widget']; ?>
		<?php if ( $title ) {
			echo $args['before_title'] . $title . $args['after_title'];
		} ?>
		<ul>
		<?php while ( $r->have_posts() ) : $r->the_post(); ?>
			<li>
				<a href="<?php the_permalink(); ?>"><?php get_the_title() ? the_title() : the_ID(); ?></a>
			<?php if ( $show_date ) : ?>
				<span class="post-date"><?php echo get_the_date(); ?></span>
			<?php endif; ?>
			</li>
		<?php endwhile; ?>
		</ul>
		<?php echo $args['after_widget']; ?>
<?php
		// Reset the global $the_post as this query will have stomped on it
		wp_reset_postdata();

		endif;

		if ( ! $this->is_preview() ) {
			$cache[ $args['widget_id'] ] = ob_get_flush();
			wp_cache_set( 'widget_onboarding_recent_posts', $cache, 'widget' );
		} else {
			ob_end_flush();
		}

	}

	public function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = strip_tags($new_instance['title']);
		$instance['number'] = (int) $new_instance['number'];
		$instance['show_date'] = isset( $new_instance['show_date'] ) ? (bool) $new_instance['show_date'] : false;
		$this->flush_widget_cache();

		$alloptions = wp_cache_get( 'alloptions', 'options' );
		if ( isset($alloptions['widget_onboarding_recent_posts']) )
			delete_option('widget_onboarding_recent_posts');

		return $instance;
	}

	public function flush_widget_cache() {
		wp_cache_delete('widget_recent_posts', 'widget');
	}

	public function form( $instance ) {
		$title     = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : '';
		$number    = isset( $instance['number'] ) ? absint( $instance['number'] ) : 5;
		$show_date = isset( $instance['show_date'] ) ? (bool) $instance['show_date'] : false;
?>
		<p><label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo $title; ?>" /></p>

		<p><label for="<?php echo $this->get_field_id( 'number' ); ?>"><?php _e( 'Number of posts to show:' ); ?></label>
		<input id="<?php echo $this->get_field_id( 'number' ); ?>" name="<?php echo $this->get_field_name( 'number' ); ?>" type="text" value="<?php echo $number; ?>" size="3" /></p>

		<p><input class="checkbox" type="checkbox" <?php checked( $show_date ); ?> id="<?php echo $this->get_field_id( 'show_date' ); ?>" name="<?php echo $this->get_field_name( 'show_date' ); ?>" />
		<label for="<?php echo $this->get_field_id( 'show_date' ); ?>"><?php _e( 'Display post date?' ); ?></label></p>
<?php
	}
}

/**
 * Recent_Comments widget class
 *
 * @since 2.8.0
 */
class Onboarding_Recent_Comments extends WP_Widget {

	public function __construct() {
		$widget_ops = array('classname' => 'widget_onboarding_recent_comments', 'description' => __( 'Onboarding most recent comments.' ) );
		parent::__construct('onborading-recent-comments', __('Onboarding Recent Comments'), $widget_ops);
		$this->alt_option_name = 'widget_onboarding_recent_comments';

		if ( is_active_widget(false, false, $this->id_base) )
			add_action( 'wp_head', array($this, 'recent_comments_style') );

		add_action( 'comment_post', array($this, 'flush_widget_cache') );
		add_action( 'edit_comment', array($this, 'flush_widget_cache') );
		add_action( 'transition_comment_status', array($this, 'flush_widget_cache') );
	}

	public function recent_comments_style() {

		/**
		 * Filter the Recent Comments default widget styles.
		 *
		 * @since 3.1.0
		 *
		 * @param bool   $active  Whether the widget is active. Default true.
		 * @param string $id_base The widget ID.
		 */
		if ( ! current_theme_supports( 'widgets' ) // Temp hack #14876
			|| ! apply_filters( 'show_recent_comments_widget_style', true, $this->id_base ) )
			return;
		?>
	<style type="text/css">.recentcomments a{display:inline !important;padding:0 !important;margin:0 !important;}</style>
<?php
	}

	public function flush_widget_cache() {
		wp_cache_delete('widget_onboarding_recent_comments', 'widget');
	}

	public function widget( $args, $instance ) {
		global $comments, $comment;

		$cache = array();
		if ( ! $this->is_preview() ) {
			$cache = wp_cache_get('widget_onboarding_recent_comments', 'widget');
		}
		if ( ! is_array( $cache ) ) {
			$cache = array();
		}

		if ( ! isset( $args['widget_id'] ) )
			$args['widget_id'] = $this->id;

		if ( isset( $cache[ $args['widget_id'] ] ) ) {
			echo $cache[ $args['widget_id'] ];
			return;
		}

		$output = '';

		$title = ( ! empty( $instance['title'] ) ) ? $instance['title'] : __( 'Recent Comments' );

		/** This filter is documented in wp-includes/default-widgets.php */
		$title = apply_filters( 'widget_title', $title, $instance, $this->id_base );

		$number = ( ! empty( $instance['number'] ) ) ? absint( $instance['number'] ) : 5;
		if ( ! $number )
			$number = 5;

		/**
		 * Filter the arguments for the Recent Comments widget.
		 *
		 * @since 3.4.0
		 *
		 * @see WP_Comment_Query::query() for information on accepted arguments.
		 *
		 * @param array $comment_args An array of arguments used to retrieve the recent comments.
		 */
		$comments = get_comments( apply_filters( 'widget_comments_args', array(
            'post_type' => 'member-onboarding',
			'number'      => $number,
			'status'      => 'approve',
			'post_status' => 'publish'
		) ) );

		$output .= $args['before_widget'];
		if ( $title ) {
			$output .= $args['before_title'] . $title . $args['after_title'];
		}

		$output .= '<ul id="recentcomments">';
		if ( $comments ) {
			// Prime cache for associated posts. (Prime post term cache if we need it for permalinks.)
			$post_ids = array_unique( wp_list_pluck( $comments, 'comment_post_ID' ) );
			_prime_post_caches( $post_ids, strpos( get_option( 'permalink_structure' ), '%category%' ), false );

			foreach ( (array) $comments as $comment) {
				$output .= '<li class="recentcomments">';
				/* translators: comments widget: 1: comment author, 2: post link */
				$output .= sprintf( _x( '%1$s on %2$s', 'widgets' ),
					'<span class="comment-author-link">' . get_comment_author_link() . '</span>',
					'<a href="' . esc_url( get_comment_link( $comment->comment_ID ) ) . '">' . get_the_title( $comment->comment_post_ID ) . '</a>'
				);
				$output .= '</li>';
			}
		}
		$output .= '</ul>';
		$output .= $args['after_widget'];

		echo $output;

		if ( ! $this->is_preview() ) {
			$cache[ $args['widget_id'] ] = $output;
			wp_cache_set( 'widget_onboarding_recent_comments', $cache, 'widget' );
		}
	}

	public function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = strip_tags($new_instance['title']);
		$instance['number'] = absint( $new_instance['number'] );
		$this->flush_widget_cache();

		$alloptions = wp_cache_get( 'alloptions', 'options' );
		if ( isset($alloptions['widget_onboarding_recent_comments']) )
			delete_option('widget_onboarding_recent_comments');

		return $instance;
	}

	public function form( $instance ) {
		$title  = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : '';
		$number = isset( $instance['number'] ) ? absint( $instance['number'] ) : 5;
?>
		<p><label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo $title; ?>" /></p>

		<p><label for="<?php echo $this->get_field_id( 'number' ); ?>"><?php _e( 'Number of comments to show:' ); ?></label>
		<input id="<?php echo $this->get_field_id( 'number' ); ?>" name="<?php echo $this->get_field_name( 'number' ); ?>" type="text" value="<?php echo $number; ?>" size="3" /></p>
<?php
	}
}

/**
 * Categories widget class
 *
 * @since 2.8.0
 */
class Onboarding_Categories extends WP_Widget {

	public function __construct() {
		$widget_ops = array( 'classname' => 'onboarding_categories', 'description' => __( "A list or dropdown of categories." ) );
		parent::__construct('onboarding-categories', __('Onboarding Categories'), $widget_ops);
	}

	public function widget( $args, $instance ) {

		/** This filter is documented in wp-includes/default-widgets.php */
		$title = apply_filters( 'widget_title', empty( $instance['title'] ) ? __( 'Categories' ) : $instance['title'], $instance, $this->id_base );

		$c = ! empty( $instance['count'] ) ? '1' : '0';
		$h = ! empty( $instance['hierarchical'] ) ? '1' : '0';
		$d = ! empty( $instance['dropdown'] ) ? '1' : '0';

		echo $args['before_widget'];
		if ( $title ) {
			echo $args['before_title'] . $title . $args['after_title'];
		}

		$cat_args = array(
            'taxonomy'     => 'member-onboarding-categories',
			'orderby'      => 'name',
			'show_count'   => $c,
			'hierarchical' => $h,
            'include' => get_cat_ID('About Topcoder') . ',' . get_cat_ID('Competing') . ',' . get_cat_ID('Getting Around'),
		);

		if ( $d ) {
			static $first_dropdown = true;

			$dropdown_id = ( $first_dropdown ) ? 'cat' : "{$this->id_base}-dropdown-{$this->number}";
			$first_dropdown = false;

			echo '<label class="screen-reader-text" for="' . esc_attr( $dropdown_id ) . '">' . $title . '</label>';

			$cat_args['show_option_none'] = __( 'Select Category' );
			$cat_args['id'] = $dropdown_id;

			/**
			 * Filter the arguments for the Categories widget drop-down.
			 *
			 * @since 2.8.0
			 *
			 * @see wp_dropdown_categories()
			 *
			 * @param array $cat_args An array of Categories widget drop-down arguments.
			 */
			wp_dropdown_categories( apply_filters( 'widget_categories_dropdown_args', $cat_args ) );
?>

<script type='text/javascript'>
/* <![CDATA[ */
(function() {
	var dropdown = document.getElementById( "<?php echo esc_js( $dropdown_id ); ?>" );
	function onCatChange() {
		if ( dropdown.options[ dropdown.selectedIndex ].value > 0 ) {
			location.href = "<?php echo home_url(); ?>/?cat=" + dropdown.options[ dropdown.selectedIndex ].value;
		}
	}
	dropdown.onchange = onCatChange;
})();
/* ]]> */
</script>

<?php
		} else {
?>
		<ul>
<?php
		$cat_args['title_li'] = '';

		/**
		 * Filter the arguments for the Categories widget.
		 *
		 * @since 2.8.0
		 *
		 * @param array $cat_args An array of Categories widget options.
		 */
		wp_list_categories( apply_filters( 'widget_categories_args', $cat_args ) );
?>
		</ul>
<?php
		}

		echo $args['after_widget'];
	}

	public function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = strip_tags($new_instance['title']);
		$instance['count'] = !empty($new_instance['count']) ? 1 : 0;
		$instance['hierarchical'] = !empty($new_instance['hierarchical']) ? 1 : 0;
		$instance['dropdown'] = !empty($new_instance['dropdown']) ? 1 : 0;

		return $instance;
	}

	public function form( $instance ) {
		//Defaults
		$instance = wp_parse_args( (array) $instance, array( 'title' => '') );
		$title = esc_attr( $instance['title'] );
		$count = isset($instance['count']) ? (bool) $instance['count'] :false;
		$hierarchical = isset( $instance['hierarchical'] ) ? (bool) $instance['hierarchical'] : false;
		$dropdown = isset( $instance['dropdown'] ) ? (bool) $instance['dropdown'] : false;
?>
		<p><label for="<?php echo $this->get_field_id('title'); ?>"><?php _e( 'Title:' ); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" /></p>

		<p><input type="checkbox" class="checkbox" id="<?php echo $this->get_field_id('dropdown'); ?>" name="<?php echo $this->get_field_name('dropdown'); ?>"<?php checked( $dropdown ); ?> />
		<label for="<?php echo $this->get_field_id('dropdown'); ?>"><?php _e( 'Display as dropdown' ); ?></label><br />

		<input type="checkbox" class="checkbox" id="<?php echo $this->get_field_id('count'); ?>" name="<?php echo $this->get_field_name('count'); ?>"<?php checked( $count ); ?> />
		<label for="<?php echo $this->get_field_id('count'); ?>"><?php _e( 'Show post counts' ); ?></label><br />

		<input type="checkbox" class="checkbox" id="<?php echo $this->get_field_id('hierarchical'); ?>" name="<?php echo $this->get_field_name('hierarchical'); ?>"<?php checked( $hierarchical ); ?> />
		<label for="<?php echo $this->get_field_id('hierarchical'); ?>"><?php _e( 'Show hierarchy' ); ?></label></p>
<?php
	}

}