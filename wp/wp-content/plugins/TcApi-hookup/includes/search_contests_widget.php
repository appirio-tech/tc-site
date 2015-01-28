<?php

/**
 * Search Contest Widget
 */
class Search_contests_widget extends WP_Widget {
	// setup widget
	function Search_contests_widget() {
		
		// widget settings
		$widget_ops = array (
				'classname' => 'search_contests_widget',
				'description' => __ ( 'Search contests widget using TcApi', 'search_contests_widget' ) 
		);
		
		// widget control settings
		$control_ops = array (
				'width' => 388,
				'height' => 327,
				'id_base' => 'search_contests_widget' 
		);
		
		// create widget
		$this->WP_Widget ( 'search_contests_widget', __ ( 'Search contests widget', 'search_contests_widget' ), $widget_ops, $control_ops );
	}
	
	/**
	 * How to display the widget on the screen.
	 */
	function widget($args, $instance) {
		// Widget output
		extract ( $args );
		
		/* Our variables from the widget settings. */
		$title = $instance ['contest'];
		
		/* Before widget (defined by themes). */
		echo $before_widget;
		?>
<form method="get" enctype="application/x-www-form-urlencoded" action="<?php echo site_url ();?>/contest-search">
	<div class="search_contests_widget">
		<div class="widg_header">SEARCH CONTESTS</div>
		<div class="widg_con">
			<p>Let find the Contest you want to compete</p>

			<div class="search_row">
				<div class="inputBox">
					<div class="boxR">
						<div class="boxM">
							<input type="text" name="Contest_Name" data-placeholder="Contest Name" id="Contest_Name" value="Contest Name" class="contest_name preText tipIt">
						</div>
					</div>
				</div>
				<a class="btnSearch redBtn2" href="javascript:;">
					<span class="buttonMask"><span class="text">Search</span></span>
				</a>
				<input type="submit" class="btnSubmit"/>
			</div>
		</div>
	</div>
	<!-- /.search_contest_widget -->
</form>

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
		$instance ['title'] = strip_tags ( $new_instance ['title'] );
		
		return $instance;
	}
	
	/**
	 * Displays the widget settings controls on the widget panel.
	 * Make use of the get_field_id() and get_field_name() function
	 * when creating your form elements. This handles the confusing stuff.
	 */
	function form($instance) {
		
		/* Set up some default widget settings. */
		$defaults = array (
				'title' => __ ( 'TopCoder contest Search', event_widget ) 
		);
		$instance = wp_parse_args ( ( array ) $instance, $defaults );
		?>

<!-- Title: Text Input -->
<p>
	<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e('Title:', 'event_widget'); ?></label>
	<input id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" value="<?php echo $instance['title']; ?>" style="width: 100%;" />
</p>
<?php
	}
}

?>
