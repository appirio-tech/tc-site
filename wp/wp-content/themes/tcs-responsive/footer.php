<?php

/**
 * @file
 * Copyright (C) 2015 TopCoder Inc., All Rights Reserved.
 * @author TCSASSEMBLER, ecnu_haozi
 * @version 1.2
 *
 * This footer page.
 *
 * Changed in 1.1
 * Add two modals 'filterSavedSuccess' and 'filterSavedFailed' to support "My filters" feature.
 *
 * Changed in 1.2 (topcoder new community site - Removal proxied API calls)
 * Removed twitter, blog, and about section
 */

?>
<footer id="footer">
  <div class="container">
    <div class="connected">
      <section class="social">
        <h4>Get Connected</h4>
        <ul>
          <li><a class="fb" href="<?php echo get_option('facebookURL'); ?>">FB</a></li>
          <li><a class="tw" href="<?php echo get_option('twitterURL'); ?>">TW</a></li>
          <li><a class="gp" href="<?php echo get_option('gPlusURL'); ?>">GP</a></li>
          <li><a class="in" href="<?php echo get_option('linkedInURL'); ?>">IN</a></li>
        </ul>
        <div class="clear"></div>
      </section>
      <section class="updates">
        <div class="row">
          <form id="emailForm" onsubmit="return newsletter_check(this)"
                name="FeedBlitz_9feab01d431311e39e69002590771423" style="display:block" method="POST"
                action="//www.feedblitz.com/f/f.fbz?AddNewUserDirect">
            <input type="email" class="email" name="EMAIL" placeholder="Your email address" maxlength="64"/>
            <input name="FEEDID" type="hidden" value="926643"/>
            <input name="PUBLISHER" type="hidden" value="34610190"/>
            <!-- <a onclick="FeedBlitz_9feab01d431311e39e69002590771423s(this.form);" class="btn">Submit</a> -->
            <input onclick="FeedBlitz_9feab01d431311e39e69002590771423s(this.form);" type="button"
                   class="btn btnSubmitFooter" value="Submit"/>
            <input type="hidden" name="na" value="s"/>
            <input type="hidden" name="nr" value="widget"/>
          </form>
          <script language="Javascript">function FeedBlitz_9feab01d431311e39e69002590771423i() {
              var x = document.getElementsByName('FeedBlitz_9feab01d431311e39e69002590771423');
              for (i = 0; i < x.length; i++) {
                x[i].EMAIL.style.display = 'block';
                x[i].action = '//www.feedblitz.com/f/f.fbz?AddNewUserDirect';
              }
            }
            function FeedBlitz_9feab01d431311e39e69002590771423s(v) {
              v.submit();
            }
            FeedBlitz_9feab01d431311e39e69002590771423i();</script>

        </div>
      </section>
    </div>
    <div class="copyright">
      <section>
        </br>
        © 2014 topcoder. All Rights Reserved.
        </br>
        <a href="/community/how-it-works/privacy-policy/" class="privacyStmtLink">Privacy Policy</a> | <a
          href="/community/how-it-works/terms/" class="legalDisclaimerLink">Terms</a>
      </section>
    </div>
    <div class="clear"></div>
  </div>
</footer>
<!-- /#footer -->
</div>
<!-- /.content -->
</div>
<!-- /#wrapper -->


<div id="bgModal"></div><!-- background modal -->
<div id="bgOverlapModal"></div><!-- background modal -->
<div id="bgLoadingModal"><span></span></div><!-- background loading -->
<div id="thanks" class="modal">
  <a href="javascript:;" class="closeBtn closeModal"></a>

  <div class="content">
    <h2>Thanks for joining!</h2>

    <p>We have sent you an email with activation instructions.<br/>If you do not receive that email within 1 hour,
      please email <a href="mailto:support@topcoder.com">support@topcoder.com</a>.</p>

    <div>
      <a href="javascript:;" class="btn closeModal redirectOnConfirm">Close</a>
    </div>
  </div>
</div><!-- END #thanks -->
<div id="registerSuccess" class="modal">
  <a href="javascript:;" class="btnClose closeModal"></a>
  <div class="content">
    <h2>Registered!</h2>
    <p class="success">Thank you for registering. You may now download the challenge files and participate in the challenge forums.</p>
    <p class="submitBtn">
      <a class="btn closeModalReg" href="javascript:;">OK</a>
    </p>
  </div>
</div><!-- END #registerSuccess -->
<div id="registerFailed" class="modal">
  <a href="javascript:;" class="btnClose closeModal"></a>
  <div class="content">
    <h2>Info</h2>
    <p class="failedMessage"></p>
    <p class="submitBtn">
      <a class="btn closeModal" href="javascript:;">OK</a>
    </p>
  </div>
</div><!-- END #registerFailed -->

<div id="showSubmission" class="modal">
    <a href="javascript:;" class="btnClose closePopupModal"></a>
    <div class="content">
       <img alt="" style="width:910px; height:850px">
    </div>
</div><!-- END #show submission -->

<div id="filterSavedSuccess" class="modal">
  <a href="javascript:;" class="btnClose closeModal"></a>
  <div class="content">
    <h2>Success</h2>
    <p class="success">Your filters have been saved and stored in the "My Filters" dropdown list.</p>
    <p class="submitBtn">
      <a class="btn closeModal" href="javascript:;">OK</a>
    </p>
  </div>
</div><!-- END #filterSavedSuccess -->

<div id="filterSavedFailed" class="modal">
  <a href="javascript:;" class="btnClose closeModal"></a>
  <div class="content">
    <h2>Info</h2>
    <p class="failedMessage"></p>
    <p class="submitBtn">
      <a class="btn closeModal" href="javascript:;">OK</a>
    </p>
  </div>
</div><!-- END #filterSavedFailed -->

<div id="designSubmissionCommentExample" class="modal">
  <a href="javascript:;" class="btnClose closeModal"></a>
  <div class="content">
    <h2>Comment Examples</h2>

    <strong>Example 1:</strong><br>
    The logo represents movement and "taking action" rather than being stagnant.
    The colors I chose signify power and give the brand a strong feel.<br><br>

    <strong>Example 2:</strong><br>
    This is a revised version of my previous submission. Changes include a new
    header graphic, new font choices for the pop-up box and new icons for the
    widget on the fourth page.<br><br>

    <strong>Example 3:</strong><br>
    This is my Round 2 submission. I have implemented all of the feedback you
    gave me after Round 1 and I hope you like the changes.<br><br>
  </div>
</div><!-- END #show submission -->

<div id="typeTooltip" class="tooltip hide">
  <div class="inner">
    <header></header>
    <div class="data">
      <p class="contestTy"></p>
    </div>
    <div class="arrow"></div>
  </div>
</div><!-- /.tooltip -->
<div id="winnerTooltip" class="tooltip hide">
  <div class="inner">
    <header></header>
    <div class="data">
      <div class="winnerInfo"></div>
    </div>
    <div class="arrow alt"></div>
  </div>
</div><!-- /.tooltip -->
<div id="badgeTooltip" class="tooltip hide">
  <div class="inner">
    <header></header>
    <div class="data">
      <p class="earnedOn"></p>
    </div>
    <div class="data">
      <p class="currentlyEarned"><span></span></p>
    </div>
    <div class="arrow"></div>
  </div>
</div><!-- /.tooltip -->
<?php wp_footer(); ?>
<script>
  window.prerenderReady = false;
  function getParameterByName(name, source) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(source || location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  function getHashParameterByName(name, source) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"),
    results = regex.exec(source || location.hash);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
</script>


<!-- START Marketo Code -->
<script type="text/javascript">
document.write(unescape("%3Cscript src='//munchkin.marketo.net/munchkin.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script>Munchkin.init('921-UOU-112', {"wsInfo":"jFRS"});</script>
<!-- END Marketo Code -->

<!-- START Google Retargeting Marketing Code -->
<script type="text/javascript">
adroll_adv_id = "LOUA2FVRTJDYZC2BMX72Z7";
adroll_pix_id = "4XU6H3BYL5EQBFHZM4DIUU";
(function () {
var oldonload = window.onload;
window.onload = function(){
   __adroll_loaded=true;
   var scr = document.createElement("script");
   var host = (("https:" == document.location.protocol) ? "https://s.adroll.com" : "http://a.adroll.com");
   scr.setAttribute('async', 'true');
   scr.type = "text/javascript";
   scr.src = host + "/j/roundtrip.js";
   ((document.getElementsByTagName('head') || [null])[0] ||
    document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
   if(oldonload){oldonload()}};
}());
</script>
<!-- END Google Retargeting Marketing Code -->


<!-- START Twitter Marketing Code -->
<script src="//platform.twitter.com/oct.js" type="text/javascript"></script>
<script type="text/javascript">
twttr.conversion.trackPid('l4r4k');
</script>
<noscript>
<img height="1" width="1" style="display:none;" alt="" src="https://analytics.twitter.com/i/adsct?txn_id=l4r4k&p_id=Twitter" />
<img height="1" width="1" style="display:none;" alt="" src="//t.co/i/adsct?txn_id=l4r4k&p_id=Twitter" />
</noscript>
<!-- END Twitter Marketing Code -->

<!-- START KISSmetrics -->
<script type="text/javascript">var _kmq = _kmq || [];
var _kmk = _kmk || 'aa23cd43c455ef33b6a0df3de81a79af9ea30f75';
function _kms(u){
  setTimeout(function(){
    var d = document, f = d.getElementsByTagName('script')[0],
    s = d.createElement('script');
    s.type = 'text/javascript'; s.async = true; s.src = u;
    f.parentNode.insertBefore(s, f);
  }, 1);
}
_kms('//i.kissmetrics.com/i.js');
_kms('//doug1izaerwt3.cloudfront.net/' + _kmk + '.1.js');
</script>
<!-- END KISSmetrics -->

</div>

</body>

</html>
