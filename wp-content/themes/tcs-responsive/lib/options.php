<?php

/**
 * Start of Theme Options Support
 */
function themeoptions_admin_menu() {
  add_theme_page ( "Theme Options", "Theme Options", 'edit_themes', basename ( __FILE__ ), 'themeoptions_page' );
}
add_action ( 'admin_menu', 'themeoptions_admin_menu' );
function themeoptions_page() {
  if ($_POST ['update_themeoptions'] == 'true') {
    themeoptions_update ();
  } // check options update
  // here's the main function that will generate our options page
  ?>

  <div class="wrap">
    <div id="icon-themes" class="icon32">
      <br />
    </div>
    <h2>TCS Theme Options</h2>

    <form method="POST" action="" enctype="multipart/form-data">
      <input type="hidden" name="update_themeoptions" value="true" />
      <h3>TopCoder API settings</h3>
      <table width="100%">
        <tr>
          <?php $field = 'forumPostPerPage'; ?>
          <td width="150"><label for="<?php echo $field; ?>">Forum post per page:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
      </table>
      <br />
      <h3>Blog</h3>
      <table width="100%">
        <tr>
          <?php $field = 'blog_page_title'; ?>
          <td width="150"><label for="<?php echo $field; ?>">Blog Page Title:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
        <tr>
          <?php $field = 'case_studies_per_page'; ?>
          <td width="150"><label for="<?php echo $field; ?>">Case studies post per page:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
      </table>
      <br />
      <h3>Social Media Links</h3>
      <table width="100%">
        <tr>
          <?php $field = 'facebookURL'; ?>
          <td width="150"><label for="<?php echo $field; ?>">Facebook URL:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
        <tr>
          <?php $field = 'twitterURL'; ?>
          <td><label for="<?php echo $field; ?>">Twitter URL:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
        <tr>
          <?php $field = 'linkedInURL'; ?>
          <td><label for="<?php echo $field; ?>">LinkedIn URL:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
        <tr>
          <?php $field = 'gPlusURL'; ?>
          <td><label for="<?php echo $field; ?>">Google Plus URL:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
      </table>
      <br />
      <h3>Twitter OAuth Tokens</h3>
      <table width="100%">
        <tr>
          <?php $field = 'twConsumerKey'; ?>
          <td width="150"><label for="<?php echo $field; ?>">Consumer key:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
        <tr>
          <?php $field = 'twConsumerSecret'; ?>
          <td><label for="<?php echo $field; ?>">Consumer secret:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
        <tr>
          <?php $field = 'twAccessToken'; ?>
          <td><label for="<?php echo $field; ?>">Access token:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
        <tr>
          <?php $field = 'twAccessTokenSecret'; ?>
          <td><label for="<?php echo $field; ?>">Access token secret:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
      </table>
      <br />

      <h3>Challenge Pages Configuration</h3>
      <table width="100%">
        <tr>
          <?php $field = 'tcoTooltipTitle'; ?>
          <td width="150"><label for="<?php echo $field; ?>">TCO Tooltip Title:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
        <tr>
          <?php $field = 'tcoTooltipMessage'; ?>
          <td><label for="<?php echo $field; ?>">TCO Tooltip Message:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
      </table>
      <br />

      <h3>JS/CSS Optimations</h3>
      <table width="100%">
        <tr>
          <?php $field = 'jsCssVersioning'; ?>
          <td width="150"><label for="<?php echo $field; ?>">JS/CSS Versioning:</label></td>
          <td>
            <input type="radio" name="<?php echo $field; ?>" value="1" <?php if (get_option($field) == 1): ?>checked="checked"<?php endif; ?> /> Yes
            <input type="radio" name="<?php echo $field; ?>" value="0" <?php if (get_option($field) != 1): ?>checked="checked"<?php endif; ?> /> No
          </td>
        </tr>
        <tr>
          <?php $field = 'jsCssCurrentVersion'; ?>
          <td><label for="<?php echo $field; ?>">Current Version:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo (strlen(trim(get_option($field))) == 0) ? date('Ymd') : get_option($field); ?>" /></td>
        </tr>
        <tr>
          <?php $field = 'jsCssUseCDN'; ?>
          <td width="150"><label for="<?php echo $field; ?>">Use CDN:</label></td>
          <td>
            <input type="radio" name="<?php echo $field; ?>" value="1" <?php if (get_option($field) == 1): ?>checked="checked"<?php endif; ?> /> Yes
            <input type="radio" name="<?php echo $field; ?>" value="0" <?php if (get_option($field) != 1): ?>checked="checked"<?php endif; ?> /> No
          </td>
        </tr>
        <tr>
          <?php $field = 'jsCssCDNBase'; ?>
          <td><label for="<?php echo $field; ?>">CDN Base URL:</label></td>
          <td><input type="text" id="<?php echo $field; ?>" name="<?php echo $field; ?>" size="100" value="<?php echo get_option($field); ?>" /></td>
        </tr>
        <tr>
          <?php $field = 'jsCssUseMin'; ?>
          <td width="150"><label for="<?php echo $field; ?>">Use Minifed JS/CSS:</label></td>
          <td>
            <input type="radio" name="<?php echo $field; ?>" value="1" <?php if (get_option($field) == 1): ?>checked="checked"<?php endif; ?> /> Yes
            <input type="radio" name="<?php echo $field; ?>" value="0" <?php if (get_option($field) != 1): ?>checked="checked"<?php endif; ?> /> No
          </td>
        </tr>
        <tr>
          <?php $field="jssCssReset"; ?>
          <td width="150"><label for="<?php $field; ?>">Reset JS/CSS Registry:</label></td>
          <td>
            <input type="radio" name="<?php echo $field; ?>" value="1" <?php if (get_option($field) == 1): ?>checked="checked"<?php endif; ?> /> Yes
            <input type="radio" name="<?php echo $field; ?>" value="0" <?php if (get_option($field) != 1): ?>checked="checked"<?php endif; ?> /> No
          </td>
        </tr>
      </table>
      <p>
        <input type="submit" name="submit" value="Update Options" class="button button-primary" />
      </p>
    </form>

  </div>
<?php
}

// Set default options
if (is_admin () && isset ( $_GET ['activated'] ) && $pagenow == 'themes.php') {

  // Other Options
  update_option ( 'forumPostPerPage', '3' );

  // Social Media
  update_option ( 'facebookURL', 'http://www.facebook.com/topcoder' );
  update_option ( 'twitterURL', 'http://www.twitter.com/topcoder' );
  update_option ( 'linkedInURL', 'http://www.youtube.com/topcoderinc' );
  update_option ( 'gPlusURL', 'https://plus.google.com/u/0/b/104268008777050019973/104268008777050019973/posts' );

  update_option ( 'tcoTooltipTitle', 'TCO-14' );
  update_option ( 'tcoTooltipMessage', 'Eligible for TCO14' );
}

// Update options function
function themeoptions_update() {
  // Other Options
  update_option ( 'case_studies_per_page', $_POST ['case_studies_per_page'] );
  update_option ( 'forumPostPerPage', $_POST ['forumPostPerPage'] );

  // blog
  update_option ( 'blog_page_title', $_POST ['blog_page_title'] );

  // Social Media
  update_option ( 'facebookURL', $_POST ['facebookURL'] );
  update_option ( 'twitterURL', $_POST ['twitterURL'] );
  update_option ( 'linkedInURL', $_POST ['linkedInURL'] );
  update_option ( 'gPlusURL', $_POST ['gPlusURL'] );

  // Twitter OAuth Tokens
  update_option ( 'twConsumerKey', $_POST ['twConsumerKey'] );
  update_option ( 'twConsumerSecret', $_POST ['twConsumerSecret'] );
  update_option ( 'twAccessToken', $_POST ['twAccessToken'] );
  update_option ( 'twAccessTokenSecret', $_POST ['twAccessTokenSecret'] );

  // Challenges Page
  update_option ( 'tcoTooltipTitle', $_POST ['tcoTooltipTitle'] );
  update_option ( 'tcoTooltipMessage', $_POST ['tcoTooltipMessage'] );

  // JS/CSS versioning - BUGR-10904
  update_option ( 'jsCssVersioning', $_POST['jsCssVersioning'] );
  update_option ( 'jsCssCurrentVersion', $_POST['jsCssCurrentVersion'] );

  update_option ( 'jsCssVersioning', $_POST['jsCssVersioning'] );
  update_option ( 'jsCssCurrentVersion', $_POST['jsCssCurrentVersion'] );

  update_option ( 'jsCssUseCDN', $_POST['jsCssUseCDN'] );
  update_option ( 'jsCssCDNBase', $_POST['jsCssCDNBase'] );

  update_option ( 'jsCssUseMin', $_POST['jsCssUseMin'] );

  if ($_POST['jssCssReset'] === "1") {
    delete_transient('tsc_get_asset_map');
  }

}
// END OF THEME OPTIONS SUPPORT