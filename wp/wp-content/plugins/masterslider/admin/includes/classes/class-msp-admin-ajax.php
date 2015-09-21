<?php
/**
 * @package   MasterSlider
 * @author    averta [averta.net]
 * @license   LICENSE.txt
 * @link      http://masterslider.com
 * @copyright Copyright © 2014 averta
*/

// no direct access allowed
if ( ! defined('ABSPATH') ) {
    die();
}

class MSP_Admin_Ajax {
	


	function __construct () {
		
		// get and save data on ajax data post
		add_action( 'wp_ajax_msp_panel_handler' 	, array( $this, 'save_panel_ajax'     ) );
		add_action( 'wp_ajax_msp_create_new_handler', array( $this, 'create_new_slider'   ) );
		add_action( 'wp_ajax_post_slider_preview'	, array( $this, 'post_slider_preview' ) );
		add_action( 'wp_ajax_wc_slider_preview'		, array( $this, 'wc_slider_preview' ) );

		add_action( 'wp_ajax_msp_license_activation', array( $this, 'check_license_activation' ) );
	}



	/**
	 * Get preview data form post in admin area
	 *
	 * @since    1.5.0
	 */
	public function post_slider_preview() {
	    
		header( "Content-Type: application/json" );
		
		// verify nonce
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], "msp_panel") ) {
			echo json_encode( array( 'success' => false, 'message' => __( "Authorization failed!", MSWP_TEXT_DOMAIN ) ) );
			exit;
		}

		$PS = msp_get_post_slider_class();
		$posts_result  = $PS->parse_and_get_posts_result();
		$template_tags = $PS->get_first_post_template_tags_value();

		if( empty( $posts_result ) )
			$template_tags = null;
		
	    echo json_encode( array( 'success' => true, 'type' => 'preview' , 'message' => '', 'preview_results' => $posts_result, 'template_tags' => $template_tags ) );
	    exit;// IMPORTANT
	}


	/**
	 * Get preview data form woocommerce product in admin area
	 *
	 * @since    1.7.4
	 */
	public function wc_slider_preview() {
	    
		header( "Content-Type: application/json" );
		
		// verify nonce
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], "msp_panel") ) {
			echo json_encode( array( 'success' => false, 'message' => __( "Authorization failed!", MSWP_TEXT_DOMAIN ) ) );
			exit;
		}

		if ( ! msp_is_plugin_active( 'woocommerce/woocommerce.php' ) ){
			echo json_encode( array( 'success' => false, 'message' => __( "Please install and activate WooCommerce plugin.", MSWP_TEXT_DOMAIN ) ) );
		}

		$wcs = msp_get_wc_slider_class();
		$posts_result  = $wcs->parse_and_get_posts_result();
		$template_tags = $wcs->get_first_post_template_tags_value();

		if( empty( $posts_result ) )
			$template_tags = null;
		
	    echo json_encode( array( 'success' => true, 'type' => 'preview' , 'message' => '', 'preview_results' => $posts_result, 'template_tags' => $template_tags ) );
	    exit;// IMPORTANT
	}



	/**
	 * Save ajax handler for main panel data
	 *
	 * @since    1.0.0
	 */
	public function save_panel_ajax() {
	    
		header( "Content-Type: application/json" );
		
		// verify nonce
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], "msp_panel") ) {
			echo json_encode( array( 'success' => false, 'message' => __("Authorization failed!", MSWP_TEXT_DOMAIN ) ) );
			exit();
		}
		
		// ignore the request if the current user doesn't have sufficient permissions
	    if ( ! current_user_can( 'publish_masterslider' ) ) {
	    	echo json_encode( array( 'success' => false,
	    	                 		 'message' => apply_filters( 'masterslider_insufficient_permissions_to_publish_message', __( "Sorry, You don't have enough permission to publish slider!", MSWP_TEXT_DOMAIN ) ) 
	    	                 		) 
	    	);
	    	exit();
		}

		/////////////////////////////////////////////////////////////////////////////////////////

		// Get the slider id
		$slider_id 		= isset( $_REQUEST['slider_id']     ) ? $_REQUEST['slider_id']     : '';

		if ( empty( $slider_id ) ) {
			 echo json_encode( array( 'success' => false, 'type' => 'save' , 'message' => __( "Slider id is not defined.", MSWP_TEXT_DOMAIN )  ) );
			 exit;
		}

		// get the slider type
		$slider_type 	= isset( $_REQUEST['slider_type']   ) ? $_REQUEST['slider_type']   : 'custom';

		// get panel data
		$msp_data		= isset( $_REQUEST['msp_data']      ) ? $_REQUEST['msp_data']      : NULL;
		$preset_style	= isset( $_REQUEST['preset_style']  ) ? $_REQUEST['preset_style']  : NULL;
		$preset_effect	= isset( $_REQUEST['preset_effect'] ) ? $_REQUEST['preset_effect'] : NULL;
		$buttons_style	= isset( $_REQUEST['buttons'] 		) ? $_REQUEST['buttons'] 	   : NULL;
		

		// store preset data in database seperately
	    msp_update_option( 'preset_style' , $preset_style  );
	    msp_update_option( 'preset_effect', $preset_effect );
	    msp_update_option( 'buttons_style', $buttons_style );

		
		// get parse and database tools
		global $mspdb;

		// load and get parser and start parsing data
		$parser = msp_get_parser();
		$parser->set_data( $msp_data, $slider_id );
		
		// get required parsed data
		$slider_setting       = $parser->get_slider_setting();
		$slides       		  = $parser->get_slides();
		$slider_custom_styles = $parser->get_styles();

		$fields = array(
			'title' 		=> $slider_setting[ 'title' ], 
			'type'			=> $slider_setting[ 'slider_type' ],
			'slides_num'	=> count( $slides ),
			'params'		=> $msp_data,
			'custom_styles' => $slider_custom_styles,
			'custom_fonts'  => $slider_setting[ 'gfonts' ],
			'status'		=> 'published'
		);

		// store slider data in database
		$is_saved = $mspdb->update_slider( $slider_id, $fields );

	    msp_update_preset_css();
	    msp_update_buttons_css();
	    msp_save_custom_styles();


	    // flush slider cache if slider cache is enabled
	    msp_flush_slider_cache( $slider_id );
	    
	    
		// create and output the response
		if( isset( $is_saved ) )
			$response = json_encode( array( 'success' => true, 'type' => 'save' , 'message' => __( "Saved Successfully.", MSWP_TEXT_DOMAIN )  ) );
	    else
	    	$response = json_encode( array( 'success' => true, 'type' => 'save' , 'message' => __( "No Data Recieved."  , MSWP_TEXT_DOMAIN )  ) );
	    
	    echo $response;
		
	    exit;// IMPORTANT
	}



	/**
	 * Create new slider by type
	 *
	 * @since    1.0.0
	 */
	public function create_new_slider() {
	    
		header( "Content-Type: application/json" );
		
		// verify nonce
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], "msp_panel") ) {
			echo json_encode( array( 'success' => false, 'message' => __("Authorization failed!", MSWP_TEXT_DOMAIN ) ) );
			exit();
		}
		
		// ignore the request if the current user doesn't have sufficient permissions
	    if ( ! current_user_can( 'create_masterslider' ) && ! current_user_can( 'publish_masterslider' ) ) {
	    	echo json_encode( array( 'success' => false,
	    	                 		 'message' => apply_filters( 'masterslider_create_slider_permissions_message', __( "Sorry, You don't have enough permission to create slider!", MSWP_TEXT_DOMAIN ) ) 
	    	                 		) 
	    	);
	    	exit();
		}


		/////////////////////////////////////////////////////////////////////////////////////////
		
		// Get the slider id
		$slider_type = isset( $_REQUEST['slider_type'] ) ? $_REQUEST['slider_type'] : '';


		// Get new slider id
		global $mspdb;
		$slider_id = $mspdb->add_slider( array( 'status' => 'draft', 'type' => $slider_type ) );
	    
	    
		// create and output the response
		if( false !== $slider_id )
			$response = json_encode( array( 'success' => true, 'slider_id' => $slider_id , 'redirect' => admin_url( 'admin.php?page='.MSWP_SLUG.'&action=edit&slider_id='.$slider_id.'&slider_type='.$slider_type ), 'message' => __( "Slider Created Successfully.", MSWP_TEXT_DOMAIN )  ) );
	    else
	    	$response = json_encode( array( 'success' => true, 'slider_id' => '' , 'redirect' => '', message => __( "Slider can not be created."  , MSWP_TEXT_DOMAIN )  ) );
	    
	    echo $response;
		
	    exit;// IMPORTANT
	}



	function check_license_activation() {

		// header( "Content-Type: application/json" );
		
		// verify nonce
		/*if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], "msp_panel") ) {
			echo json_encode( array( 'success' => 0, 'message' => __( "Authorization failed!", MSWP_TEXT_DOMAIN ) ) );
			exit();
		}*/

        $username    	= isset( $_POST['username'] 	 ) ? $_POST['username'] 	 : '';
        $purchase_code  = isset( $_POST['purchase_code'] ) ? $_POST['purchase_code'] : ''; // check emptiness
        $action 		= isset( $_POST['type'] 		 ) ? $_POST['type'] 		 : '';
        
        $result = Axiom_Plugin_License::get_instance()->license_action( $username, $purchase_code, $action );
    	
    	echo json_encode( $result );
        exit;// IMPORTANT   
    }

}

new MSP_Admin_Ajax();