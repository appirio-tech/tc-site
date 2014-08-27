<?php 
get_header();
get_footer(); 
?>
<script>
var loc = getParameterByName('dest') || '/';
top.window.location = loc;
</script>