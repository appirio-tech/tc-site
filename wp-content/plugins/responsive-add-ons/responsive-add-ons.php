<?php
/*
Plugin Name: Responsive Add Ons
Plugin URI: http://wordpress.org/plugins/responsive-add-ons/
Description: Added functionality for the responsive theme
Version: 1.0.5
Author: CyberChimps
Author URI: http://www.cyberchimps.com
License: GPL2
*/
/*
Copyright 2013  CyberChimps  (email : support@cyberchimps.com)

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

if( !class_exists( 'Responsive_Addons' ) ) {
	class Responsive_Addons {

		public $options;

		public $plugin_options;

		public function __construct() {

			add_action( 'admin_init', array( &$this, 'admin_init' ) );
			add_action( 'admin_menu', array( &$this, 'add_menu' ) );
			add_action( 'wp_head', array( &$this, 'responsive_head' ) );
			add_action( 'plugins_loaded', array( &$this, 'responsive_addons_translations' ) );
			$plugin = plugin_basename( __FILE__ );
			add_filter( "plugin_action_links_$plugin", array( &$this, 'plugin_settings_link' ) );

			$this->options        = get_option( 'responsive_theme_options' );
			$this->plugin_options = get_option( 'responsive_addons_options' );
		}

		/**
		 * Stuff to do when you activate
		 */
		public static function activate() {
		}

		/**
		 * Clean up after Deactivation
		 */
		public static function deactivate() {
		}

		/**
		 * Hook into WP admin_init
		 */
		public function admin_init() {

			// Check if the theme being used is Responsive. If True then add settings to Responsive settings, else set up a settings page
			if( $this->is_responsive() ) {
				add_filter( 'responsive_option_sections_filter', array( &$this, 'responsive_option_sections' ), 10, 1 );
				add_filter( 'responsive_options_filter', array( &$this, 'responsive_options' ), 10, 1 );

			}
			else {
				$this->init_settings();
			}
		}

		/**
		 * Create plugin translations
		 */
		public function responsive_addons_translations() {
			// Load the text domain for translations
			load_plugin_textdomain( 'responsive-addons', false, basename( dirname( __FILE__ ) ) . '/languages' );
		}

		/**
		 * Settings
		 */
		public function init_settings() {
			register_setting( 'responsive_addons', 'responsive_addons_options', array( &$this, 'responsive_addons_sanitize' ) );

		}

		/**
		 * Add the menu
		 */
		public function add_menu() {
			// Hides Menu options if the current theme is responsive
			if( !$this->is_responsive() ) {
				add_options_page( 'Responsive Addons', 'Responsive Add Ons', 'manage_options', 'responsive_addons', array( &$this,
					'plugin_settings_page'
				) );
			}
		}

		/**
		 * The settings page
		 */
		public function plugin_settings_page() {
			if( !current_user_can( 'manage_options' ) ) {
				wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
			}
			// Render the settings template
			include( sprintf( "%s/templates/settings.php", dirname( __FILE__ ) ) );
		}

		/**
		 * Test to see if the current theme is Responsive
		 *
		 * @return bool
		 */
		public static function is_responsive() {
			$theme = wp_get_theme();

			if( $theme->Name == 'Responsive' || $theme->Template == 'responsive' || $theme->Name == 'Responsive Pro' || $theme->Template == 'responsivepro' ) {
				return true;
			} else {
				return false;
			}
		}

		public function responsive_option_sections( $sections ) {

			$new_sections = array(
				array(
					'title' => __( 'Webmaster Tools', 'responsive-addons' ),
					'id'    => 'webmaster'
				)
			);

			$new = array_merge( $sections, $new_sections );

			return $new;
		}

		public function responsive_options( $options ) {

			$new_options = array(
				'webmaster' => array(
					array(
						'title'       => __( 'Google Site Verification', 'responsive-addons' ),
						'subtitle'    => '',
						'heading'     => '',
						'type'        => 'text',
						'id'          => 'google_site_verification',
						'description' => __( 'Enter your Google ID number only', 'responsive-addons' ),
						'placeholder' => ''
					),
					array(
						'title'       => __( 'Bing Site Verification', 'responsive-addons' ),
						'subtitle'    => '',
						'heading'     => '',
						'type'        => 'text',
						'id'          => 'bing_site_verification',
						'description' => __( 'Enter your Bing ID number only', 'responsive-addons' ),
						'placeholder' => ''
					),
					array(
						'title'       => __( 'Yahoo Site Verification', 'responsive-addons' ),
						'subtitle'    => '',
						'heading'     => '',
						'type'        => 'text',
						'id'          => 'yahoo_site_verification',
						'description' => __( 'Enter your Yahoo ID number only', 'responsive-addons' ),
						'placeholder' => ''
					),
					array(
						'title'       => __( 'Site Statistics Tracker', 'responsive-addons' ),
						'subtitle'    => '<span class="info-box information help-links">' . __( 'Leave blank if plugin handles your webmaster tools', 'responsive-addons' ) . '</span>' . '<a style="margin:5px;" class="resp-addon-forum button" href="http://cyberchimps.com/forum/free/responsive/">Forum</a>' . '<a style="margin:5px;" class="resp-addon-guide button" href="http://cyberchimps.com/guide/responsive-add-ons/">Guide</a>',
                        'heading'     => '',
						'type'        => 'textarea',
						'id'          => 'site_statistics_tracker',
						'class'       => array( 'site-tracker' ),
						'description' => __( 'Google Analytics, StatCounter, any other or all of them.', 'responsive-addons' ),
						'placeholder' => ''
					),

				)
			);

			$new = array_merge( $options, $new_options );

			return $new;
		}

		/**
		 * Add to wp head
		 */
		public function responsive_head() {

			// Test if using Responsive theme. If yes load from responsive options else load from plugin options
			$responsive_options = ( $this->is_responsive() ) ? $this->options : $this->plugin_options;

			if( !empty( $responsive_options['google_site_verification'] ) ) {
				echo '<meta name="google-site-verification" content="' . esc_attr( $responsive_options['google_site_verification'] ) . '" />' . "\n";
			}

			if( !empty( $responsive_options['bing_site_verification'] ) ) {
				echo '<meta name="msvalidate.01" content="' . esc_attr( $responsive_options['bing_site_verification'] ) . '" />' . "\n";
			}

			if( !empty( $responsive_options['yahoo_site_verification'] ) ) {
				echo '<meta name="y_key" content="' . esc_attr( $responsive_options['yahoo_site_verification'] ) . '" />' . "\n";
			}

			if( !empty( $responsive_options['site_statistics_tracker'] ) ) {
				echo $responsive_options['site_statistics_tracker'];
			}
		}

		public function responsive_addons_sanitize( $input ) {

			$output = array();

			foreach( $input as $key => $test ) {
				switch( $key ) {
					case 'google_site_verification':
						$output[$key] = wp_filter_post_kses( $test );
						break;
					case 'yahoo_site_verification':
						$output[$key] = wp_filter_post_kses( $test );
						break;
					case 'bing_site_verification':
						$output[$key] = wp_filter_post_kses( $test );
						break;
					case 'site_statistics_tracker':
						$output[$key] = wp_kses_stripslashes( $test );
						break;

				}

			}

			return $output;
		}

		/**
		 * Add settings link to plugin activate page
		 *
		 * @param $links
		 *
		 * @return mixed
		 */
		public function plugin_settings_link( $links ) {
			if ( $this->is_responsive() ) {
				$settings_link = '<a href="themes.php?page=theme_options">' . __( 'Settings', 'responsive-addons' ) . '</a>';
			} else {
				$settings_link = '<a href="options-general.php?page=responsive_addons">' . __( 'Settings', 'responsive-addons' ) . '</a>';
			}
			array_unshift( $links, $settings_link );

			return $links;
		}

	}
}

/**
 * Initialize Plugin
 */
if( class_exists( 'Responsive_Addons' ) ) {

	// Installation and uninstallation hooks
	register_activation_hook( __FILE__, array( 'Responsive_Addons', 'activate' ) );
	register_deactivation_hook( __FILE__, array( 'Responsive_Addons', 'deactivate' ) );

	// Initialise Class
	$responsive = new Responsive_Addons();
}
