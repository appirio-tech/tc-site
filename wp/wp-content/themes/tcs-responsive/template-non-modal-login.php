<?php
/*
Template Name: Non Modal Login
*/
?>
<?php

get_header ();

$values = get_post_custom ( $post->ID );

$userkey = get_option ( 'api_user_key' );
$siteURL = site_url ();
?>
<script type="text/javascript">
	var siteurl = "<?php bloginfo('siteurl');?>";
</script>

<div class="content">
<div id="main">
<?php

	if (have_posts ()) :
		the_post ();
		?>
	<!-- Start Overview Page-->
	<div class="pageTitleWrapper">
		<div class="pageTitle container">
			<h2 class="overviewPageTitle <?php echo str_replace(" ", "", get_the_title());?>PageTitle">
				<?php the_title();?>
			</h2>
		</div>
	</div>
	<article id="mainContent" class="splitLayout singleColumnPage">
		<div class="container">
			<div class="rightSplit  grid-1-1">
				<div class="mainStream postContent pageContent grid-1-1">

					<?php the_content();?>

					<?php /*
					<script type="text/javascript">
						$(document).ready(function() {
						if ($('.tcssoUsingJS').length > 0) {
						  var regCookie = app.isLoggedIn();
						  if (regCookie) window.location.replace("/");
						}
						});
					</script>
					*/ ?>

					<div id="login">
						<div class="content">
							<h2>Login Using An Existing Account</h2>
							<div id="socials">
								<a class="signin-facebook" href="javascript:;"><span class="animeButton shareFacebook"><span class="shareFacebookHover animeButtonHover"></span></span></a>
								<a class="signin-google" href="javascript:;"><span class="animeButton shareGoogle"><span class="shareGoogleHover animeButtonHover"></span></span></a>
								<a class="signin-twitter" href="javascript:;"><span class="animeButton shareTwitter"><span class="shareTwitterHover animeButtonHover"></span></span></a>
								<a class="signin-github" href="javascript:;"><span class="animeButton shareGithub"><span class="shareGithubHover animeButtonHover"></span></span></a>
								<p>
									Using an existing account is quick and easy.<br/>
									Select the account you would like to use and we'll do the rest for you.
								</p>
								<div class="clear"></div>
							</div>
							<!-- END .socials -->
							<h2>Login With A topcoder Account</h2>
							<div class="tc-login-form">
								<form class="login" id="loginForm">
									<p class="row">
										<label>Username</label>
										<input id="username" type="text" class="name" placeholder="Username"/>
										<span class="err1">Your username or password are incorrect.</span>
										<span class="err3">Please input your username.</span>
									</p>
									<p class="row">
										<label>Password</label>
										<input id="password" type="password" class="pwd" placeholder="Password"/>
										<span class="err4">Please input your password.</span>
									</p>
									<p class="row lSpace">
										<label><input type="checkbox"/> Remember me</label>
									</p>
									<p class="row lSpace btns">
										<a href="javascript:;" class="signin-db btn btnSubmit">Login</a>
										<a href="<?php echo get_page_link_by_slug('password-recovery'); ?>" target="_blank" class="forgotPwd">Forgot password?</a>
									</p>
									<p class="row lSpace">
										<span class="not-a-member">Not a member? <a href="javascript:;" class="btnRegister" >Sign Up Now!</a></span>
									</p>
								</form>
								<div class="register-text"></div>
								<div class="clear"></div>
							</div>
							<!-- END .form login -->
						</div>
					</div>
					<!-- END #login -->
					<?php endif; wp_reset_query();?>

					<!-- /.pageContent -->

				</div>
				<!-- /.mainStream -->

				<div class="clear"></div>
			</div>
			<!-- /.rightSplit -->
		</div>
	</article>
	<!-- /#mainContent -->
<?php get_footer(); ?>
