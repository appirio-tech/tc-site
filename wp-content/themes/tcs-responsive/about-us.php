<?php
/*
Template Name: About Us
*/
?>
<?php get_header(); ?>


        <div class="content pageView">
            <div id="main">
                <?php if(have_posts()) : the_post();?>
                        <?php the_content();?>
                <?php endif; wp_reset_query();?>

<?php get_footer(); ?>
