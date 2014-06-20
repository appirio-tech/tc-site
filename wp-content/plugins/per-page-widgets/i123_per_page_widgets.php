<?php
/*
Plugin Name: Per Page Widgets
Plugin URI: http://www.i123.dk/wordpress-plugin-per-page-widgets
Description: Control widget areas on a per-page / per-post basis. Gives you the ability to show or hide individual widget areas on each page / post as well as completely substituting the widgets shown in a specific widget area on a specific page or post.
Author: Internet 123
Version: 0.0.7
Author URI: http://www.i123.dk
*/
$i123_widgets_url = WP_PLUGIN_URL.'/'.str_replace(basename( __FILE__),'',plugin_basename(__FILE__));
$i123_widgets_path = WP_PLUGIN_DIR.'/'.str_replace(basename( __FILE__),'',plugin_basename(__FILE__));
load_theme_textdomain( 'i123_widgets', $i123_widgets_path . '/languages' );
$i123_widgets_sidebars_to_alter = array();
$i123_widgets_sidebars_to_hide = array();
$i123_widgets_is_special = (is_admin()&&(isset($_GET['i123_widgets_p']))&&(isset($_GET['i123_widgets_s'])));
$i123_widgets_help_text = '';

define('i123_widgets_HIDE_INACTIVE', true);

add_filter( 'sidebars_widgets', 'i123_widgets_get_real_widget_areas', 10);
$i123_widgets_pre_filtered_widget_areas = false;
function i123_widgets_get_real_widget_areas($sidebars_widgets) {
    global $wp_registered_sidebars, $sidebars_widgets, $post, $i123_widgets_pre_filtered_widget_areas;
    if ((isset($post))&&(is_numeric($post->ID))&&(is_singular())) {
        if ($i123_widgets_pre_filtered_widget_areas !== false) return $i123_widgets_pre_filtered_widget_areas;

        $values = get_post_custom( $post->ID );

        if (empty ($values)) return $sidebars_widgets;
        $i123_widgets_setting_overall = (isset($values['_i123_widgets_setting_overall'][0])) ? $values['_i123_widgets_setting_overall'][0] : '0';
        if ($i123_widgets_setting_overall==0) return $sidebars_widgets;

        foreach ($wp_registered_sidebars as $key => $value) {
            $i123_widgets_show_this = (isset($values['_i123_widgets_show_sidebar_' . $value['id']][0])) ? $values['_i123_widgets_show_sidebar_' . $value['id']][0] : '1';
            if (($i123_widgets_show_this==2)&&(isset($sidebars_widgets['i123_widgets_' . $key . '_' . $post->ID]))) {
                $sidebars_widgets[$key] = $sidebars_widgets['i123_widgets_' . $key . '_' . $post->ID];
                //unset($sidebars_widgets['i123_widgets_' . $key . '_' . $post->ID]);
            } else if ($i123_widgets_show_this==0) {
                $sidebars_widgets[$key] = array();
            }
        }
        $i123_widgets_pre_filtered_widget_areas = $sidebars_widgets;
    }
    return $sidebars_widgets;
}


add_action('sidebar_admin_setup', 'i123_widgets_special_sidebar_control');
function i123_widgets_special_sidebar_control() {
    global $i123_widgets_sidebars_to_hide, $i123_widgets_sidebars_to_alter, $i123_widgets_is_special, $i123_widgets_my_id, $i123_widgets_help_text;
    global $wp_registered_sidebars, $wp_registered_widgets, $sidebars_widgets;
    if ($i123_widgets_is_special) {
        $i123_widgets_original_id = $_GET['i123_widgets_s'];
        $i123_widgets_on_page = $_GET['i123_widgets_p'];
        $i123_widgets_my_id = 'i123_widgets_' . $i123_widgets_original_id . '_' . $i123_widgets_on_page;
        $i123_widgets_my_items = array();
        $i123_widgets_my_settings = array(
                'name' => __('Special widget area.', 'i123_widgets'),
                'description' => sprintf(__('Special widget area.', 'i123_widgets')),
                'before_widget' => '',
                'after_widget' => '',
                'before_title' => '',
                'after_title' => ''
            );
        /* A failed attempt to clone the existing widget area content
         * Why is this difficult?
         * -Because widgets have id's and stuff that cannot be duplicated by simply copying the widget.
         *
        $i123_widgets_sidebar_exists = false;
        foreach($sidebars_widgets as $key => $value) {
            switch ($key) {
                case $i123_widgets_my_id:
                    $i123_widgets_my_items = $value;
                    $i123_widgets_sidebar_exists = true;
                    break;
                case $i123_widgets_original_id:
                    if (!$i123_widgets_sidebar_exists) $i123_widgets_my_items = $value;
            }
        }

        foreach ($i123_widgets_my_items as $key => $value) {
            if (isset($wp_registered_widgets[$value])) {
                $new_widget_id = 'i123_widgets_' . $value;
                $wp_registered_widgets[$new_widget_id] = $wp_registered_widgets[$value];
                $wp_registered_widgets[$new_widget_id]['id'] = $new_widget_id;
                $i123_widgets_my_items[$key] = $new_widget_id;
            }
        }
        print_r($wp_registered_widgets);
        $sidebars_widgets[$i123_widgets_my_id] = $i123_widgets_my_items;
        print_r($sidebars_widgets);
         */

        $i123_widgets_sidebar_exists = false;
        foreach($wp_registered_sidebars as $key => $value) {
            switch ($key) {
                case $i123_widgets_my_id:
                    $i123_widgets_my_settings = $value;
                    $i123_widgets_sidebar_exists = true;
                    break;
                case $i123_widgets_original_id:
                    if (!$i123_widgets_sidebar_exists) $i123_widgets_my_settings = $value;
                default:
                    $i123_widgets_sidebars_to_hide[$key] = $key;
            }
        }
        $i123_widgets_my_settings['description'] = sprintf(__('%s... On "%s"', 'i123_widgets'), $i123_widgets_my_settings['description'], get_the_title($i123_widgets_on_page));
        if (!$i123_widgets_sidebar_exists) {
            $i123_widgets_my_settings['id'] = $i123_widgets_my_id;
            register_sidebar($i123_widgets_my_settings);
        }
        $i123_widgets_help_text = sprintf(__('You are currently editing the widget area "%s" on "%s". When your are done, close this "overlay" by clicking the small cross in the corner to return to editing the post / page.', 'i123_widgets'), $i123_widgets_my_settings['name'], get_the_title($i123_widgets_on_page));
    }
    //Get an array of all the special widget areas that are not currently being edited.
    //They will have descriptions changed or be hidden altogether in the
    //i123_widgets_alter_widget_editor function
    foreach($sidebars_widgets as $key => $value) {
        if ((!$i123_widgets_is_special)||($i123_widgets_my_id!=$key)) {
            if (preg_match('/^i123_widgets_(.+)_([0-9]{1,})$/', $key, $matches)) {
                if (isset($wp_registered_sidebars[$matches[1]])) {
                    $i123_widgets_my_settings['description'] = sprintf(__('%s... On "%s"', 'i123_widgets'), $wp_registered_sidebars[$matches[1]]['description'], get_the_title($matches[2]));
                    $i123_widgets_my_settings['name'] = sprintf(__('%s... On "%s"', 'i123_widgets'), $wp_registered_sidebars[$matches[1]]['name'], get_the_title($matches[2]));
                    $i123_widgets_sidebars_to_alter[$key] = array('title' => $i123_widgets_my_settings['name'], 'description' => $i123_widgets_my_settings['description']);
                }
            }
        }
    }
}

add_action( 'sidebar_admin_page', 'i123_widgets_alter_widget_editor');
function i123_widgets_alter_widget_editor() {
    global $i123_widgets_sidebars_to_alter, $i123_widgets_sidebars_to_hide, $i123_widgets_is_special, $i123_widgets_my_id, $i123_widgets_help_text;
    $style = array();
    $script = array();
    $script[] = '<script type="text/javascript">';
    $script[] = '(function($){';
    $script[] = '$(document).ready(function(){';
    if (($i123_widgets_is_special)||(isset($_GET['i123_widgets_iframe']))) {
        $style[] = '<style>';
        $style[] = '#adminmenuwrap,#footer,#adminmenuback,#wpadminbar,#screen-meta-links,.update-nag{display:none;}';
        $style[] = '#wpcontent,body.admin-bar #wpcontent{margin-left:0;padding-top:0;}';
        $style[] = '</style>';
        echo implode("\n", $style);
    }
    if ($i123_widgets_is_special) {
        $script[] = 'elm_parent = $("#' . $i123_widgets_my_id . '").parents(".widgets-holder-wrap").removeClass(\'closed\');';
        $script[] = '$("#wpbody-content .wrap h2").after("<p><strong>' . esc_js($i123_widgets_help_text) . '</strong></p>");';
    }

    foreach ($i123_widgets_sidebars_to_hide as $sidebar_id => $sidebar_texts) {
        $script[] = 'elm_to_hide = $("#' . $sidebar_id . '").parents(".widgets-holder-wrap");';
        $script[] = 'if (elm_to_hide.length==1){';
        $script[] = 'elm_to_hide.css({\'display\':\'none\'});';
        $script[] = '}';
    }
    foreach ($i123_widgets_sidebars_to_alter as $sidebar_id => $sidebar_texts) {
        $script[] = 'elm_parent = $("#' . $sidebar_id . '").parents(".widgets-holder-wrap");';
        $script[] = 'if (elm_parent.length==1){';
        if (i123_widgets_HIDE_INACTIVE) {
            $script[] = 'elm_parent.css({\'display\':\'none\'});';
        } else {
            $script[] = 'elm_description = $("#' . $sidebar_id . '").find(".description");';
            $script[] = 'elm_title = elm_parent.find(".sidebar-name h3");';
            $script[] = 'if (elm_description.length==1){';
                $script[] = 'elm_description.html("' . esc_js($sidebar_texts['description']) . '");';
            $script[] = '}';
            $script[] = 'if (elm_title.length==1){';
                $script[] = 'temp = elm_title.children();';
                $script[] = 'elm_title.html("' . esc_js($sidebar_texts['title']) . '");';
                $script[] = 'elm_title.append(temp);';
            $script[] = '}';
        }
        $script[] = '}';
    }
    $script[] = '});';
    $script[] = '})(jQuery)';
    $script[] = '</script>';
    echo implode("\n", $script);
}




/*******************************************************************************
 * Custom post fields
 ******************************************************************************/
add_action( 'add_meta_boxes', 'i123_widgets_custom_fields_add' );
add_action('save_post', 'i123_widgets_custom_fields_save', 1, 2);

function i123_widgets_custom_fields_add() {
    i123_widgets_admin_init();
    add_meta_box( 'i123_widgets_custom_fields', __('Per Page Widgets', 'i123_widgets'), 'i123_widgets_custom_fields_controllbox', 'post', 'side', 'high' );
    add_meta_box( 'i123_widgets_custom_fields', __('Per Page Widgets', 'i123_widgets'), 'i123_widgets_custom_fields_controllbox', 'page', 'side', 'high' );
}

function i123_widgets_admin_init() {
    global $i123_widgets_url;
    $styleurl = $i123_widgets_url . 'styles/admin.css';
    wp_enqueue_style('i123_widgets_admincss', $styleurl, array());
    $scripturl = $i123_widgets_url . 'scripts/admin.js';
    wp_enqueue_script('i123_widgets_adminjs', $scripturl, array('jquery'));
}

function i123_widgets_custom_fields_controllbox() {
    global $post, $i123_widgets_path, $i123_widgets_upload_dir, $wp_registered_sidebars;
    $values = get_post_custom( $post->ID );
    wp_nonce_field( 'my_i123_widgets_custom_fields_nonce', 'i123_widgets_custom_fields_nonce' );

    $i123_widgets_setting_overall = (isset($values['_i123_widgets_setting_overall'][0])) ? $values['_i123_widgets_setting_overall'][0] : '0';

    echo '<p><a href="widgets.php?i123_widgets_iframe=yes&KeepThis=true&TB_iframe=true&height=200&width=200" class="thickbox sidebareditlink" id="i123_widgets_show_sidebar_default_edit" title="' . esc_attr(__('Edit default widgets on all pages.', 'i123_widgets')) . '">' . __('Edit default widgets on all pages.', 'i123_widgets') . '</a></p>';

    echo '<p>' . __('Choose which widget areas to show.', 'i123_widgets') . '</p>';
    echo '<select name="i123_widgets_overall_setting" id="i123_widgets_overall_setting">';
    echo '<option value="0"' . (($i123_widgets_setting_overall=='0') ? ' selected="selected"' : '') . '>' . __('Standard', 'i123_widgets') . '</option>';
    echo '<option value="1"' . (($i123_widgets_setting_overall=='1') ? ' selected="selected"' : '') . '>' . __('Speciel', 'i123_widgets') . '</option>';
    echo '</select>';
    echo '<div id="i123_widgets_special_settings">';
    foreach($wp_registered_sidebars as $key => $value) {
        $i123_widgets_show_this = (isset($values['_i123_widgets_show_sidebar_' . $value['id']][0])) ? $values['_i123_widgets_show_sidebar_' . $value['id']][0] : '1';
        ?>
        <div class="i123_widgets_formline">
            <label for="i123_widgets_show_sidebar_<?php echo $value['id'] ?>"><?php echo $value['name'] ?></label>
            <div class="i123_widgets_formlineleftside">
                <input type="radio" id="i123_widgets_show_sidebar_<?php echo $value['id'] ?>-1" name="i123_widgets_show_sidebar_<?php echo $value['id'] ?>" class="i123_widgets_checkbox" value="1"<?php if($i123_widgets_show_this=='1') echo ' checked="checked"'; ?> />
                <label for="i123_widgets_show_sidebar_<?php echo $value['id'] ?>-1" class="i123_widgets_checkfield_description"><?php echo __('Show', 'i123_widgets') ?></label>
                <input type="radio" id="i123_widgets_show_sidebar_<?php echo $value['id'] ?>-0" name="i123_widgets_show_sidebar_<?php echo $value['id'] ?>" class="i123_widgets_checkbox" value="0"<?php if($i123_widgets_show_this=='0') echo ' checked="checked"'; ?> />
                <label for="i123_widgets_show_sidebar_<?php echo $value['id'] ?>-0" class="i123_widgets_checkfield_description"><?php echo __('Hide', 'i123_widgets') ?></label>
                <input type="radio" id="i123_widgets_show_sidebar_<?php echo $value['id'] ?>-2" name="i123_widgets_show_sidebar_<?php echo $value['id'] ?>" class="i123_widgets_checkbox" value="2"<?php if($i123_widgets_show_this=='2') echo ' checked="checked"'; ?> />
                <label for="i123_widgets_show_sidebar_<?php echo $value['id'] ?>-2" class="i123_widgets_checkfield_description"><?php echo __('Special', 'i123_widgets') ?><br />
                    <a href="widgets.php?i123_widgets_p=<?php echo $post->ID ?>&i123_widgets_s=<?php echo $value['id'] ?>&KeepThis=true&TB_iframe=true&height=200&width=200" class="thickbox sidebareditlink" id="i123_widgets_show_sidebar_<?php echo $value['id'] ?>_edit" title="<?php echo esc_attr(sprintf(__('Edit widgets in the sidebar "%s" on "%s"', 'i123_widgets'), $value['name'], $post->post_title)) ?>"><?php echo __('Edit widgets', 'i123_widgets') ?></a></label>
            </div>
        </div>
        <?php
    }
    echo '</div>';
}
function i123_widgets_custom_fields_save( $post_id, $post ) {
    global $i123_widgets_upload_dir, $wp_registered_sidebars;
    if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if( !isset( $_POST['i123_widgets_custom_fields_nonce'] ) || !wp_verify_nonce( $_POST['i123_widgets_custom_fields_nonce'], 'my_i123_widgets_custom_fields_nonce' ) ) return;
    if( !current_user_can( 'edit_post' ) ) return;

    $i123_widgets_setting_overall = (isset($_POST['i123_widgets_overall_setting'])&&is_numeric($_POST['i123_widgets_overall_setting'])) ? intval($_POST['i123_widgets_overall_setting']) : 0;
    update_post_meta( $post_id, '_i123_widgets_setting_overall', $i123_widgets_setting_overall );

    foreach($wp_registered_sidebars as $key => $value) {
        $i123_widgets_show_sidebar = (isset($_POST['i123_widgets_show_sidebar_' . $value['id']])&&is_numeric($_POST['i123_widgets_show_sidebar_' . $value['id']])) ? intval($_POST['i123_widgets_show_sidebar_' . $value['id']]) : 1;
        update_post_meta( $post_id, '_i123_widgets_show_sidebar_' . $value['id'], $i123_widgets_show_sidebar );
    }
}
/*******************************************************************************
 * Custom post fields end
 ******************************************************************************/