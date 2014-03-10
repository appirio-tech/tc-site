<?php
/* Register the widget */
function theme_load_widgets() {
	register_widget ( 'Related_Content' );
	register_widget ( 'External_Links' );
}


class Related_Content extends WP_Widget {
	
	/* Widget setup */
	function Related_Content() {
		/* Widget settings. */
		$widget_ops = array (
				'classname' => 'Related_Content',
				'description' => __ ( 'Related Content', 'inm' ) 
		);
		
		/* Widget control settings. */
		$control_ops = array (
				'id_base' => 'related_content' 
		);
		
		/* Create the widget. */
		$this->WP_Widget ( 'related_content', __ ( 'Related_Content', 'inm' ), $widget_ops, $control_ops );
	}
	
	/* Display the widget */
	function widget($args, $instance) {
		extract ( $args );
		
		/* Before widget (defined by themes). */
		echo $before_widget;
		
		/* Display the widget title if one was input (before and after defined by themes). */
		if ($title)
			echo $before_title . $title . $after_title;
		?>
						<div class="sideFindRelatedContent">
                                	<h3>Related Content</h3>
                                   
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
		$widget_ops = array (
				'classname' => 'External_Links',
				'description' => __ ( 'External Links', 'inm' ) 
		);
		
		/* Widget control settings. */
		$control_ops = array (
				'id_base' => 'external_links' 
		);
		
		/* Create the widget. */
		$this->WP_Widget ( 'external_links', __ ( 'External_Links', 'inm' ), $widget_ops, $control_ops );
	}
	
	/* Display the widget */
	function widget($args, $instance) {
		extract ( $args );
		
		/* Before widget (defined by themes). */
		echo $before_widget;
		
		/* Display the widget title if one was input (before and after defined by themes). */
		if ($title)
			echo $before_title . $title . $after_title;
		?>
						<div class="sideFindRelatedContent">
                                	<h3>Links</h3>
                                   
                                </div>
<!-- /.sideFindRelatedContent -->

<?php
		echo $after_widget;
	}
}
add_action ( 'widgets_init', 'theme_load_widgets' );
?>