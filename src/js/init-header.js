//Opera hack to run .ready() on each page load including on history navigation
history.navigationMode = 'compatible';
if (!tcconfig) { var tcconfig = @@tcconfig }
$(document).ready(function() {

  function showModal(selector) {
    var modal = $(selector);
    $('#bgModal').show();
    modal.show();
    centerModal();
  };

  function centerModal(selector) {
    var modal = $('.modal:visible');
    if ($(window).width() >= 1003 || $('html').is('.ie6, .ie7, .ie8'))
      modal.css('margin', -modal.height() / 2 + 'px 0 0 ' + (-modal.width() / 2) + 'px');
    else {
      modal.css('margin', '0');
    }
  }

  // Initialize member details
    /* 
          Bugfix I-108496: Unable to login using IE10 browser
          pageshow does not work in IE, and will always trigger in Chrome with event.persisted=false, pageshow & event.persisted is a Firefox only feature
          So we must check the browser userAgent for firefox to avoid inconsistent behaviour between browsers
    */
if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    $(window).bind('pageshow', function(event) {
    //originalEvent.persisted is always FALSE in Chrome, so we need extra variable check
        if (!event.originalEvent.persisted) {
            initMemberDetails(false);
        } else {
            initMemberDetails(true);
        }
    });
} else {
    //if not Firefox, we check for value of a hidden input, if there is none page is not cached, we then set a value and on history navigation that value is retained and we know page is cached
    //this part also has to be hidden from firefox, because once you set value on input with js that value is retained even with page refresh, hence the reason we still need to use pageshow method above for firefox
    if ($('#cache-persist').val()) {
        initMemberDetails(true);
    } else {
        initMemberDetails(false);
    //set hidden input value, when page is re-navigated via history buttons, this value will be saved and we can know page is cached
        $('#cache-persist').val('1');
    }
}
              
$('#login input').keyup(function(e) {
if (e.keyCode == 13) {
    $('#login a.btnSubmit').click();
}
});
if (!loginState) {
  // moved from main code
  var socialProviderId = "", socialUserName = "", socialEmail = "", socialProvider = "";
  var utmSource = '', utmMedium = '', utmCampaign = '';
  var loginState = '';
  var regSource = '';
  $(function () {
    regSource = getParameterByName('regSource') || getHashParameterByName('regSource')
      || getParameterByName('reg_source') || getHashParameterByName('reg_source')
      || $.cookie('regSource');
    utmSource = getParameterByName('utmSource') || getHashParameterByName('utmSource')
      || getParameterByName('utm_source') || getHashParameterByName('utm_source')
      || $.cookie('utmSource');
    utmMedium = getParameterByName('utmMedium') || getHashParameterByName('utmMedium')
      || getParameterByName('utm_medium') || getHashParameterByName('utm_medium')
      || $.cookie('utmMedium');
    utmCampaign = getParameterByName('utmCampaign') || getHashParameterByName('utmCampaign')
      || getParameterByName('utm_campaign') || getHashParameterByName('utm_campaign')
      || $.cookie('utmCampaign');

    if (utmSource || utmMedium || utmCampaign) {
      $.cookie('utmSource', utmSource, { expires: 365, path: '/' });
      $.cookie('utmMedium', utmMedium, { expires: 365, path: '/' });
      $.cookie('utmCampaign', utmCampaign, { expires: 365, path: '/' });
    }

    var stateString = getHashParameterByName('state');
    if (stateString.length > 0) {
      var cType = getParameterByName('type', stateString);
      if (cType.length > 0) {
        challengeType = cType;
      }
    }
    var googleProvider = "google-oauth2";
    var facebookProvider = "facebook";
    var twitterProvider = "twitter";
    var githubProvider = "github";
    
    loginState = "none";

    var referer =  document.referrer;

    if (loginState == 'none') {
      loginState = window.location.href;

      // redirect for non-modal registration
      if ( $('#mainContent #register').length>0 ) {
          loginState = '/community/registration-complete/';
      }

      // set to home page for non modal login
      if ( $('#mainContent #login').length>0 ) {
          if ( referer=='' || referer==loginState) {
              loginState = '/';
          } else {
              loginState = referer;
          }
      }

      if ( /action=showlogin/i.test( loginState )) {
        loginState = referer;
      }

      if ( /action=showlogin/i.test( referer ) ) {
        // few user tested to access directly "?action=showlogin", by this by, loginState would be its own self (contain 'showlogin')
        // avoid loop if 1st login try was failed. failed login will still redirect user to action=showlogin
        loginState = window.location.href;
      }

      if ( /action=logout/i.test( location.href ) ) {
        document.cookie = 'tcsso=; path=/; domain=.' + tcconfig.domain + '; expires=' + new Date(0).toUTCString();
        document.cookie = 'tcjwt=; path=/; domain=.' + tcconfig.domain + '; expires=' + new Date(0).toUTCString();

        var match;
        if ( match = /next=([\w\.\:\/\-]+)/i.exec( location.href ) ) {
          location.href = siteURL + '/?action=showlogin&next=' + match[1];
        }
      }

      // Override call back with next param if it exist
      var nextLoc = getParameterByName('next');
      if (nextLoc) {
       loginState = nextLoc;
      }
    }

    var auth0Conf = {
      domain: tcconfig.auth0URL,
      clientID: tcconfig.auth0ClientID,
      callbackURL: tcconfig.auth0CallbackURL,
      state: loginState,
      redirect_uri: loginState
    }
    
    var auth0Login = new Auth0(auth0Conf);
    var auth0Register = new Auth0(auth0Conf);

    auth0Register.getProfile(window.location.hash, function (err, profile, id_token, access_token, state) {
      socialProvider = profile.identities[0].connection;
      var firstName = "" , lastName = "", handle = "", email = "";
      if(socialProvider === googleProvider) {
        firstName = profile.given_name;
        lastName = profile.family_name;
        handle = profile.nickname;
        email = profile.email;
        socialProviderId = 2;
      } else if (socialProvider === facebookProvider) {
        firstName = profile.given_name;
        lastName = profile.family_name;
        handle = firstName + '.' + lastName;
        email = profile.email;
        socialProviderId = 1;
      } else if (socialProvider === twitterProvider) {
        var splitName = profile.name.split(" ");
        firstName = splitName[0];
        if (splitName.length > 1) {
          lastName = splitName[1];
        }
        handle = profile.screen_name;
        socialProviderId = 3;
      } else if (socialProvider === githubProvider) {
        firstName = lastName = '';
        handle = profile.nickname;
        email = profile.email;
        socialProviderId = 4;
      }
      var user = profile.user_id.substring(profile.user_id.indexOf('|')+1);
      $.ajax({
        type: 'GET',
        data: {
          provider: socialProviderId,
          user: user,
          action: 'get_social_validity'
        },
        dataType: 'json',
        url: ajaxUrl,
        success: function(data) {
          console.log(data);
          if (!data.error && !(typeof data.available == 'undefined') && !data.available) {
            resetRegisterFields();
            $('.row .socialUnavailableErrorMessage').show();
            $('#register .err1,.err2,.err3,.err4,.err5,.err6,.err7,.err8,span.valid').hide();
            $('#register input.invalid').removeClass('invalid');
            $('#register a.btnSubmit').removeClass('socialRegister');
            socialProviderId = undefined;
          }
        }
      }).fail(function() {
        console.log('fail');
      });

      socialUserName = handle;
      socialUserId = profile.user_id.split('|')[1];
      socialEmail = profile.email;
      $("#registerForm .firstName").val(firstName);
      $("#registerForm .lastName").val(lastName);
      $("#registerForm .handle").val(handle);
      $("#registerForm .email").val(email);

      // trigger validation
      $('input.pwd:password').trigger('keyup');
      $('#register form.register input.email:text').trigger('keyup');
      $('#register form.register input.name:text').trigger('keyup');
      $('#register form.register input.handle:text').trigger('keyup');
      $('#register form.register input.handle:text').trigger('blur');
      $('#register form.register input:checkbox').trigger('change');

    // Issue ID: I-111588 - Trigger the change event on select so the validation can be performed
    $('#register form.register #selCountry').trigger('change');
      $('#register input:password').on('keyup');
      $('select').on('change');

  }, function(err) {
    console.log('error');
    console.log(err);
  });

    $('.register-google').on('click', function () {
      auth0Register.login({
        connection: googleProvider,
        state: loginState,
        response_type: 'token'});
    });

    $('.register-facebook').on('click', function () {
      auth0Register.login({connection: facebookProvider,
        state: loginState,
        response_type: 'token'});
    });

    $('.register-twitter').on('click', function () {
      auth0Register.login({connection: twitterProvider,
        state: loginState,
        response_type: 'token'});
    });

    $('.register-github').on('click', function () {
      auth0Register.login({connection: githubProvider,
        state: loginState,
        response_type: 'token'});
    });

    $('.signin-google').on('click', function () {
      auth0Login.login({
        connection: 'google-oauth2',
        state: loginState});
    });

    $('.signin-facebook').on('click', function () {
      auth0Login.login({connection: 'facebook',
        state: loginState});
    });

    $('.signin-twitter').on('click', function () {
      auth0Login.login({connection: 'twitter',
        state: loginState});
    });

    $('.signin-github').on('click', function () {
      auth0Login.login({connection: 'github',
        state: loginState});
    });

    $('.signin-etc').on('click', function () {
      auth0Login.login({connection: 'connection-name',
        state: loginState});
    });

    $('.signin-db').on('click', function () {
      var empty = false;
      if ($('#username').val().trim() == '') {
        empty = true;
        $('#loginForm span.err3').show();
        $('#username').addClass('invalid');
      }
      if ($('#password').val().trim() == '') {
        empty = true;
        $('#loginForm span.err4').show();
        $('#password').addClass('invalid');
      }
      if (empty) return;
      if ($('#rememberMe').prop('checked')) {
        // Set a session cookie to mark that user selected "Remember Me"
        $.cookie('rememberMe', true, {expires: 365, path: '/', domain: '.' + tcconfig.domain});
      }
      auth0Login.login({
          connection: 'LDAP',
          state: loginState,
          username: document.getElementById('username').value,
          password: document.getElementById('password').value
        },
        function (err) {
          // invalid user/password
          //alert(err);
          $('#loginForm .btnSubmit').html('Login');
          $('#loginForm .err1').show().html('Incorrect Username or Password.')
            .addClass('invalid');
          $('#password').val('');
          $.removeCookie('rememberMe');
        });
    });
  });
}
});

function initMemberDetails(pagePersisted){
    if ($('.tcssoUsingJS').length > 0) {
      var regCookie = app.isLoggedIn();
        if (regCookie && pagePersisted === false) {
        $('.actionLogout').attr('href', 'javascript:;');
        $('.loginLink, .linkLogin, .btnRegister, .signUp a.btn').addClass('hide').hide();
        $('.btnRegister').parent('.sign-up').hide();
        $('*[data-signup-only]').hide();
        $('.logoutLink, .linkLogout, .userDetailsWrapper').removeClass('hide').show();
        $('.headerTopRightMenuLink.logIn a').unbind('click');
        $('.headerTopRightMenuLink.logIn a').text("Log Out").removeClass("actionLogin").addClass("actionLogout");
        app.getHandle(function(handle) {
          $('.userDetails .coder').text(handle);
          $.get(ajaxUrl, {
            "action": "get_member_profile",
            "handle": handle
          }, function(data) {
            var photoLink = data['photoLink'];
            if (photoLink) {
              if (photoLink.indexOf('//') == -1) {
                photoLink = tcconfig.communityURL + data['photoLink']
              }
            } else {
              photoLink = tcconfig.communityURL + '/i/m/nophoto_login.gif';
            }
            $('.userPic img').attr('src',  photoLink);
            $('.userDetails .coder').attr('href', $('.userDetails .coder').attr('href') + handle);
            $('.userDetails .link').attr('href', $('.userDetails .link').attr('href') + handle);
            $('.action .profileLink').attr('href', $('.action .profileLink').attr('href') + handle);
            var color = '';
            if (data['ratingsSummary']) {
              var maxRating = 0;
              for (var i = 0; i < data['ratingsSummary'].length; i++) {
                if (maxRating < data['ratingsSummary'][i]['rating']) {
                  maxRating = data['ratingsSummary'][i]['rating'];
                  color = data['ratingsSummary'][i]['colorStyle'].split(": ")[1];
                }
              }
            } else if (data['isPM'] == true) {
              color = '#FF9900';
            }
            $('.userDetails .coder').attr('style', 'color: ' + color);
            var userPofileUrl = wpUrl + '/member-profile/' + handle;
            $('.userDetails').prepend('<a class="tc_coder coder" href="' + userPofileUrl + '" style="color:' + color + '">' + handle + '</a>');
            $('.myProfileLink, .profileLink').attr('href', userPofileUrl);
            $('.userDetails .country').text(data['country']);
            //additional check that data exists so incorrect member join date does not appear
            if (typeof data['memberSince'] !== "undefined") {
                $('.userDetails .memberSince').text(dateformat(data['memberSince'].substring(0, 10)));
            } else {
                $('.userDetails .memberSince').prev().hide();
                $('.userDetails .memberSince').text("");
            }

            if (data['overallEarning']) {
                $('.userDetails .memberEarning').text("$" + data['overallEarning']);
            } else {
                //hide Total Earnings title if not displaying any earnings
                $('.userDetails .memberEarning').prev().hide();
                $('.userDetails .memberEarning').text("");
            }
          }, 'json').fail(function() {
              //Bugfix: If AJAX call fails, we should hide "Member Since" and "Overall Earnings" fields, since they will be empty
              $('.userDetails .memberSince').prev().hide();
              $('.userDetails .memberSince').text("");
              $('.userDetails .memberEarning').prev().hide();
              $('.userDetails .memberEarning').text("");
          });
          $('#navigation, .sidebarNav').removeClass('newUser');
        });

        // Clear local tcsso cookie on logout
        $('.logoutLink, .actionLogout').click(function() {
          document.cookie = 'tcsso=; path=/; domain=.' + tcconfig.domain + '; expires=' + new Date(0).toUTCString();
          document.cookie = 'tcjwt=; path=/; domain=.' + tcconfig.domain + '; expires=' + new Date(0).toUTCString();
          // check if we have the weird facebook hash
          // if so, redirect to root
          if (window.location.hash == '#_=_') {
            location.href = '';
          } else {
            location.reload();
          }
        });
      } else if (!app.isLoggedIn() && $('.actionLogout').length > 1) {
        $('.headerTopRightMenuLink.logIn a').unbind('click');
        $('.headerTopRightMenuLink.logIn a').text("Log In").removeClass("actionLogout").addClass("actionLogin");
        $('.actionLogin').on('click', function() {
          document.getElementById("loginForm").reset();
          $('#loginForm .btnSubmit').html('Login');
          $(".pwd, .confirm, .strength").parents(".row").show();
          $("#register a.btnSubmit").removeClass("socialRegister");
          showModal('#login');
        });
        $('.loginLink, .linkLogin, .btnRegister, .signUp a.btn').addClass('show').show();
        $('.btnRegister').parent('.sign-up').show();
        $('*[data-signup-only]').show();
        $('.logoutLink, .linkLogout, .userDetailsWrapper').removeClass('show').hide();

      } else {
        $('.headerTopRightMenu .actionLogin').show();
      }

    } else {
      $('.headerTopRightMenu .actionLogin').show();
    }
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = $.trim(ca[i]);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

function dateformat(dt) {
    //Bugfix I-109397: Safari 5 on Windows does not recognize dates formated with dashes in JS Date() object, so must replace with slashes
    var myDate = new Date(dt.replace(/-/g, "/"));
  if (isNaN(myDate)) {
    return "";
  }

  var month = new Array();
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "May";
  month[5] = "Jun";
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";
  var hours = myDate.getHours();
  var minutes = myDate.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ampm;
  //"13 Jan 2012 11:00am";
  return month[myDate.getMonth()] + " " + myDate.getDate() + ", " + myDate.getFullYear();

}
