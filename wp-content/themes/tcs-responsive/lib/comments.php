<?php

/* comments */
function mytheme_comment($comment, $args, $depth) {
  $GLOBALS ['comment'] = $comment;
  extract($args, EXTR_SKIP);
  if ('div' == $args ['style']) {
    $tag = 'div';
    $add_below = 'comment';
  }
  else {
    $tag = 'li';
    $add_below = 'div-comment';
  }
  ?>
  <<?php echo $tag ?> <?php comment_class(empty($args['has_children']) ? '' : 'parent') ?> id="comment-<?php comment_ID(
  ) ?>">
  <?php if ('div' != $args['style']) : ?>
    <div id="div-comment-<?php comment_ID() ?>" class="comment-body">
  <?php endif; ?>
  <div class="comment-author vcard">
    <?php if ($args['avatar_size'] != 0) {
      echo get_avatar($comment, 90);
    } ?>

  </div>
  <div class="commentText">
    <span class="arrow"></span>

    <div class="userRow">
      <a href="<?php get_comment_author_url(); ?>">
        <?php echo get_comment_author_link(); ?>
      </a>
            <span class="commentTime"> <?php printf(__('%1$s '), get_comment_date('F j, Y')) ?>
            </span>
      <?php
      if ($comment->comment_parent) {
        $parent_comment = get_comment($comment->comment_parent);
        echo 'to <a href="' . get_comment_author_url() . '" >' . $parent_comment->comment_author . '</a>';
      }
      ?>
    </div>
    <?php if ($comment->comment_approved == '0') : ?>
      <em class="comment-awaiting-moderation"><?php _e('Your comment is awaiting moderation.') ?> </em>
    <?php endif; ?>
    <div class="commentData">
      <?php comment_text(); ?>
    </div>
    <!-- /.commentBody -->
    <div class="actionRow">
      <?php if (get_edit_comment_link(__('Edit'), '  ', '') != ""): ?>
        <span class="comment-meta commentmetadata"> <?php edit_comment_link(__('Edit'), '  ', ''); ?>
        </span>
      <?php endif; ?>
      <span class="reply"> <?php comment_reply_link(
          array_merge($args, array('add_below' => $add_below, 'depth' => $depth, 'max_depth' => $args['max_depth']))
        ) ?>
      </span>
    </div>
  </div>
  <?php if ('div' != $args['style']) : ?>
    </div>


  <?php endif;
}