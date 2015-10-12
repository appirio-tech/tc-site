<?php

class mk_lovePost {

	function __construct() {
		add_action( 'wp_ajax_mk_love_post', array( &$this, 'mk_love_post' ) );
		add_action( 'wp_ajax_nopriv_mk_love_post', array( &$this, 'mk_love_post' ) );
	}



	function mk_love_post( $post_id ) {

		if ( isset( $_POST['post_id'] ) ) {
			$post_id = str_replace( 'mk-love-', '', $_POST['post_id'] );
			echo $this->love_post( $post_id, 'update' );
		}
		else {
			$post_id = str_replace( 'mk-love-', '', $_POST['post_id'] );
			echo $this->love_post( $post_id, 'get' );
		}

		exit;
	}


	function love_post( $post_id, $action = 'get' ) {
		if ( !is_numeric( $post_id ) ) return;

		switch ( $action ) {

		case 'get':
			$love_count = get_post_meta( $post_id, '_mk_post_love', true );
			if ( !$love_count ) {
				$love_count = 0;
				add_post_meta( $post_id, '_mk_post_love', $love_count, true );
			}

			return '<span class="mk-love-count">'. $love_count .'</span>';
			break;

		case 'update':
			$love_count = get_post_meta( $post_id, '_mk_post_love', true );
			if ( isset( $_COOKIE['mk_jupiter_love_'. $post_id] ) ) return $love_count;

			$love_count++;
			update_post_meta( $post_id, '_mk_post_love', $love_count );
			setcookie( 'mk_jupiter_love_'. $post_id, $post_id, time()*20, '/' );

			return '<span class="mk-love-count">'. $love_count .'</span>';
			break;

		}
	}


	function send_love() {
		global $post;

		$output = $this->love_post( $post->ID );
		$class = '';
		if ( isset( $_COOKIE['mk_jupiter_love_'. $post->ID] ) ) {
			$class = 'item-loved';
		}

		return '<a href="#" class="mk-love-this '. $class .'" id="mk-love-'. $post->ID .'"><i class="mk-icon-heart"><span>&nbsp;</span></i> '. $output .'</a>';
	}

}


global $mk_love_this;
$mk_love_this = new mk_lovePost();

function mk_love_this( $return = '' ) {

	global $mk_love_this;

	if ( $return == 'return' ) {
		return $mk_love_this->send_love();
	} else {
		echo $mk_love_this->send_love();
	}

}

?>
