/**
 * This code is copyright (c) 2015 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.1
 *
 * Changed in 1.1 (topcoder new community site - Removal proxied API calls)
 * Removed ajaxUrl with direct calls to APIs
 */
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
          loginState = tcconfig.mainURL + '/community/registration-complete/';
      }

      // set to home page for non modal login
      if ( $('#mainContent #login').length>0 ) {
          if ( referer=='' || referer==loginState) {
              loginState = tcconfig.mainURL;
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
    
    var auth0Login = new Auth0({
      domain: tcconfig.auth0URL,
      clientID: tcconfig.auth0ClientID,
      callbackURL: tcconfig.auth0CallbackURL,
      state: loginState,
      redirect_uri: loginState
    });

    var auth0Register = new Auth0({
      domain: tcconfig.auth0URL,
      clientID: tcconfig.auth0ClientID,
      callbackURL: tcconfig.mainURL + '?action=callback',
      state: loginState,
      redirect_uri: loginState
    });

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
        dataType: 'json',
        url: tcconfig.apiURL + '/users/validateSocial?socialProviderId=' + socialProviderId + '&socialUserId=' + user,
        success: function(data) {
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
          connection: tcconfig.auth0LDAP,
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

  $(window).on('resize', function () {
    centerModal();
  });


  $('#username').keyup(function() {
    $('#loginForm span.err3').hide();
    $('#loginForm span.err1').hide();
    $(this).removeClass('invalid');
  });

  $('#password').keyup(function() {
    $('#loginForm span.err1').hide();
    $('#loginForm span.err4').hide();
    $(this).removeClass('invalid');
  });

  $('.btnRegister').on('click', function () {
    window.location.href = "/register";

  });

  $('.actionLogin').on('click', function () {
    window.location.href = "/login?next=" + encodeURIComponent(window.location.href);
  });

  $('.closeModal,#bgModal').not('.redirectOnConfirm').on('click', function () {
    //window.location.replace('/');
    closeModal();
  });

  $('.redirectOnConfirm').on('click', function () {
    redirectToNext();
  });


  /* validation */

  function isValidEmailAddress(emailAddress) {
    // Issue ID: I-109386 - Change regular expression pattern for better validation on domain name (no space allowed)
    var pattern = new RegExp("(^[\\+_A-Za-z0-9-]+(\\.[\\+_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,}$))");
    return pattern.test(emailAddress);
  }


  function pwdStrength(pwd) {

    var result = 0;
    if ($.trim(pwd) == '') return 0;
    if (pwd.length < 7) return -2;
    if (pwd.length > 30) return -3;
    if (pwd.match("'")) return -4;

    if (pwd.match(/[a-z]/)) result++;
    if (pwd.match(/[A-Z]/)) result++;
    if (pwd.match(/\d/)) result++;
    if (pwd.match(/[\]\[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\\\^\_\`\{\|\}\~\-]/)) result++;

    return result;

  }

  $('#registerForm input.pwd:password').on('keyup', function () {
    var input = $(this);

    $(this).closest('.row').find('.err1,.err2,.err3,.err4,.err5').hide();
    $(this).removeClass('invalid');

    var strength = pwdStrength($(this).val());

    $(".strength .field").removeClass("red").removeClass("green");
    var classname = "red";
    $(this).closest('.row').find('span.err3').hide();
    $(this).closest('.row').find('span.err4').hide();
    if (strength >= 3) {
      classname = "green";
      $(this).parents(".row").find("span.valid").css("display", "inline-block");
    } else {
      $(this).parents(".row").find("span.valid").hide();
    }

    $(".strength .field").each(function (i, e) {
      if (i < strength) {
        $(e).addClass(classname);
      }
    });
    //Bugfix I-109383: Wrong parameter was used to detect empty values
    if (strength == 0) {
        if ($.trim(input.val()) === input.val()) {
            input.closest('.row').find('.err1').show();
        } else {
            input.closest('.row').find('.err5').show();
        }
      input.addClass('invalid');
    } else if (strength >= 0 && strength < 3) {
      input.closest('.row').find('.err2').show();
      input.addClass('invalid');
    } else if (strength == -4) {
      input.closest('.row').find('.err3').show();
      input.addClass('invalid');
    } else if (strength < -1) {
      input.closest('.row').find('.err4').show();
      input.addClass('invalid');
    }
  });

  $('#registerForm input.confirm:password').on('keyup', function () {
    var input = $(this);
    input.removeClass('invalid');
    input.closest('.row').find('.err1,.err2').hide();
    if (input.val() == "") {
        input.closest('.row').find('.err1').show();
      input.addClass('invalid');
    } else if (input.val() != $('#registerForm input.pwd:password').val()) {
      input.closest('.row').find('.err2').show();
      input.addClass('invalid');
    }
  });

  $('#register form.register input.email:text').on('keyup', function () {
    var email;
    if (isValidEmailAddress(email=$(this).val())) {
      $(this).parents(".row").find("span.valid").css("display", "inline-block");
      $(this).closest('.row').find('input:text').removeClass('invalid');
      $(this).closest('.row').find('span.err1').hide();
      $(this).closest('.row').find('span.err2').hide();
      $(this).closest('.row').find('span.err3').hide();
      $(this).parents(".row").find("span.valid").hide();
    } else {
      $(this).closest('.row').find('input:text').addClass('invalid');
      $(this).closest('.row').find('span.err1').hide();
      $(this).closest('.row').find('span.err2').hide();
      $(this).closest('.row').find('span.err3').hide();
      $(this).parents(".row").find("span.valid").hide();
      if (email.length==0)
        $(this).closest('.row').find('span.err1').show();
      else
        $(this).closest('.row').find('span.err2').show();
    }
  });

  $('#register form.register input.userAge:text').on('keyup', function () {
    $(this).closest('.row').find('span.err1').hide();
    $(this).closest('.row').find('span.err2').hide();
    $(this).closest('.row').find('span.err3').hide();
    $(this).closest('.row').find('span.err4').hide();
    $(this).closest('.row').find('input:text').removeClass('invalid');
    $(this).closest(".row").find("span.valid").hide();
    if ($(this).val().length == 0) {
      $(this).closest('.row').find('span.err1').show();
      $(this).closest('.row').find('input:text').addClass('invalid');
    } else if (!$(this).val().match(/^\d+$/)) {
      $(this).closest('.row').find('span.err2').show();
      $(this).closest('.row').find('input:text').addClass('invalid');
    } else if (parseInt($(this).val()) < 13) {
      //$(this).closest('.row').find('span.err3').show();
      //$(this).closest('.row').find('input:text').addClass('invalid');
      $(this).closest(".row").find("span.valid").css("display", "inline-block");
    } else if (parseInt($(this).val()) > 13800000000) {
      $(this).closest('.row').find('span.err4').show();
      $(this).closest('.row').find('input:text').addClass('invalid');
    } else {
      $(this).closest(".row").find("span.valid").css("display", "inline-block");
    }
  });

  $('#register form.register input.name.lastName:text').on('keyup', function () {
    var text = $(this).val();
    //clear all error messages
    $(this).closest('.row').find('span.err1').hide();
    $(this).closest('.row').find('span.err2').hide();
    $(this).closest('.row').find('span.err3').hide();
    $(this).closest('.row').find('span.err4').hide();
    $(this).closest('.row').find('span.err5').hide();
    $(this).closest('.row').find('input:text').removeClass('invalid');
    if (text.length > 64) {
      $(this).parents(".row").find("span.valid").hide();
      $(this).addClass('invalid');
      $(this).parents(".row").find("span.err2").show();

    } else if (text != '' && !text.match(/^[a-zA-Z0-9. \-_']+$/)) {
        //Bugfix I-107905: show error on entry of invalid characters
    //Bugfix I-251: allow apostrophe in last name
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).closest('.row').find('span.err3').show();
    } else if (text.match(/^[. \-_]+$/g)) {
        //show error if name consists of only valid punctuation
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).parents(".row").find("span.err4").show();
    } else if (text.match(/(\s|\.|_|\-)\1{1,}/)) {
        //show error if name contains 2 or more of same valid special char in a row
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).parents(".row").find("span.err5").show();
    }  else if (text.length == 0) {
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).closest('.row').find('span.err1').show();
    } else if (text != '') {
      $(this).parents(".row").find("span.valid").css("display", "inline-block");
      $(this).closest('.row').find('input:text').removeClass('invalid');
      $(this).closest('.row').find('span.err1').hide();
      $(this).closest('.row').find('span.err2').hide();
      $(this).closest('.row').find('span.err3').hide();
      $(this).closest('.row').find('span.err4').hide();
      $(this).closest('.row').find('span.err5').hide();
    } else {
      $(this).parents(".row").find("span.valid").hide();
    }
  });

  $('#register form.register input.name.lastName:text').on('blur', function () {
      var text = $(this).val();
      //remove leading and trailing spaces from name if any exist
      if (text.match(/^\s+|\s+$/g)) {
          $(this).val($.trim(text));
          text = $(this).val();
      }
      //remove instances of multiple spaces and other whitespace characters inside name string
      $(this).val(text.replace(/\s{2,}/g, ' '));
      //check if input is empty, display error if so
      if ($(this).val().length === 0) {
          $(this).parents(".row").find("span.valid").hide();
          $(this).addClass('invalid');
          $(this).closest('.row').find('span.err2').hide();
          $(this).closest('.row').find('span.err3').hide();
          $(this).closest('.row').find('span.err4').hide();
          $(this).closest('.row').find('span.err5').hide();
          $(this).closest('.row').find('span.err1').show();
      }
  });
  $('#register form.register input.name.firstName:text').on('keyup', function () {
    var text = $(this).val();
    //clear all error messages
    $(this).closest('.row').find('span.err1').hide();
    $(this).closest('.row').find('span.err2').hide();
    $(this).closest('.row').find('span.err3').hide();
    $(this).closest('.row').find('span.err4').hide();
    $(this).closest('.row').find('span.err5').hide();
    $(this).closest('.row').find('input:text').removeClass('invalid');
    if (text.length > 64) {
      $(this).parents(".row").find("span.valid").hide();
      $(this).addClass('invalid');
      $(this).parents(".row").find("span.err2").show();

    } else if (text != '' && !text.match(/^[a-zA-Z0-9. \-_]+$/)) {
        //Bugfix I-107905: show error on entry of invalid characters
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).closest('.row').find('span.err3').show();
    } else if (text.match(/^[. \-_]+$/g)) {
        //show error if name consists of only valid punctuation
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).parents(".row").find("span.err4").show();
    } else if (text.match(/(\s|\.|_|\-)\1{1,}/)) {
        //show error if name contains 2 or more of same valid special char in a row
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).parents(".row").find("span.err5").show();
    } else if (text.length == 0) {
        $(this).parents(".row").find("span.valid").hide();
        $(this).addClass('invalid');
        $(this).closest('.row').find('span.err1').show();
    } else if (text != '') {
      $(this).parents(".row").find("span.valid").css("display", "inline-block");
      $(this).closest('.row').find('input:text').removeClass('invalid');
      $(this).closest('.row').find('span.err1').hide();
      $(this).closest('.row').find('span.err2').hide();
      $(this).closest('.row').find('span.err3').hide();
      $(this).closest('.row').find('span.err4').hide();
      $(this).closest('.row').find('span.err5').hide();
    } else {
      $(this).parents(".row").find("span.valid").hide();
    }
  });
  $('#register form.register input.name.firstName:text').on('blur', function () {
      var text = $(this).val();
      //remove leading and trailing spaces from name if any exist
      if (text.match(/^\s+|\s+$/g)) {
          $(this).val($.trim(text));
          text = $(this).val();
      }
      //remove instances of multiple spaces and other whitespace characters inside name string
      $(this).val(text.replace(/\s{2,}/g, ' '));
      //check if input is empty, display error if so
      if ($(this).val().length === 0) {
          $(this).parents(".row").find("span.valid").hide();
          $(this).addClass('invalid');
          $(this).closest('.row').find('span.err2').hide();
          $(this).closest('.row').find('span.err3').hide();
          $(this).closest('.row').find('span.err4').hide();
          $(this).closest('.row').find('span.err5').hide();
          $(this).closest('.row').find('span.err1').show();
      }
  });

  $('#register form.register input.handle:text').on('keyup', function () {
    var invalid = false;
    handleChanged = true;
    $(this).parents(".row").find("span.valid").hide();
    $(this).closest('.row').find('span.err1').hide();
    $(this).closest('.row').find('span.err2').hide();
    $(this).closest('.row').find('span.err3').hide();
    $(this).closest('.row').find('span.err4').hide();
    $(this).closest('.row').find('span.err5').hide();
    $(this).closest('.row').find('span.err6').hide();
    $(this).closest('.row').find('span.err7').hide();
    var text = $(this).val();
    if (text.indexOf(' ') != -1) {
      // can't contain spaces
      $(this).closest('.row').find('span.err3').show();
      invalid = true;

    } else if (text.match(/^[\-\_\.\{\}\[\]]+$/)) {
      // can't consist solely of punctuation
      $(this).closest('.row').find('span.err4').show();
      invalid = true;

    } else if (!text.match(/^[\w\d\-\_\.\{\}\[\]]*$/)) {
      // must be all valid chars
      $(this).closest('.row').find('span.err5').show();
      invalid = true;
    } else if (text.toLowerCase().match(/^admin/)) {
      // can't start with 'admin'
      $(this).closest('.row').find('span.err6').show();
      invalid = true;
    } else if (text.length == 0) {
      $(this).closest('.row').find('span.err1').show();
      invalid = true;
    } else if (text.length == 1 || text.length > 15) {
      // must be between 2 and 15 chars long
      $(this).closest('.row').find('span.err7').show();
      invalid = true;
    }
    if (!invalid) {
      $('#register form.register input.handle:text').removeClass('invalid');
    } else {
      $('#register form.register input.handle:text').addClass('invalid');
    }
  });

  $('#register form.register input:checkbox').on('change', function () {
    if ($(this).prop('checked')) {
      $(this).parents(".row").find("span.valid").css("display", "inline-block");
      $(this).closest('.row').find('input:text').removeClass('invalid');
      $(this).closest('.row').find('span.err1').hide();
      $(this).closest('.row').find('span.err2').hide();
    } else {
      $(this).parents(".row").find("span.valid").hide();

    // Issue ID: I-111588 - Show invalid error message when checkbox is not checked
    $(this).closest('.row').find('.err1').show();
    $(this).addClass('invalid');
    }
  });

  $('#register input:password').on('keyup', function () {
    var pwd = $('#register form.register input.pwd:password');
    var confirm = $('#register form.register input.confirm:password');
    //bugfix empty value checking without using trim
    var strength = pwdStrength(pwd.val());
    if (pwd.val() == confirm.val() && pwd.val() != '' && strength>0 ) {
      confirm.parents(".row").find("span.valid").css("display", "inline-block");
      confirm.removeClass('invalid');
      confirm.parents(".row").find('span.err1').hide();
      confirm.parents(".row").find('span.err2').hide();
    } else {
      confirm.parents(".row").find("span.valid").hide();
    }
  });


  $('select').on('change', function () {
    if ($(this).val() != "") {
      $(this).parents(".row").find("span.valid").css("display", "inline-block");
      $(this).closest('.row').find('.err1').hide();
      $(this).closest('.row').find('.err2').hide();
      $(this).closest('.row').find('.customSelect').removeClass('invalid');
    } else {
      $(this).parents(".row").find("span.valid").hide();

      // Issue ID: I-111588 - Show invalid error message when value is empty after being changed
      $(this).closest('.row').find('.err1').show();
      $(this).closest('.row').find('.customSelect').addClass('invalid');
    }
  });

  var emailIsFree = false;
  var emailValidationAttempted = false;
  var emailDeferred = $.Deferred();
  function validateEmail() {
    if (!isValidEmailAddress($('#register form.register input.email:text').val())) return;
    emailValidationAttempted = true;
    var email = $('#register form.register input.email:text').val();
    email = email.replace('+', '%2B');

    var showInvalid = function() {
      emailIsFree = false;
      var node = $('#register form.register input.email:text');
      $('input.email').closest('p.row').find('.err3').show();
      $('input.email').closest('p.row').find('input:text').addClass('invalid');
      $('input.email').closest('p.row').find('span.valid').hide();
      emailDeferred.resolve();
    }

    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: tcconfig.apiURL + '/users/validateEmail?email=' + email + '&cb='+ Math.random(),
      success: function(data) {
        if (data.error || !data.available) {
          showInvalid();
        } else {
          emailIsFree = true;
          var node = $('#register form.register input.email:text');
          node.parents(".row").find("span.valid").css("display", "inline-block");
          node.closest('.row').find('input:text').removeClass('invalid');
          node.closest('.row').find('span.err1').hide();
          node.closest('.row').find('span.err2').hide();
          node.closest('.row').find('span.err3').hide();
          emailDeferred.resolve();
        }
      }
    }).fail(function() { showInvalid(); });
  }
  $('#register form.register input.email:text').blur(function() {
    validateEmail();
    emailDeferred = $.Deferred();
  });

  var handleIsFree = true;
  var handleValidationAttempted = false;
  var handleDeferred = $.Deferred();
  var handleChanged = false;
  function validateHandle() {
    handleChanged = false;
    handleValidationAttempted = true;
    var handle = $('#register form.register input.name.handle:text').val();

    var showInvalid = function() {
      handleIsFree = false;
      var node = $('#register form.register input.name.handle:text');
      $('input.handle').closest('.row').find('.err2').show();
      $('input.handle').closest('.row').find('input:text').addClass('invalid');
      $('input.handle').closest('.row').find('span.valid').hide();
      handleDeferred.resolve(); 
    }

    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: tcconfig.apiURL + '/users/validate/' + handle + '?cb='+ Math.random(),
      success: function(data) {
        if (handleChanged) return;
        if (data.error || !data.valid) {
          showInvalid();
        } else {
          handleIsFree = true;
          var node = $('#register form.register input.name.handle:text');
          node.parents(".row").find("span.valid").css("display", "inline-block");
          node.closest('.row').find('input:text').removeClass('invalid');
          node.closest('.row').find('span.err1').hide();
          node.closest('.row').find('span.err2').hide();
          handleDeferred.resolve();
        }
      }
    }).fail(function() {
        if (handleChanged) return;
        showInvalid();
    });
  }
  $('#register form.register input.name.handle:text').blur(function() {
    if ($(this).val()=='' || $('input.handle').closest('.row').find('.err3,.err4,.err5,.err6,.err7').is(':visible')) return;
    validateHandle();
    handleDeferred = $.Deferred();
  });

  $('select.applyCustomSelect').customSelect();

  $('#register a.btnSubmit').on('click', function () {
    var isValid = true;
    if ($('#register form.register input.name.handle:text').val() != '' && !handleValidationAttempted && !$('input.handle').closest('.row').find('.err3,.err4,.err5,.err6').is(':visible')) validateHandle();
    if (!emailValidationAttempted) validateEmail();

    var frm = $('#register form.register');
    var invalidExceptions = $('input.handle,input.email').closest('.row').find('.invalid');
    $('.invalid', frm).not(invalidExceptions).removeClass('invalid');
    var handleErr = $('input.handle').closest('.row').find('.err2,.err3,.err4,.err5,.err6,.err7');
    $('.err1,.err2', frm).not(handleErr).hide();
    $('input:text', frm).each(function () {
      if ($.trim($(this).val()) == "") {
        $(this).closest('.row').find('.err1').show();
        $(this).closest('.row').find('input:text').addClass('invalid');
        isValid = false;
      }
    });
    $('input.firstName,input.lastName').each(function () {
      if ($(this).val().length > 64) {
        isValid = false;
        $(this).addClass('invalid');
        $(this).closest('.row').find('.err2').show();
      }
    });
    $('input.userAge').each(function() {
      $(this).closest('.row').find('span.err1').hide();
      $(this).closest('.row').find('span.err2').hide();
      $(this).closest('.row').find('span.err3').hide();
      $(this).closest('.row').find('span.err4').hide();
      $(this).closest(".row").find("span.valid").hide();
      $(this).closest('.row').find('input:text').removeClass('invalid');
      if ($(this).val().length == 0) {
        $(this).closest('.row').find('span.err1').show();
        $(this).closest('.row').find('input:text').addClass('invalid');
        isValid = false;
      } else if (!$(this).val().match(/^\d+$/)) {
        $(this).closest('.row').find('span.err2').show();
        $(this).closest('.row').find('input:text').addClass('invalid');
        isValid = false;
      } else if (parseInt($(this).val()) < 13) {
        //$(this).closest('.row').find('span.err3').show();
        //$(this).closest('.row').find('input:text').addClass('invalid');
        $(this).closest(".row").find("span.valid").css("display", "inline-block");
        isValid = false;
      } else if (parseInt($(this).val()) > 13800000000) {
        $(this).closest('.row').find('span.err4').show();
        $(this).closest('.row').find('input:text').addClass('invalid');
        isValid = false;
      } else {
        $(this).closest(".row").find("span.valid").css("display", "inline-block");
      }
    });
    //stop submit if errors shown on first name/last name
    if ($('input.firstName').closest('.row').find('.err1,.err2,.err3,.err4,.err5,.err6').is(':visible')) {
        isValid = false;
        $('input.firstName').addClass('invalid');
    }
    if ($('input.lastName').closest('.row').find('.err1,.err2,.err3,.err4,.err5,.err6').is(':visible')) {
        isValid = false;
        $('input.lastName').addClass('invalid');
    }
    $('select', frm).each(function () {
      if ($.trim($(this).val()) == "") {
        $(this).closest('.row').find('.err1').show();
        $(this).closest('.row').find('.customSelect').addClass('invalid');
        isValid = false;
      }
    });

    $('input.email:text', frm).each(function () {
      if ($(this).closest('.row').find('.err1,.err2,.err3').is(':visible')) {
        isValid = false;
        return;
      }
        $(this).closest('.row').find('.err1').hide();
        $(this).closest('.row').find('.err2').hide();
      if ($.trim($(this).val()) == "") {
        $(this).closest('.row').find('.err1').show();
        $(this).closest('.row').find('input.email:text').addClass('invalid');
        isValid = false;
      }
      else if (!isValidEmailAddress($(this).val())) {
        $(this).closest('.row').find('.err2').show();
        $(this).closest('.row').find('input.email:text').addClass('invalid');
        isValid = false;
      }

    });
    if (!$(this).hasClass("socialRegister")) {
      $(this).closest('.row').find('.err1,.err2,.err3,.err4,.err5').hide();
      $('input.pwd:password', frm).each(function () {
          if ($.trim($(this).val()) == "") {
              if ($.trim($(this).val()) === $(this).val()) {
                $(this).closest('.row').find('.err1').show();
            } else {
                $(this).closest('.row').find('.err5').show();
            }
          $(this).closest('.row').find('input:password').addClass('invalid');
          isValid = false;
        } else if ($(".strength .field.red", frm).length > 0) {
          frm.find(".err2.red").show();
          $(this).closest('.row').find('.err2').show();
          $(this).closest('.row').find('input:password').addClass('invalid');
          isValid = false;
        } else if (pwdStrength($('input.pwd:password').val()) == -4) {
          frm.find(".err4.red").show();
          $(this).closest('.row').find('.err3').show();
          $(this).closest('.row').find('input:password').addClass('invalid');
          isValid = false;
        } else if (pwdStrength($('input.pwd:password').val()) < -1) {
          frm.find(".err4.red").show();
          $(this).closest('.row').find('.err4').show();
          $(this).closest('.row').find('input:password').addClass('invalid');
          isValid = false;
        }
        if ($('input.pwd:password', frm).val() != $('input.confirm:password', frm).val()) {
          $('input.confirm:password').closest('.row').find('.err2').show();
          $('input.confirm:password').closest('.row').find('input:password').addClass('invalid');
          isValid = false;
        }
        else if ($('input.confirm:password', frm).val() == "") {
          $('input.confirm:password').closest('.row').find('.err1').show();
          $('input.confirm:password').closest('.row').find('input:password').addClass('invalid');
          isValid = false;
        }
      });
    }
    $('.lSpace input:checkbox', frm).each(function () {
      if (!$(this).is(':checked')) {
        $(this).closest('.row').find('.err1').show();
        isValid = false;
      }
    });

    var handle = $('#register form.register input.name.handle:text').val();
    if (handle=='') {
      $('input.handle').closest('.row').find('.err1').show();
      $('input.handle').closest('.row').find('input:text').addClass('invalid');
      $('input.handle').closest('.row').find('span.valid').hide();
      isValid = false;
    }
    if ($('input.handle').closest('.row').find('.err3,.err4,.err5,.err6,.err7').is(':visible'))
      isValid = false;
    if (!isValid) return;

    handleDeferred.done(function() {

      if (handleChanged) return;

      if (!handleIsFree) {
        $('input.handle').closest('.row').find('.err2').show();
        $('input.handle').closest('.row').find('input:text').addClass('invalid');
        $('input.handle').closest('.row').find('span.valid').hide();
        isValid = false;
      }
      emailDeferred.done(function() {

        if (!emailIsFree) {
          $('input.email').closest('.row').find('.err3').show();
          $('input.email').closest('.row').find('input:text').addClass('invalid');
          $('input.email').closest('.row').find('span.valid').hide();
          isValid = false;
        }

        if (isValid && $('#register a.btnSubmit').html() == 'Sign Up') {
          $('#register a.btnSubmit').html('Please Wait');
          $('#register .btnSubmit').addClass('pleaseWait');
          // Issue ID: I-107903 - Disable all the fields on the registration form
          $('#register').find('input, select').prop('disabled', true);
          $('.customSelectInner').css('color', 'silver');
          $('#register a.btnSubmit').bind('click', false);
          var fields = {
            firstName: $('#registerForm input.firstName').val(),
            lastName: $('#registerForm input.lastName').val(),
            handle: $('#registerForm input.handle').val(),
            country: $('#registerForm select#selCountry').val(),
            email: $('#registerForm input.email').val(),
            regSource: regSource || tcconfig.mainURL,
            curUrl: window.location.href
          };
          if ((typeof socialProviderId != 'undefined') && socialProviderId !== "") {
            fields.socialProviderId = socialProviderId;
            fields.socialUserId = socialUserId;
            fields.socialProvider = socialProvider;
            fields.socialUserName = socialUserName;
            fields.socialEmail = socialEmail;
            fields.socialEmailVerified = "t";
          } else {
            fields.password = $('#registerForm  input.pwd').val();
          }
          
          if (utmSource) {
            fields.utm_source = utmSource;
            fields.utm_medium = utmMedium;
            fields.utm_campaign = utmCampaign;
          }

          if (_kmq) 
            _kmq.push(['identify', fields.email]);
          
          $.post(tcconfig.apiURL + '/users', fields, function(data) {
            var tcAction = getCookie('tcDelayChallengeAction');
            $('.modal').hide();
            $("#thanks h2").html('Thanks for Registering');
            $("#thanks p").html('We have sent you an email with activation instructions.<br>If you do not receive that email within 1 hour, please email <a href="mailto:support@topcoder.com">support@topcoder.com</a>');
            if (tcAction) {
              var tcDoAction = tcAction.split('|');
              if (tcDoAction[0] === 'register') {
                //append challenge registration message
                $("#thanks p").after("<div style='padding-bottom: 30px'>In order to register for the selected challenge, you must return to the <a href='/challenge-details/" + tcDoAction[1] + "/?type=" + challengeType + "'>challenge details page</a> after you have activated your account.</div>");
                $('#thanks p').css({'padding-bottom': '10px'});
              }
            }
            showModal('#thanks');
            $('input.pwd:password').closest('.row').find('.valid').hide();
            $('#registerForm .invalid').removeClass('invalid');
            $('#registerForm .valid').removeClass('valid');
            $('.err1,.err2', frm).hide();
            resetRegisterFields();
          })
            .fail(function(error) {
              console.log(error);
              alert(error);
            })
            .always(function() {
              // Issue ID: I-107903 - re-enable all the fields on the registration form
              $('#register').find('input, select').prop('disabled', false);
              $('.customSelectInner').css('color', '#000000');
              $('#register a.btnSubmit').unbind('click', false);
              $('#register .btnSubmit').html('Sign Up');
            });
        }
      });
    });

  });

  $('#login a.btnSubmit').on('click', function () {
    var frm = $(this).closest('form.login');
    $('.invalid', frm).removeClass('invalid');
    $('.err1,.err2', frm).hide();
    var isValid = true;
    $('input:password', frm).each(function () {
    //fixed incorrect value checking
        if ($.trim($(this).val()) == "") {
            if ($.trim($(this).val()) === $(this).val()) {
              $(this).closest('.row').find('.err1').show();
          } else {
              $(this).closest('.row').find('.err5').show();
          }
        $(this).closest('.row').find('input:password').addClass('invalid');
        isValid = false;
      }
    });

    if (isValid) {
      $('#loginForm .btnSubmit').html('Please wait');
    }
  });

  /* hover style icons */
  $('.animeButton').each(function () {
    var $span = $(this).find('.animeButtonHover', this).css('opacity', 0);
    $(this).hover(function () {
      if (!$('html').is('.ie6, .ie7, .ie8'))$span.stop().fadeTo(500, 1);
      else $span.css('opacity', 1);
    }, function () {
      if (!$('html').is('.ie6, .ie7, .ie8'))$span.stop().fadeTo(500, 0);
      else $span.css('opacity', 0);
    });
  });

  $('.person label').each(function () {
    var $span = $(this).find('.animeManHover', this).css('opacity', 0);
    $(this).hover(function () {
      if (!$('html').is('.ie6, .ie7, .ie8'))$span.stop().fadeTo(500, 1);
      else $span.css('opacity', 1);
    }, function () {
      if (!$('html').is('.ie6, .ie7, .ie8'))$span.stop().fadeTo(500, 0);
      else $span.css('opacity', 0);
    });
  });

  $('.switch-to-register').click(function() {
    window.location.href = "/register";
  });

  /*check if on registration complete page and add challenge detail link - currently only way to this since 
   *entire page content exists in WP database using generic template*/
  if ($('.thank-you').length) {
    var tcAction = getCookie('tcDelayChallengeAction');
    if (tcAction) {
      var tcActionValues = tcAction.split('|');
      if (typeof tcActionValues[2] !== 'undefined' && tcActionValues[0] === 'register' && tcActionValues[2] !== '') {
          //add link to challenge-details page for challenge new user tried to register for before making topcoder account
          $('.thank-you').append("<h4>Are you still interested in participating in the <br>&quot;" + decodeURIComponent(tcActionValues[2]) + "&quot; challenge? <br>If so, <a href='/challenge-details/register/" + tcActionValues[1] + "/'>go there now!</a></h4>");
        }
    }
  }
});

// modal
function showError(message) {
  $("#registerFailed .failedMessage").text(message);
  showModal("#registerFailed");
}

/**
 * show modal
 * selector - the jQuery selector of the popup
 */
function showModal(selector) {
  var modal = $(selector);
  $('#bgModal').show();
  modal.show();
  centerModal();
}

function centerModal(selector) {
  var modal = $('.modal:visible');
  if ($(window).width() >= 1003 || $('html').is('.ie6, .ie7, .ie8') || modal.is($('#thanks.modal')))
    modal.css('margin', -modal.height() / 2 + 'px 0 0 ' + (-modal.width() / 2) + 'px');
  else {
    modal.css('margin', '0');
  }
}

function closeModal() {
  $('.modal,#bgModal').hide();
  resetRegisterFields();
  if (window.location.hash.match('access_token')) {
    window.history.pushState({}, 'Home', '/');
  }
  
  // Issue ID: I-111638 - reset login fields
  resetLoginFields();
  
  loginState = window.location.href;
  $('#registerForm span.socialUnavailableErrorMessage').hide();
}

function redirectToNext() {
  // go to next param if it exists
  var nextLoc = getParameterByName('next') || getHashParameterByName('state');
  if (nextLoc) {
    window.location.href = nextLoc;
  }
  else if (window.location.pathname == '/register/') {
    window.location.href = "/";
  }
  else {
    closeModal()
  }
}

// Resets the registration popup fields
function resetRegisterFields() {
  $("#registerForm input[type='text'], #registerForm input[type='password']").val("");
  $("#registerForm select").val($("#registerForm select option:first").val());
  $('#registerForm input.handle').trigger('keyup');
  $("#registerForm .customSelectInner").text($("#registerForm select option:first").text());
  $("#registerForm input[type='checkbox']").attr('checked', false);
  $(".pwd, .confirm, .strength").parents(".row").show();
  $("#registerForm a.btnSubmit").removeClass("socialRegister");
  $('#registerForm .invalid').removeClass('invalid');
  $('#registerForm .err1,.err2,.err3,.err4,.err5,.err6,.err7,.err8').hide();
  $('#registerForm span.strength span.field').removeClass('red').removeClass('green');
  $('#registerForm span.valid').hide();
  $('.socialUnavailableErrorMessage').hide();
}

// Issue ID: I-111638 - Resets the login popup fields
function resetLoginFields() {
  $("#loginForm input[type='text'], #registerForm input[type='password']").val("");
  $('#loginForm .invalid').removeClass('invalid');
  $('#loginForm .err1,.err3,.err4').hide();
}


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
          $.get(tcconfig.apiURL + '/users/' + handle, function(data) {
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
          window.location.href = "/login?next=" + encodeURIComponent(window.location.href);
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
