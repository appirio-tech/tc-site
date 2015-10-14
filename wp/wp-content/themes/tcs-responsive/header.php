<?php get_template_part('header-main'); ?>

</head>

<body>

<?php

$nav = array(
  'menu'       => 'Main Navigation',
  'container'  => '',
  'menu_class' => 'root',
  'items_wrap' => '%3$s',
  'walker'     => new nav_menu_walker ()
);

tc_setup_angular();
?>

<div id="wrapper" class="tcssoUsingJS">
<div class="ng-header-bootstrap"></div>
<!-- Bugfix: I-108496 hidden element needed for non-firefox browsers to detect cache-persist status of page, used for above code to display member details -->
<input type='hidden' id='cache-persist'>
  <!-- /#header -->
