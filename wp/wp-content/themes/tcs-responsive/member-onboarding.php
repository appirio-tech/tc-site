<?php
/*
Template Name: Member Onboarding
*/
?>
<?php get_header(); ?>


        <div class="content">
            <div id="main" class="memberOnboardingView">
                <?php if(have_posts()) : the_post();?>
                        <?php the_content();?>
                <?php endif; wp_reset_query();?>
        	
            
     <div id="page">
 
    <ul id="filters">
        <?php
		 
			  $args         = array( 
				  'orderby'  => 'id',
				  'order'    => 'ASC'
			  );
            $terms = get_terms("member-onboarding-categories", $args);
            $count = count($terms);
			
                //echo '<li><a href="javascript:void(0)" title="" data-filter=".all" class="active">All</a></li>';
            if ( $count > 0 ){
 
                foreach ( $terms as $term ) {
 
                    $termname = strtolower($term->name);
                    $termname = str_replace(' ', '-', $termname);
                    echo '<li><a href="#box-'.$termname.'" title="" class="mk-smooth" >'.$term->name.'</a></li>';
                }
            }
        ?>
    </ul>
 
    <div id="portfolio">
 	<div class="onboarding-body">
    <div class="container">
    
    <?php
	/*
	 * Loop through Categories and Display Posts within
	 */
	$post_type = 'member-onboarding';
	 
	// Get all the taxonomies for this post type
	$taxonomies = get_object_taxonomies( array( 'post_type' => $post_type) );
	 
	foreach( $taxonomies as $taxonomy ) :
	 	 $args         = array( 
				  'orderby'  => 'id',
				  'order'    => 'ASC'
		);
		// Gets every "category" (term) in this taxonomy to get the respective posts
		$terms = get_terms( $taxonomy, $args);
	 
		foreach( $terms as $term ) : ?>
	 	  <?php
		   $termname = strtolower($term->name);
           $termname = str_replace(' ', '-', $termname);
		  ?> 
          <?php echo '<div id="box-'. $termname .'" class="box-member-onboarding">' ?> 
		  <?php echo '<h1>'.  $term->name .'</h1>' ?>
          <?php /*?><?php echo '<h2>'.  $term->description .'</h2>' ?> <?php */?>
	 
			<?php
			$args = array(
					'post_type' => $post_type,
					'posts_per_page' => -1,  //show all posts
					'order'    => 'ASC',
					'tax_query' => array(
						array(
							'taxonomy' => $taxonomy,
							'field' => 'slug',
							'terms' => $term->slug
						)
					)
	 
				);
			$posts = new WP_Query($args);
	 
			if( $posts->have_posts() ): while( $posts->have_posts() ) : $posts->the_post(); ?>
	   
                        
                        <div class="flip-container" ontouchstart="this.classList.toggle('hover');">
                            <div class="flipper">
                                <div class="front">
                                    <span class="name">
                                    <?php echo get_the_title(); ?>
                                    </span>
                                </div>
                                <div class="back"> 
                                    <span class="excerpt">
                                    <?php 
									$excerpts = get_post_meta($post->ID, 'excerpt', false); ?> 
									<?php foreach($excerpts as $excerpt) {
                                        echo $excerpt;
                                        }
									?>
                                    </span>
                                    <a href="<?php echo get_the_permalink(); ?>" class="read-more">Read More</a>
                                </div>
                            </div>
                        </div>
                       
                       <?php 
					    
						
					   
					    //echo '<div class="all onboarding-item '. $tax .'">';
						//echo '<a class="onboarding-item '. $termname .'" href="';
//						
//						echo get_the_permalink();
//						echo '">';
						//echo '<a href="'. the_permalink() .'" title="'. the_title_attribute() .'">';
						//echo '<span class="thumbnail">';
						?>
                        
                        <?php /*?><?php if(has_post_thumbnail()) { ?>
								<?php the_post_thumbnail(); ?>
						<?php }<?php */?> 
						<?php /*?>else { ?>
							   <img src="<?php bloginfo('template_url'); ?>/assets/img/default-img.png" alt="<?php echo get_the_title(); ?>" title="<?php echo get_the_title(); ?>" width="110" height="110" />
						<?php } ?><?php */?>
                        
						<?php /*?><?php  
						echo '<span class="info">';
						echo '<span class="title">'; 
						echo get_the_title(); 
						echo '</span>'; 
						echo '<span class="excerpt">';    
						$excerpts = get_post_meta($post->ID, 'excerpt', false); ?> 
                            <?php foreach($excerpts as $excerpt) {
                                echo $excerpt;
                                }
						echo '</span>';  
						echo '</span>';
						echo '</a>';
						 
					   ?><?php */?>
                       
                       
	  
					   
	 
			<?php endwhile; endif; ?>
         
         <?php echo '</div>'; ?>
	 
		<?php endforeach;
	 
	endforeach; ?>
    
    <?php
	    
       /*$args = array( 'post_type' => 'member-onboarding', 'posts_per_page' => -1 );
       $loop = new WP_Query( $args );
         while ( $loop->have_posts() ) : $loop->the_post(); 
 
       $terms = get_the_terms( $post->ID, 'member-onboarding-categories' );						
            if ( $terms && ! is_wp_error( $terms ) ) : 
 
                $links = array();
 
                foreach ( $terms as $term ) {
                    $links[] = $term->name;
                }
 
                $tax_links = join( " ", str_replace(' ', '-', $links));          
                $tax = strtolower($tax_links);
            else :	
	        $tax = '';					
            endif; 
 
        //echo '<div class="all onboarding-item '. $tax .'">';
		echo '<a class="all onboarding-item '. $tax .'" href="';
		echo the_permalink();
		echo '">';
        //echo '<a href="'. the_permalink() .'" title="'. the_title_attribute() .'">';
        echo '<span class="thumbnail">';
		echo the_post_thumbnail();
		echo '</span>';
        echo '<span class="info">';
		echo '<span class="title">';
		echo the_title();
		echo '</span>';
		echo '</span>';
		echo '</a>';
        
        //echo '<div>'. the_excerpt() .'</div>';
        //echo '</div>'; 
      endwhile;*/ ?>
   </div>
   </div>
   </div><!-- #portfolio -->
 
 <div class="onboarding-footer">
   		<div class="container">
        
        
        
   		<h2>What can you do with Topcoder today?</h2>
   		<div class="col-left">
        	<h3>What will you create?</h3>
            <h4>Jump into a competition now!</h4>
            <ul class="footer-buttons">
            	<li><a href="https://www.topcoder.com/challenges/design/active/"><span></span><p>Design</p></a></li>
                <li><a href="https://www.topcoder.com/challenges/develop/active/"><span></span><p>Development</p></a></li>
                <li><a href="https://www.topcoder.com/challenges/data/active/"><span></span><p>Data Science</p></a></li>
                <li class="last"><a href="https://arena.topcoder.com/"><span></span><p>Competitive Programming</p></a></li>
            </ul>
            <!--<a data-rel="lightbox" class="btn-play" href="https://www.youtube.com/watch?v=_ncY-jYlTjY?autoplay=1">GETTING STARTED</a>-->
            
        </div>
        
        <div class="col-right">
        	<h3>What will you learn?</h3>
            <h4>Learn more and practice now!</h4>
            <a href="https://www.topcoder.com/community/member-programs/topcoder-fun-challenges/" class="btn btnBlue">LEARN MORE</a>
        </div>
        </div>
   </div>
 
  </div><!-- #page -->

<?php get_footer(); ?>


