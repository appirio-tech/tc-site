<?php
/*
Template Name: Contact Us
*/
require_once('recaptchalib.php');
$privatekey = "6Le4KusSAAAAAHxH8ubhbNjT2r4oOYDYxS7bmhpS";
$resp = recaptcha_check_answer ($privatekey,
							$_SERVER["REMOTE_ADDR"],
							$_POST["recaptcha_challenge_field"],
							$_POST["recaptcha_response_field"]);

$msgCaptcha = $msgSuccess = "";
if ($resp->is_valid && isset($_POST["fn"]) ) {
	// send data, then show thanks message
	
	$msgSuccess = "<h4 style='color:green'> Thanks for contacting Us</h4>";
} else  if (!$resp->is_valid && isset($_POST["fn"])){
	$msgCaptcha = "<span style='color:red'> Wrong code, please try again</span>";
	
}
?>
<?php get_header(); ?>

        <div class="content contact">
            <div id="main">
                <?php if(have_posts()) : the_post();?>
                        <?php the_content();?>
                <?php endif; wp_reset_query();?>

                <article id="mainContent" class="splitLayout ">
                    <div class="container">
                        <div class="contactForm">
                            <!--<?php /*echo do_shortcode( '[contact-form-7 id="8" title="Contact form 1"]'); */?>-->
                            <?php
							if ( $msgSuccess == '' ):
							?>
							<form method="post" action="" id="contactForm">
                                <div class="row errormsg hide">
                                <p>Please enter valid details for highlighted field(s).</p>
                                </div>
                                <div class="row">
                                        <label for="fn">First Name</label>
                                        <div class="val">
                                                <input id="fn" name="fn" value="<?php echo $_POST[fn];?>" type="text" />
                                        </div>
                                </div>
                                <div class="row">
                                        <label for="ln">Last Name</label>
                                        <div class="val">
                                                <input id="ln" name="ln" value="<?php echo $_POST[ln];?>" type="text" />
                                        </div>
                                </div>
                                <div class="row">
                                        <label for="ea">Email Address</label>
                                        <div class="val">
                                                <input id="ea" name="ea" type="email" value="<?php echo $_POST[ea];?>" />
                                        </div>
                                </div>
                                <div class="row">
                                        <label for="desc">Description</label>
                                        <div class="val">
                                                <textarea id="desc" name="desc" class="textarea"><?php echo $_POST[desc];?></textarea>
                                        </div>
                                </div>
                                <div class="row rowCap">
                                        <label for="ca">Captcha <?php echo $msgCaptcha;?></label>
                                    <?php
                                        require_once("recaptchalib.php");
                                        $publickey = "6Le4KusSAAAAAIdEQTPwOIWQZRIWG4efzyuAbGr8";
                                        echo recaptcha_get_html($publickey);
                                    ?>
                                </div>
								
                                <div class="action">
                                        <a class="btn btnSubmit" href="javascript:;">Submit</a>
                                </div>
                            </form>
							<?php
							else:
							echo $msgSuccess;
							endif;
							?>
                        </div>
                        <!-- /.contactForm -->
                    </div>
                </article>
                <!-- /#mainContent -->

<?php get_footer(); ?>
