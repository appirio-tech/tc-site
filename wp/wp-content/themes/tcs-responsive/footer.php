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
<footer class="bottom-footer">
  <!-- Footer links -->
  <nav class="menu-item">
    <div class="menu-item-header show-small">OTHERS</div>
    <ul class="submenu">
      <li class="submenu-item"><a ng-click="$event.stopPropagation();" href="/sitemap" class="menu-link">SITEMAP</a></li>
      <li class="submenu-item"><a ng-click="$event.stopPropagation();" href="/about" class="menu-link">ABOUT US</a></li>
      <li class="submenu-item"><a ng-click="$event.stopPropagation();" href="/contact-us" class="menu-link">CONTACT US</a></li>
      <li class="submenu-item"><a ng-click="$event.stopPropagation();" href="http://help.topcoder.com" target="_blank" class="menu-link">HELP CENTER</a></li>
      <li class="submenu-item"><a ng-click="$event.stopPropagation();" href="http://topcoder.com/community/how-it-works/privacy-policy/" class="menu-link">PRIVACY POLICY</a></li>
      <li class="submenu-item"><a ng-click="$event.stopPropagation();" href="http://topcoder.com/community/how-it-works/terms/" class="menu-link">TERMS</a></li>
    </ul>
    <!-- Social links -->
  </nav>
  <div class="social-links">
    <p>Topcoder is also on</p><a href="https://www.facebook.com/topcoder" target="fbwindow" class="fb-link"></a><a href="http://www.twitter.com/topcoder" target="twwindow" class="twitter-link"></a><a href="https://www.linkedin.com/company/topcoder" target="liwindow" class="linkedin-link"></a><a href="https://plus.google.com/u/0/b/104268008777050019973/104268008777050019973/posts" target="gpwindow" class="google-link"></a>
  </div>
  <p class="copyright-notice">© 2016 Topcoder. All Rights Reserved</p>
</footer>
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

<!-- Start of topcoder Zendesk Widget script -->
<script>/*<![CDATA[*/window.zEmbed||function(e,t){var n,o,d,i,s,a=[],r=document.createElement("iframe");window.zEmbed=function(){a.push(arguments)},window.zE=window.zE||window.zEmbed,r.src="javascript:false",r.title="",r.role="presentation",(r.frameElement||r).style.cssText="display: none",d=document.getElementsByTagName("script"),d=d[d.length-1],d.parentNode.insertBefore(r,d),i=r.contentWindow,s=i.document;try{o=s}catch(c){n=document.domain,r.src='javascript:var d=document.open();d.domain="'+n+'";void(0);',o=s}o.open()._l=function(){var o=this.createElement("script");n&&(this.domain=n),o.id="js-iframe-async",o.src=e,this.t=+new Date,this.zendeskHost=t,this.zEQueue=a,this.body.appendChild(o)},o.write('<body onload="document._l();">'),o.close()}("https://assets.zendesk.com/embeddable_framework/main.js","topcoder.zendesk.com");
/*]]>*/</script>
<!-- End of topcoder Zendesk Widget script -->

<script>
(function() {
  var headerApp = angular.module('tc.header', [])
  headerApp.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from subdomains.  Notice the difference between * and **.
      'http://*.topcoder.com/**',
      'https://*.topcoder.com/**'
    ]);
  });
  headerApp.directive('ngHeaderBootstrap', function(){
    return {
      restrict: 'C',
      templateUrl: tcconfig.mainURL + '/mf/js/app/header/partials/header-nav.html',
      controller: function($scope, $timeout){
        $scope.vm = vm = {};
        $scope.main = {};
        $scope.main.menuVisible = false;
        vm.isAuth = false;

        if (app.isLoggedIn()) {
          vm.isAuth = true;
          app.getHandle(function(handle) {
            $.get(tcconfig.apiURL + '/users/' + handle, function(data) {
              var photoLink = data['photoLink'];
              if (photoLink) {
                if (photoLink.indexOf('//') == -1) {
                  photoLink = tcconfig.communityURL + data['photoLink']
                }
              } else {
                photoLink = tcconfig.communityURL + '/i/m/nophoto_login.gif';
              }
              
              var color = '';
              var ratings = data['ratingSummary'];
              if (ratings) {
                var maxRating = 0;
                for (var i = 0; i < ratings.length; i++) {
                  if (maxRating < ratings[i]['rating']) {
                    maxRating = ratings[i]['rating'];
                    color = ratings[i]['colorStyle'].split(": ")[1];
                  }
                }
              } else if (data['isPM'] == true) {
                color = '#FF9900';
              }
              
              $timeout(function() {
                vm.handleStyle = { color: color };
                vm.photoURL = photoLink;
              });
            });

            $timeout(function() {
              vm.userHandle = handle;
              vm.userMenu = [
                { 'href': '/my-dashboard', 'text': 'DASHBOARD', 'icon': '/mf/i/nav/dashboard.svg' },
                { 'href': '/members/' + handle, 'text': 'MY PROFILE', 'icon': '/mf/i/nav/profile.svg' },
                { 'href': 'https:' + tcconfig.communityURL + '/PactsMemberServlet?module=PaymentHistory&full_list=false', 'text': 'PAYMENTS', 'icon': '/mf/i/nav/wallet.svg' },
                { 'href': '/settings/profile', 'text': 'SETTINGS', 'icon': '/mf/i/nav/settings.svg' },
              ];
            });
          });
        }

        vm.menuHeaders = [ 'compete', 'learn', 'community' ];
        vm.menuLinks =
        {
          'compete': [
              { 'href':  "/challenges/design/active/?pageIndex=1", 'text': 'DESIGN CHALLENGES', 'icon': '/mf/i/nav/track-design.svg' },
              { 'href':  "/challenges/develop/active/?pageIndex=1", 'text': 'DEVELOPMENT CHALLENGES', 'icon': '/mf/i/nav/track-develop.svg' },
              { 'href':  "/challenges/data/active/?pageIndex=1", 'text': 'DATA SCIENCE CHALLENGES', 'icon': '/mf/i/nav/track-data.svg' },
              { 'href':  'https:' + tcconfig.arenaURL, 'text': 'COMPETITIVE PROGRAMMING', 'icon': '/mf/i/nav/track-cp.svg', 'target': '_blank' },
          ],
          'learn': [
              { 'href': '/getting-started/', 'text': 'GETTING STARTED', 'icon': '/mf/i/nav/rocket.svg' },
              { 'href': '/community/design/', 'text': 'DESIGN', 'icon': '/mf/i/nav/book-design.svg' },
              { 'href': '/community/development/', 'text': 'DEVELOPMENT', 'icon': '/mf/i/nav/book-develop.svg' },
              { 'href': '/community/data-science/', 'text': 'DATA SCIENCE', 'icon': '/mf/i/nav/book-data.svg' },
              { 'href': '/community/competitive%20programming/', 'text': 'COMPETITIVE PROGRAMMING', 'icon': '/mf/i/nav/book-cp.svg' },
          ],
          'community': [
              { 'href': '/community/members/', 'text': 'OVERVIEW', 'icon': '/mf/i/nav/members.svg' },
              { 'href': '/community/member-programs/', 'text': 'PROGRAMS', 'icon': '/mf/i/nav/programs.svg' },
              { 'href': 'https://' + tcconfig.forumsAppURL, 'text': 'FORUMS', 'icon': '/mf/i/nav/forums.svg' },
              { 'href': '/community/statistics/', 'text': 'STATISTICS', 'icon': '/mf/i/nav/statistics.svg' },
              { 'href': '/community/events/', 'text': 'EVENTS', 'icon': '/mf/i/nav/events.svg' },
              { 'href': '/blog/', 'text': 'BLOG', 'icon': '/mf/i/nav/blog.svg' }
          ]
        };

        vm.checkSubmit = function(ev) {
          if (ev.keyCode === 13)
            window.location.replace(tcconfig.mainURL + '/search/members/?q=' + window.encodeURIComponent(vm.searchTerm));
        }

        vm.isActive = function(href) {
          if (window.location.pathname == href)
            return true;
          return false;
        }

        vm.login = function() {
          window.location.href = "/login?next=" + encodeURIComponent(window.location.href);
        }

        vm.logout = function() {
          document.cookie = 'tcsso=; path=/; domain=.' + tcconfig.domain + '; expires=' + new Date(0).toUTCString();
          document.cookie = 'tcjwt=; path=/; domain=.' + tcconfig.domain + '; expires=' + new Date(0).toUTCString();
          main.menuVisible = vm.isAuth = false;
          window.location.href = '/logout';
        }
      }
    };
  });

  angular.bootstrap($('.ng-header-bootstrap'), ['tc.header']);
})();
</script>

</div>

</body>

</html>
