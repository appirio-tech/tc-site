<?php
/**
 * @file
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 * @author TCSASSEMBLER
 * @version 1.1
 *
 * This header-terms page.
 *
 * Changed in 1.1 (topcoder new community site - Removal proxied API calls)
 * Removed LC related constants
 */
function tc_header_terms_js() {
  global $termType;

  ?>
  <script type="text/javascript">
    var challengeId = "<?php echo get_query_var('contestID');?>";
    var role = "<?php echo get_query_var('role');?>";
    var termType = "<?php echo $termType; ?>";
    var termsOfUseID = "<?php echo get_query_var('termsOfUseID');?>";
    var challengeType = "<?php echo get_query_var('challenge-type'); ?>";
  </script>
<?php
}

add_action("wp_head", "tc_header_terms_js");

get_header();
