<?php
/**
 * @package   log-viewer
 * @author    Markus Fischbacher <fischbacher.markus@gmail.com>
 * @license   GPL-2.0+
 * @link      http://wordpress.org/extend/plugins/log-viewer/
 * @copyright 2013 Markus Fischbacher
 *
 * @wordpress-plugin
 * Plugin Name:       Log Viewer
 * Plugin URI:        http://wordpress.org/extend/plugins/log-viewer/
 * Description:       This plugin provides an easy way to view log files directly in the admin panel.
 * Version:           13.12.22
 * Tag:               13.12.22
 * Timestamp:         13.12.22-1329
 * Author:            Markus Fischbacher
 * Author URI:        https://plus.google.com/+MarkusFischbacher
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 */

// If this file is called directly, abort.
if( !defined( 'WPINC' ) ) {
	die;
}

/*----------------------------------------------------------------------------*
 * Dashboard and Administrative Functionality
 *----------------------------------------------------------------------------*/

if( is_admin() && ( !defined( 'DOING_AJAX' ) || !DOING_AJAX ) ) {

	require_once( plugin_dir_path( __FILE__ ) . '/admin/class-log-viewer-admin.php' );
	add_action( 'plugins_loaded', array( 'Log_Viewer_Admin', 'get_instance' ) );

}
