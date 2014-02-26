<script type="text/javascript">
	/*var url = "<?php bloginfo( 'stylesheet_directory' ); ?>/data/forum.json";*/
	var postPerPage=<?php echo get_option('forumPostPerPage'); ?>;
	/*$(document).ready(function(){
		app.forum.populate(url);
		});*/
</script>

<?php 
$forum_posts = get_forum_posts();
$forum_items = $forum_posts->channel->item;
$nr_of_forum_posts = count($forum_items);
$postPerPage = get_option('forumPostPerPage');
?>
<article class="forumPosts">
	<div class="container">
		<h2>
			Recent Forum Posts <small>(<?php echo $nr_of_forum_posts; ?> posts)</small>
		</h2>
		<div class="forumList">
			<?php 
			for ($i = 0; $i < $nr_of_forum_posts/5; $i++) :
			?>
			<div class="page page<?php echo $i+1; ?> <?php if($i > 0) { echo 'hide'; } ?>">
				<?php for ($j = $i*5; $j < $i*5+5 && $j < $nr_of_forum_posts; $j++) : ?>
				<div class="post postDesign">
					<a href="#" class="thumb"></a>
					<div class="head">
						<a href="<?php echo $forum_items[$j]->link; ?>" class="postTitle"><?php echo $forum_items[$j]->title; ?></a>
						<span class="postedBy">Last Post by: <a href="#" class="postAuthor">Mahestro</a></span>
					</div>
					<div class="postBody"><?php echo wrap_content_strip_html(($forum_items[$j]->description), 120, true,'\n\r',''); ?></div>
	
					<div class="postInfo">
						<div class="row">
							<a href="#" class="postCat"><?php echo $forum_items[$j]->category; ?></a>
							<span class="sep"></span><span class="postedAt"><?php echo $forum_items[$j]->pubDate; ?></span>
						</div>
						<div class="row">
							<span class="info"><em>8</em> Threads</span><span class="sep"></span><span class="info"><em>24</em> Messages</span>
						</div>
					</div>
				</div>
				<!-- /.post -->
				<?php endfor; ?>
			</div>
			<?php endfor; ?>   
		</div>
		<!-- /.forumList -->
		<div class="dataChanges">			
			<div class="rt pager">
				<?php 
				if ($nr_of_forum_posts > 0) :
				?>
				<a href="#" class="prevLink hide">
					<i></i> Prev
				</a>
				<?php endif; ?>
				<?php 
				for ($i = 0; $i < $nr_of_forum_posts/5; $i++) :
				?>
				<a href="#" class="<?php if($i == 0) { echo 'isActive'; } ?> pageLink">
					<?php echo $i+1; ?>
				</a>
				<?php endfor; ?>
				<?php 
				if ($nr_of_forum_posts > 0) :
				?>
				<a href="javascript:;" class="nextLink">
					Next <i></i>
				</a>
				<?php endif; ?>
			</div>
			<div class="mid onMobi">
				<a href="#" class="viewPastCh">
					View Past Challenges<i></i>
				</a>
			</div>
		</div>
		<!-- /.dataChanges -->
	</div>
</article>
