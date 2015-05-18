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
  register_widget('Blog_category_widget');
  register_widget('Popular_post_widget');
  register_widget('Subscribe_widget');
  register_widget('Download_banner_widget');
  register_widget('Quote_widget');
  register_widget('Recent_challenges');
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
