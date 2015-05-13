<?php


require_once 'auth0/vendor/autoload.php';
require_once 'auth0/src/Auth0.php';
require_once 'auth0/vendor/adoy/oauth2/vendor/autoload.php';
require_once 'auth0/client/config.php';

use Auth0SDK\Auth0;

$auth0 = new Auth0(array(
    'domain'        => $auth0_cfg['domain'],
    'client_id'     => $auth0_cfg['client_id'],
    'client_secret' => $auth0_cfg['client_secret'],
    'redirect_uri'  => $auth0_cfg['redirect_uri']
));

$token = $auth0->getAccessToken();
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title><?php wp_title(' - ', true, 'right'); ?></title>
<meta name="description" content="">
<meta name="author" content="">

	<?php wp_head(); ?>
	<script type="text/javascript">
		var ajaxUrl = "<?php  bloginfo('wpurl')?>/wp-admin/admin-ajax.php";
	</script>
  </head>

<body>

<div id="wrapper">
		<nav class="sidebarNav mainNav onMobi <?php echo $user; ?>">
		 <ul class="root"><?php wp_nav_menu ( $nav );	?>
			 <li class="notLogged"><a href="javascript:;" class="actionLogin"><i></i>Log In</a></li>
			 <li class="notLogged"><a href="javascript:;"><i></i>REGISTER</a></li>
			 <li class="userLi isLogged">
				<div class="userInfo">
					<div class="userPic">
						<img src="<?php echo $photoLink;?>" alt="<?php echo $coder->handle; ?>">
					</div>
					<div class="userDetails">
						<a href="<?php bloginfo('wpurl');?>/member-profile/<?php echo $coder->handle;?>" style="color:<?php echo $coder->colorStyle->color;?>" class="coder"><?php echo $coder->handle;?></a>
						<p class="country"><?php echo $coder->country; ?></p>
						<a href="#" class="link">My Profile</a>
						<a href="#" class="link">My Dashboard </a>
            <a href="https://<?php echo auth0_URL();?>/logout?returnTo=http://beta.topcoder.com" class="link actionLogout">Log Out </a>
					</div>
				</div>
			</li>
		 </ul>
		</nav>
		<!-- /.sidebarNav -->
		<header id="navigation" class="<?php echo $user; ?>">
			<div class="container">
				<h1 class="logo">
					<a href="<?php bloginfo('wpurl');?>" title="<?php bloginfo('name'); ?>"></a>
				</h1>
				<nav id="mainNav" class="mainNav">

					<ul class="root">
						<?php wp_nav_menu ( $nav );	?>
						<li class="noReg"><a href="https://<?php echo auth0_URL();?>/logout?returnTo=http://somewhere" class="actionLogout">Log Out</a></li>
						<li class="onReg"><a href="javascript:;" class="actionLogin">Log In</a></li>
					</ul>
				</nav>
				<a href="javascript:;" class="onMobi noReg linkLogout actionLogout">Log Out</a>
				<a href="javascript:;" class="onMobi onReg linkLogin actionLogin">Log In</a>
				<span class="btnRegWrap onReg"><a href="javascript:;" class="btn btnRegister">Register</a> </span>
				<span class="btnAccWrap noReg"><a href="javascript:;" class="btn btnAlt btnMyAcc">
						My Account<i></i>
					</a></span>
				<div class="userWidget">
					<div class="details">
						<div class="userPic">
							<img alt="<?php echo $coder->handle; ?>" src="<?php echo $photoLink;?>">
						</div>
						<div class="userDetails">
							<?php echo get_handle($coder->handle); ?>
							<p class="country"><?php echo $coder->country; ?></p>
							<p class="lbl">Member Since:</p>
							<p class="val"><?php echo $memberSince[2] ?></p>
							<p class="lbl">Total Earnings :</p>
							<p class="val"><?php echo $memberEarning?></p>
						</div>
					</div>
					<div class="action">
						<a href="#">My Profile</a>
						<a href="#">My Dashboard </a>
						<a href="https://<?php echo auth0_URL();?>/logout?returnTo=http://somewhere" class="linkAlt actionLogout">Log Out</a>
					</div>
				</div>
				<!-- /.userWidget -->
			</div>
		</header>
		<!-- /#header -->
