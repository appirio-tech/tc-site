<?php

// Init plugin auto-update class
function msp_check_for_update() {

    $plugin_update_check = new Axiom_Plugin_Check_Update (
        MSWP_AVERTA_VERSION,                    // current version
        'http://api.averta.net/envato/items/',  // update path
        MSWP_AVERTA_BASE_NAME,                  // plugin file slug
        'masterslider',                         // plugin slug
        'masterslider-wp',                      // item request name
        MSWP_AVERTA_DIR . '/masterslider.php'   // plugin file
    );
    $plugin_update_check->plugin_id = '7467925';
    $plugin_update_check->banners   = array(
        'low'   => 'http://ps.w.org/master-slider/assets/banner-772x250.png',
        'high'  => 'http://ps.w.org/master-slider/assets/banner-772x250.png'
    );
}
msp_check_for_update();



function msp_filter_masterslider_admin_menu_title( $menu_title ){
	$current = get_site_transient( 'update_plugins' );

    if ( ! isset( $current->response[ MSWP_AVERTA_BASE_NAME ] ) )
		return $menu_title;

	return $menu_title . '&nbsp;<span class="update-plugins"><span class="plugin-count">1</span></span>';
}

add_filter( 'masterslider_admin_menu_title', 'msp_filter_masterslider_admin_menu_title');



function after_masterslider_row_meta( $plugin_meta, $plugin_file, $plugin_data, $status ){
    if( MSWP_AVERTA_BASE_NAME == $plugin_file && get_option( MSWP_SLUG . '_is_license_actived', 0 ) ){
        $plugin_meta[] = '<a href="http://masterslider.com/doc/wp/#rate" target="_blank" title="' . esc_attr__( 'Rate this plugin', MSWP_TEXT_DOMAIN ) . '">' . __( 'Rate this plugin', MSWP_TEXT_DOMAIN ) . '</a>';
        $plugin_meta[] = '<a href="http://masterslider.com/doc/wp/#support" target="_blank" title="' . esc_attr__( 'Premium support', MSWP_TEXT_DOMAIN ) . '">' . __( 'Premium support', MSWP_TEXT_DOMAIN ) . '</a>';
    }

    return $plugin_meta;
}

add_filter( "plugin_row_meta", 'after_masterslider_row_meta', 10, 4 );

// Check to make sure the user "rich_editing" is enabled

function msp_admin_notice_rich_editing(){
    printf('<div class="update-nag">%s</div>', __( 'Warning: the [rich editing] capability is disabled for this user which might lead to some potential issues. Please enable it.', 'default' ) );
}

function msp_check_vital_user_capabilities(){
    $current_user = wp_get_current_user();
    if( ! get_user_meta( $current_user->ID, 'rich_editing', true ) ){
        add_action( 'admin_notices', 'msp_admin_notice_rich_editing' );
    }
}
add_action( 'admin_init', 'msp_check_vital_user_capabilities' );


// remove invalid token
function msp_new_api_compatibility(){

    if( false === get_transient( 'msp_get_token_validation_status' ) ){
        $status = Axiom_Plugin_License::get_instance()->remove_invalid_token();
        set_transient( 'msp_get_token_validation_status', 1, DAY_IN_SECONDS );
    }

}
add_action( 'admin_init', 'msp_new_api_compatibility' );
