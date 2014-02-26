=== TC API Hookup ===
Author: added after submission phase
Tags: Tc API integration
Requires at least: 3.4
Tested up to: 3.6
Stable tag: 1
License: copyright protects topcoder inc.
License URI: http://licence.url



== Description ==

This plugin integrates TopCoder API with TopCoder's wordpress theme

* Contest Type: get_contest_type()
* View Active Contests Pages: get_active_contests()
* View Past Contests Pages: get_past_contests()
* Authors will be added after submission phase.
* ShortCodes:  [active_contests type='$contestType], [past_contests type='$contestType'] &  [h]tc_handle[/h]


For further information and instructions please see the deployment documentation file.

== Installation ==

The quickest method for installing the TC hookup pluign is:

1. Visit Tools -> Import in the WordPress dashboard
1. Upload the attached plugin
1. Click "Install Now"
1. Finally click "Activate Plugin & Run Importer"
1. If getting page not found error the deactive & activated the plugin. The reason for this is explained in plugin_deployment doc file.

If you would prefer to do things manually then follow these instructions:

1. Upload & exratct the `TC hookup pluign` folder to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Go to the TopCoder API menu to configure plugin options.
