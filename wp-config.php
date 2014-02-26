<?php
# Database Configuration
define('DB_NAME','wp_cloudspokes');
define('DB_USER','cloudspokes');
define('DB_PASSWORD','xJSnQRK4QfngEY8bceZJ');
define('DB_HOST','127.0.0.1');
define('DB_HOST_SLAVE','localhost');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', 'utf8_unicode_ci');
$table_prefix = 'wp_';

# Security Salts, Keys, Etc
define('AUTH_KEY',         ']@V|]H;2+VG!+maav38+L$K@hC:es),Lh;#c+|7`[.B]E(Oma4Q-bMD{:YI9:+h<');
define('SECURE_AUTH_KEY',  'dSZQ4Q;up-v1/I%UG~R<n I 58j-+NZaRQ1no`1Y0I-%AA%|wYLK!)u-hHw?kBnv');
define('LOGGED_IN_KEY',    'a[KFB{beCAa#tQesez={]WomArGK/1%X}k$@9}|7n5KC%S<o.|?1H.PV+tI5 Psk');
define('NONCE_KEY',        '_x>+t[AD97Z[1ON*h+mM2jz^TLFDqiezI%yDLHrNPN+:([R?m?~Y;:-foJ=R(]9.');
define('AUTH_SALT',        '[^=9jQ0gcs#$D3!i_eWB;2bDa{FJVkP-+6@GcK}WI<#/4VD.MHaq%0%uwM;G-U:b');
define('SECURE_AUTH_SALT', '&^a#@>ws?Y,V=0NrgVN1_XHE+nu5Zy@+ehpFIce+<;>|tE57/y0lDfmJ?-Wt<Fw?');
define('LOGGED_IN_SALT',   'x! LL<&x};f7^fk4lDhAGCKWn&y0NwE:#( {sNfvG6k|o`+#Yu%v)%{-u;}Ez,k4');
define('NONCE_SALT',       'wSn,`P]1J#8Z+O+8dtlW8+JHPN?;XW>=8)GLaBU8W6}a+FmTiMU}Xhpg~rzZ<bu(');


# Localized Language Stuff


define('PWP_NAME','cloudspokes');

define('FS_METHOD','direct');

define('FS_CHMOD_DIR',0775);

define('FS_CHMOD_FILE',0664);

define('PWP_ROOT_DIR','/nas/wp');

define('WPE_APIKEY','c94b41ef881686e120cdad0e9b947e7e047331c4');

define('WPE_FOOTER_HTML',"");

define('WPE_CLUSTER_ID','2535');

define('WPE_CLUSTER_TYPE','pod');

define('WPE_ISP',true);

define('WPE_BPOD',false);

define('WPE_RO_FILESYSTEM',false);

define('WPE_LARGEFS_BUCKET','largefs.wpengine');

define('WPE_CDN_DISABLE_ALLOWED',false);

define('DISALLOW_FILE_EDIT',FALSE);

define('DISALLOW_FILE_MODS',FALSE);

define('DISABLE_WP_CRON',false);

define('WPE_FORCE_SSL_LOGIN',false);

define('FORCE_SSL_LOGIN',false);

/*SSLSTART*/ if ( isset($_SERVER['HTTP_X_WPE_SSL']) && $_SERVER['HTTP_X_WPE_SSL'] ) $_SERVER['HTTPS'] = 'on'; /*SSLEND*/

define('WPE_EXTERNAL_URL',false);

define('WP_POST_REVISIONS',FALSE);

define('WPE_WHITELABEL','wpengine');

define('WP_TURN_OFF_ADMIN_BAR',false);

define('WPE_BETA_TESTER',false);

umask(0002);

$wpe_cdn_uris=array ();

$wpe_no_cdn_uris=array ();

$wpe_content_regexs=array ();

$wpe_all_domains=array (  0 => 'cloudspokes.wpengine.com',  1 => 'www.topcoder.com',);

$wpe_varnish_servers=array (  0 => 'pod-2535',);

$wpe_ec_servers=array ();

$wpe_largefs=array ();

$wpe_netdna_domains=array (  0 =>   array (    'match' => 'beta.topcoder.com',    'zone' => 'cloudspokes',    'secure' => false,  ),);

$wpe_netdna_push_domains=array ();

$wpe_domain_mappings=array ();

$memcached_servers=array (  'default' =>   array (    0 => 'unix:///tmp/memcached.sock',  ),);

define('WP_AUTO_UPDATE_CORE',false);

define('WP_CACHE',TRUE);

define('WP_SITEURL','http://www.topcoder.com');

define('WP_HOME','http://www.topcoder.com');

$wpe_special_ips=array ();

$wpe_netdna_domains_secure=array ();

define('DOMAIN_CURRENT_SITE','cloudspokes.staging.wpengine.com');
define('WPLANG','');

# WP Engine ID


# WP Engine Settings






# That's It. Pencils down
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');
require_once(ABSPATH . 'wp-settings.php');

$_wpe_preamble_path = null; if(false){}
