<?php
/*
Template Name: Password Recovery
*/
get_header ();

$values 	= get_post_custom ( $post->ID );
$userkey 	= get_option ( 'api_user_key' );

$changePasswordPage = get_page_link_by_slug("password-reset");
$redirectDelay 		= get_option("tcPasswordRecoveryRedirectDelay")==null ? 3000 : get_option("tcPasswordRecoveryRedirectDelay");

$handle 	= $_POST["handle"];
$msg 		= null;
$redirect 	= false;
$tokenObj 	= null;
if(trim($handle)!='') {
	$response = generateResetToken($handle);
	$obj = json_decode($response['body']);
	
	if ($response['response']['code']== 200) {
		$tokenObj = $obj;
	} else {
		$msg = $obj->result->content;
	}
}

if($tokenObj!=null) {
	// COR-119: v3 format
	if ( isset($tokenObj->result->content->socialProfile) ) {
		$msg = 'It looks like you have a social account associated with your profile. You can login using your ' . $tokenObj->result->content->socialProfile->provider . ' account, or click <a href="/password-reset">here</a> to reset your password.';
	} else {
                $changePasswordLink = $changePasswordPage;
                $msg = "Sit tight! A confirmation code is on its way to your email.";
                $redirect = true;
	}
}
/**
 * Redirect to reset password page 
 */ 
	if($redirect) :
?>
    <script type="text/javascript">
		$(document).ready(
			function () {
				setTimeout(function() {
					window.location.href = '<?php echo $changePasswordLink;?>';
				}, <?php echo $redirectDelay;?>);
			}
		);
	</script>
<?php endif; ?>

<div class="content">
	<div id="main">

	<?php
	
	if (have_posts ()) :
		the_post ();
		$quote = get_post_meta ( $post->ID, "Quote", true );
		$qAuthor = get_post_meta ( $post->ID, "Quote author", true );
		?>
	<!-- Start Overview Page-->
		<div class="pageTitleWrapper">
			<div class="pageTitle container">
				<h2 class="overviewPageTitle"><?php the_title();?></h2>
			</div>
		</div>

		<article id="mainContent" class="splitLayout overviewPage">
			<div class="container">
				<div class="rightSplit  grid-3-3">
					<div class="mainStream grid-3-3">
						<section class="passwordRecovery" class="pageContent">
							<?php the_content();?>
							<?php 
								if($msg==null) :
							?>
								<form id="formResetPassword" class="formResetPassword" name="formResetPassword" action="" method="POST">
									<div class="row">
										<input type="text" class="handleOrEmail" maxlength="40" name="handle" placeholder="Enter your username or email" size="50" />
										<span class="err1 error" style="display: none;">Required field</span>
									</div>
									<div class="row">
										<input type="button" class="btnSubmit" value="Submit" />
									</div>
								</form>
                <br />
                <p>Or <a href="/password-reset">click here</a> if you already have a confirmation code.</p>
							<?php else : ?>
								<div class="msg">
									<div class="row">
										<h2><?php echo $msg;?></h2>
									</div>
									<div class="row">
										<a href="#" onclick="window.history.back();return false;" class="btn btnSubmit">Back</a>
									</div>
								</div>
							<?php endif; ?>							

						</section>
					<?php endif; wp_reset_query();?>
						<!-- /.pageContent -->

					</div>
					<!-- /.mainStream -->

					<!-- /.sideStream -->
					<div class="clear"></div>
				</div>
				<!-- /.rightSplit -->
			</div>
		</article>
		<!-- /#mainContent -->
<?php get_footer(); ?>
