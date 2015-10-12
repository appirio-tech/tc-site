<?php
function theme_comments( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment; ?>
	<li <?php comment_class(); ?> id="li-comment-<?php comment_ID() ?>">
		<div class="mk-single-comment" id="comment-<?php comment_ID(); ?>">
			<?php /*<div class="gravatar"><?php echo get_avatar( $comment, $size='45', $default='' ); ?></div> */ ?>
			<div class="comment-meta">
					<?php printf( '<span class="comment-author">%s</span>', get_comment_author_link() ) ?>
					
                    <?php edit_comment_link( '', '', '' ) ?>
			</div>
			<span class="comment-reply">
					<?php comment_reply_link( array_merge( $args, array( 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ) ?>
			</span>
			<div class="clearboth"></div>
			<div class="comment-content">
					<?php comment_text() ?>

<?php if ( $comment->comment_approved == '0' ) : ?>
					<span class="unapproved"><?php _e( 'Your comment is awaiting moderation.', 'mk_framework' );?></span>
<?php endif; ?>
				<time class="comment-time"><?php echo get_comment_date(); ?></time>
				<div class="clearboth"></div>
			</div>

		       
		</div>		
<?php
}

function list_pings( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment;
?>

<li <?php comment_class(); ?> id="li-comment-<?php comment_ID() ?>">
		<div id="comment-<?php comment_ID(); ?>" class="comment-wrap comments-pings">

			<div class="comment-content">

				<div class="comment-meta">

					<?php printf( '<span class="comment_author"><b>%s</b></span>', get_comment_author_link() ) ?>

				</div>
				<div class="comment-data">
					<?php comment_text() ?>

								<time class="comment-time"><?php echo get_comment_time('F jS, Y h:i A'); ?></time>
<?php if ( $comment->comment_approved == '0' ) : ?>
					<span class="unapproved">Your comment is awaiting moderation.</span>
<?php endif; ?>
				</div>
                <div class="clearboth"></div>
	</div>





<?php } ?>

<section id="comments">
<?php if ( post_password_required() ) : ?>
	<p class="nopassword"><?php _e( 'This post is password protected. Enter the password to view any comments.', 'mk_framework' );?></p>
</section><!-- #comments -->
<?php
return;
endif;

if ( have_comments() ) : ?>
	<div class="blog-comment-title"><?php printf( _n( 'Comments', 'Showing %1$s comments', get_comments_number(), 'mk_framework' ),
	number_format_i18n( get_comments_number() )); ?></div>
	<ul class="mk-commentlist">
		<?php
wp_list_comments( 'callback=theme_comments&type=comment' );
?>
	</ul>





<?php
if ( have_comments() ) : ?>
<?php if ( ! empty( $comments_by_type['pings'] ) ) : ?>
<div class="blog-comment-title"><?php _e( 'pingbacks / trackbacks', 'mk_framework' ); ?></div>

<ul class="mk-commentlist">
<?php wp_list_comments( 'callback=list_pings&type=pings' ); ?>
</ul>
<?php endif; endif; ?>

<?php else :
	if ( ! comments_open() ) :
		endif;
	endif;
?>

 <?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : ?>
	<nav class="comments-navigation">
		<div class="comments-previous"><?php previous_comments_link(); ?></div>
		<div class="comments-next"><?php next_comments_link(); ?></div>
	</nav>
<?php endif;?>



	<?php if ( comments_open() ) : ?>

	<?php
	
		$fields =  array(
			'author'=> '<div class="comment-form-name comment-form-row"><input type="text" name="author" class="text_input" id="author" tabindex="54" placeholder="'.__('Name (Required)', 'mk_framework').'"  /></div>',
			'email' => '<div class="comment-form-email comment-form-row"><input type="text" name="email" class="text_input" id="email" tabindex="56" placeholder="'.__('Email (Required)', 'mk_framework').'" /></div>',
			'url' 	=> '<div class="comment-form-website comment-form-row"><input type="text" name="url" class="text_input" id="url" tabindex="57" placeholder="'.__('Website', 'mk_framework').'" /></div>',
		);

		//Comment Form Args
        $comments_args = array(
			'fields' => $fields,
			'title_reply'=>'<div class="respond-heading">'.__('Leave a Comment', 'mk_framework').'</div>',
			'comment_field' => '<div class="comment-textarea"><textarea placeholder="'.__('LEAVE YOUR COMMENT', 'mk_framework').'" class="textarea" name="comment" rows="8" id="comment" tabindex="58"></textarea></div>',
			'comment_notes_before' => '',
			'comment_notes_after' => '',
			'label_submit' => __('Post a comment','mk_framework')
		);
		comment_form($comments_args); 
	?>

<?php endif; ?>


</section>
