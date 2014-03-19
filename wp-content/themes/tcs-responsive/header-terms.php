<?php

get_header();

?>
<script type="text/javascript">
  var challengeId = "<?php echo get_query_var('contestID');?>";
  var role = "<?php echo get_query_var('role');?>";
  var termType = "<?php echo $termType; ?>";
  var termsOfUseID = "<?php echo get_query_var('termsOfUseID');?>";
</script>
</head>

<body>