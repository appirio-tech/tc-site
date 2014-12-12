<?php

/**
 * @file
 * Read from config.json and load into WP
 */

function tc_load_config() {
    $config_map = get_transient(__FUNCTION__);

    if (!$config_map) {
        if (!$config_map = @file_get_contents(ABSPATH . 'config.json')) {
            $config_map = tc_config_defaults();
        } else {
            $config_map = json_decode($config_map, TRUE);
        }

        set_transient(__FUNCTION__, $config_map);
    }

    // Site URL
    _tc_local_config_define('WP_SITEURL', $config_map['mainURL']);
    _tc_local_config_define('WP_HOME', $config_map['mainURL']);

    // API
    _tc_local_config_define('TC_API_URL', $config_map['apiURL']);
    _tc_local_config_define('TC_LC_URL', $config_map['lcURL']);
    _tc_local_config_define('LC_DISCUSSION_URL', $config_map['lcDiscussionURL']);
    _tc_local_config_define('MY_FILERS_URL', $config_map['myFiltersURL']);

    // AUTH0 STUFF
    _tc_local_config_define('CONFIG_AUTH0_CLIENTID', $config_map['auth0ClientID']);
    _tc_local_config_define('CONFIG_AUTH0_CALLBACKURL', $config_map['auth0CallbackURL']);
    _tc_local_config_define('CONFIG_AUTH0_LDAP', $config_map['auth0LDAP']);
    _tc_local_config_define('CONFIG_AUTH0_URL', $config_map['auth0URL']);
    _tc_local_config_define('CONFIG_COMMUNITY_URL', $config_map['communityURL']);

    // js/css stuff
    _tc_local_config_define('TC_CDN_URL', $config_map['cdnURL']);
    _tc_local_config_define('TC_USE_CDN', $config_map['useCND']);
    _tc_local_config_define('TC_USE_MIN', $config_map['useMin']);
    _tc_local_config_define('TC_USE_VER', $config_map['useVer']);
    _tc_local_config_define('TC_CDN_VER', $config_map['version']);
    _tc_local_config_define('TC_CDN_GZ', $config_map['useGz']);
}

function _tc_local_config_define($def, $option) {
    if (!defined($def)) {
        define($def, $option);
    }
}

function tc_config_defaults() {
    return array(
        'mainURL' => 'http://www.topcoder.com',
        'apiURL' => 'https://api.topcoder.com/v2',
        'auth0ClientID' => '6ZwZEUo2ZK4c50aLPpgupeg5v2Ffxp9P',
        'auth0CallbackURL' => 'https://www.topcoder.com/reg2/callback.action',
        'auth0LDAP' => 'LDAP',
        'communityURL' => 'http://community.topcoder.com',
        'cdnURL' => '',
        'useCND' => false,
        'useMin' => false,
        'useVer' => false,
        'version' => time(),
        'useGz' => false,
        'lcURL' => ''
    );
}
