<?php
/**
 * Template Name: Challenge Submit Template
 */
$challengeType = 'develop';
get_header('challenge-submit');
$contest = get_contest_detail('', get_query_var('contestID'), $challengeType);
?>
  <div class="content">
    <div id="main" class="registerForChallenge submitForChallenge develop">
      <article id="mainContent">
        <div class="container submitContainer">
            <span class="competitionType develop"></span>
            <!-- /#end competition type-->
            <a href='<?php echo get_bloginfo("siteurl"); ?>/challenge-details/<?php echo $contestID; ?>/?type=develop' class="back">Back to Active Challenge</a>
            <h2 class="pageTitle"><?php echo $contest->challengeName; ?></h2>
            <!-- /#end page title-->
            <form action="http://studio.topcoder.com/" method="POST" name="submitForm" enctype="multipart/form-data" id="submitForm" autocomplete="off">
                <section class="formSection browseFile">
                    <h3>SUBMISSION UPLOAD</h3>

                    <div class="leftCol col">
                        <dl class="group fileField linkRow jqtransformdone" style="z-index: 985;">
                            <dt>Submission File (*.zip)</dt>
                            <dd>
                                <p class="fileNameDisplay fileNameDisplayNoFile">All Visible Files (visible to challenge
                                    holder</p>
                                <a class="btn fileBrowser btnGreen" href="javascript:;">Browse</a>
                                <span class="error">Please upload a submission first</span>
                                <input id="submission" data-type="zip" type="file" onchange="browseFileTrigger(this)" name="submission"
                                       class="fileInput">
                            </dd>
                        </dl>
                    </div>
                    <div class="rightCol col">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud </p>
                    </div>
                    <div class="clear"></div>
                </section>
                <section class="agreement notAgreed">
                    <input id="agree" type="checkbox"/>
                    <label>by clicking this box lorem ipsum dolor sit amet consecteter adispicing elit Lorem ipsum dolor
                        sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                        qui officia deserunt mollit anim id est laborum</label>
                    <a href="javascript:" id="submit" class="btn">Submit</a>
                </section>
                <!-- #/end agreement section-->
                <section class="uploadContent">
                    <h3>Uploading Submission</h3>

                    <p>Please don’t close the browser until the file is uploaded</p>

                    <div class="uploadBar">
                        <div class="loader"></div>
                        <div class="percentage">0%</div>
                    </div>
                    <!-- #/end uploadBar-->
                    <div class="buttonBar">
                        <a href="javascript:" id="cancelUpload" class="btn btnGreen">Cancel</a>
                    </div>
                    <!-- #/end buttonBar-->
                </section>
                <!-- #/end upload section-->
            </form>

            <div class="mask"></div>
        </div>
        <div class="container successContainer hide">
            <span class="competitionType develop"></span>
            <!-- /#end competition type-->
            <a href='<?php echo get_bloginfo("siteurl"); ?>/challenge-details/<?php echo $contestID; ?>/?type=develop' class="back">Back to Active Challenge</a>
            <h2 class="pageTitle"><?php echo $contest->challengeName; ?></h2>
            <!-- /#end page title-->
            <!-- /#end success content-->
            <section class="viewSubmission">
                <h2>Submission successfully uploaded</h2>
                <p>Lorem ipsum dolor sit amet consecteter adispicing elit Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
            </section>
            <!-- /#end view submission-->
            <section class="submissionTable">
                <div class="submissions">
                    <a href="javascript:" class="file"></a>
                    <a href="javascript:" class="delete">.</a>
                </div>
            </section>
            <!-- /#end submission table-->

        </div>
    </article>
    </div>
  </div>
  <!-- /#mainContent -->
<?php get_footer(); ?>