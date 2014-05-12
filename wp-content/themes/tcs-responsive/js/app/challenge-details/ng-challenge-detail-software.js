var cdapp = angular.module('challengeDetails', ['restangular'])

.constant("API_URL", "https://api.topcoder.com/v2")

.config(['$httpProvider', 'RestangularProvider', 'API_URL', function($httpProvider, RestangularProvider, API_URL) {
  /*
   * Enable CORS
   * http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
   */
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  // Base API url
  RestangularProvider.setBaseUrl(API_URL);

  // Format restangular response

  // add a response intereceptor
  RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
    var extractedData;
    // .. to look for getList operations
    if (operation === "getList") {
      // .. and handle the data and meta data
      extractedData = data.data ? data.data : data;
      if (!(Object.prototype.toString.call(extractedData) === '[object Array]'))
        extractedData = [extractedData];
      extractedData.pagination = {
        total: data.total,
        pageIndex: data.pageIndex,
        pageSize: data.pageSize
      };
    } else {
      extractedData = data.data;
    }
    return extractedData;
  });
}]);

cdapp.factory('ChallengeService', ['Restangular', 'API_URL', '$q', function(Restangular, API_URL, $q) {
  var service = Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl(API_URL);
  });
  service.getChallenge = function(id) {
    var defer = $q.defer();
    service.one(challengeType).one('challenges', id).getList().then(function(challenge) {
      challenge = challenge[0];
      var submissionMap = {};
      challenge.submissions.map(function(submission) {
        if (submissions[submission.handle]) {
          var neu = new Date(submission.submissionDate);
          var alt = new Date(submissionMap[submission.handle]);
          if (neu > alt) {
            submissionMap[submission.handle] = submission.submissionDate;
          }
        } else {
          submissionMap[submission.handle] = submission.submissionDate;
        }
      });
      challenge.registrants.map(function(x) {
        x.lastSubmissionDate = submissionMap[x.handle];
      });
      if (challenge.allowStockArt) {
        challenge.allowStockArt = challenge.allowStockArt == 'true';
      }
      if ((new Date(challenge.registrationEndDate)) > new Date()) {
        challenge.registrationDisable = false;
      } else {
        challenge.registrationDisable = true;
      }
      challenge.submitDisabled = true;
      if (challenge.submissionEndDate && challenge.currentStatus != 'Completed') {
        if ((new Date(challenge.submissionEndDate)) > new Date()) {
          challenge.submitDisabled = false;
        }
        var handleMap = {};
        challenge.registrants.map(function(x) {
          handleMap[x.handle] = true;
        });
        if (!handleMap[handle]) challenge.submitDisabled = true;
      }
      defer.resolve(challenge);
    });
    return defer.promise;
  }
  return service;
}]);

cdapp.controller('CDCtrl', ['$scope', 'ChallengeService', '$sce', function($scope, ChallengeService, $sce) {
  $scope.trust = function(x) {
    return $sce.trustAsHtml(x);
  }
  $scope.range = function(from, to) {
    var ans = [];
    for (var i = from; i < to; i++) {
      ans.push[i];
    }
    return ans;
  }
  $scope.max = function(x, y) { return x > y ? x : y; };
  $scope.formatDate = function(date) {
    function pad0(x) {
      return (x+'').length == 1 ? '0' + x : x;
    }
    if (!date) return '--';
    if (typeof date == 'string') date = new Date(date);
    else console.log(date);
    var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
    var day = date.getDate();
    var year = date.getFullYear();
    var time = pad0((date.getUTCHours() + 20) % 24) + ':' + pad0(date.getUTCMinutes());
    return month + ' ' + day + ', ' + year + ' ' + time + ' EDT';
  }

  challengeId = location.href.match(/s\/(\d+)/)[1];
  ChallengeService.getChallenge(challengeId).then(function(challenge) {
    console.log(challenge);
    chglo = challenge;
    $scope.challenge = challenge;
    $scope.activeTab = 'overview';
    $scope.siteURL = siteURL;
    $scope.challengeType = getParameterByName('type');
    $scope.isDesign = $scope.challengeType == 'design';
    $scope.inSubmission = inSubmission = challenge.currentPhaseName.indexOf('Submission') >= 0;
    $scope.inScreening = inScreening = challenge.currentPhaseName.indexOf('Screening') >= 0;
    $scope.inReview = inReview = challenge.currentPhaseName.indexOf('Review') >= 0;
    $scope.hasFiletypes = (challenge.filetypes != undefined) && challenge.filetypes.length > 0;
    globby = $scope;


  });
}]);

var sliderActive = false;
var prizeSliderActive = false;
var slider;
var prizeSlider;
var sliderClone;

function createSlider() {
  sliderClone = $('.columnSideBar .slider > ul:first-child').clone();
  slider = jQuery('.columnSideBar .slider > ul:first-child').bxSlider({
    minSlides: 1,
    maxSlides: 1,
    responsive: !ie7,
    adaptiveHeight: false,
    swipeThreshold: 40,
    controls: false,
    infiniteLoop: false
  });
  return true;
}

function createPrizeSlider() {
  prizeSlider = $('.prizeSlider > ul:first-child').bxSlider({
    minSlides: 1,
    maxSlides: 1,
    responsive: !ie7,
    adaptiveHeight: false,
    swipeThreshold: 40,
    controls: false
  });
  return true;
}

function getAnchor(url) {
  var index = url.lastIndexOf('#');
  if (index != -1)
    return url.substring(index);
}

//create slider if page is wide
$(document).ready(function () {
  if (window.innerWidth < 1019) {

    $(".rightColumn").insertAfter('.leftColumn');
    $('.grid-1-3').insertBefore('#contest-overview');
    $('.scroll-pane').jScrollPane({ autoReinitialise: true });

    sliderActive = createSlider();

    $('#stepBox .rightColumn .nextBox .allDeadlineNextBoxContent p:nth-child(3)').addClass('moveRight');
    if ($('.studio').length > 0) {
      updateDesignContestMobile();
    }
    // Hide deadline boxes on mobile view
    updateDeadlineBoxMobile();

    $('.registrantsTable').not('.mobile').addClass('hide');
    $('.registrantsTable.mobile').removeClass('hide');
  } else {
    if ($('.studio').length > 0) {
      updateDesignContest();
    }
    // Show deadline boxes
    updateDeadlineBox();

    $('.registrantsTable').not('.mobile').removeClass('hide');
    $('.registrantsTable.mobile').addClass('hide');
  }
  $('a[href="' + getAnchor(location.href) + '"]').click();

  // init tab nav
  app.tabNavinit();

  var tcsso = getCookie('tcsso');
  var tcjwt = getCookie('tcjwt');


  getChallenge(tcjwt, function(challenge) {
    updateRegSubButtons(challenge);
    addDocuments(challenge);
  });

  function updateRegSubButtons(challenge) {
    // if there was an error getting the challenge then enable the buttons
    if (challenge.status == false) {
      $('.challengeRegisterBtn').removeClass('disabled');
      $('.challengeSubmissionBtn').removeClass('disabled');
      $('.challengeSubmissionsBtn').removeClass('disabled');
    } else {
      if(tcsso) {
        var tcssoValues = tcsso.split("|");
        $.getJSON("http://community.topcoder.com/tc?module=BasicData&c=get_handle_by_id&dsid=30&uid=" + tcssoValues[0] + "&json=true", function(data) {
          var now = new Date();
          var handle = data['data'][0]['handle'];

          var registrants = [];
          $.each(challenge.registrants, function(x, registrant) {
            registrants.push(registrant.handle)
          });

          if (registrationUntil && now.getTime() < registrationUntil.getTime() && registrants && registrants.indexOf(handle) == -1) {
            $('.challengeRegisterBtn').removeClass('disabled');
          }
          if (submissionUntil && now.getTime() < submissionUntil.getTime() && registrants && registrants.indexOf(handle) > -1) {
            $('.challengeSubmissionBtn').removeClass('disabled');
            $('.challengeSubmissionsBtn').removeClass('disabled');
          }
        });
      }
    }
  }

  function addDocuments(challenge) {
    if (challenge.Documents && $('.downloadDocumentList')) {
      $('.downloadDocumentList').children().remove();
      challenge.Documents.map(function(x) {
        $('.downloadDocumentList').append($(
          '<li><a href="'+x.url+'">'+x.documentName+'</a></li>'
        ));
      });
    }
  }

  function getChallenge(tcjwt, callback) {
    if (tcjwt && (typeof challengeId != 'undefined')) {
      $.getJSON(ajaxUrl, {
        "action": "get_challenge_documents",
        "challengeId": challengeId,
        "challengeType": challengeType,
        "nocache": true,
        "jwtToken": tcjwt.replace(/["]/g, "")
      }, function (data) {
        callback(data);
      });
    }
  }
});

//create/destroy slider based on width
$(window).resize(function () {

  if (window.innerWidth < 1019) {
    if (sliderActive == false) {
      $(".rightColumn").insertAfter('.leftColumn');
      $('.grid-1-3').insertBefore('#contest-overview');
      $('.scroll-pane').jScrollPane({ autoReinitialise: true });
      sliderActive = createSlider();
    }
    if ($('.studio').length > 0) {
      updateDesignContestMobile();
    }
    // Hide deadline boxes on mobile view
    updateDeadlineBoxMobile();

    $('.registrantsTable').not('.mobile').addClass('hide');
    $('.registrantsTable.mobile').removeClass('hide');
  }

  if (window.innerWidth > 1019) {
    if (sliderActive == true) {
      $(".rightColumn").insertAfter('.middleColumn');
      $('.grid-1-3').insertAfter('.rightSplit');
      $('.scroll-pane').jScrollPane({ autoReinitialise: true });

      slider.destroySlider();
      sliderActive = false;
      // Replace the destroyed slider with a previously cloned one
      // Hack for a known bxslider bug: http://stackoverflow.com/questions/16283955/window-resize-with-bxslider-destroyed-breaks-style
      $('.slider > ul:first-child').replaceWith(sliderClone);
    }
    if ($('.studio').length > 0) {
      updateDesignContest();
    }
    // Show deadline boxes
    updateDeadlineBox();

    $('.registrantsTable').not('.mobile').removeClass('hide');
    $('.registrantsTable.mobile').addClass('hide');
  }
});

$(window).bind('orientationchange', function (event) {
  //alert('new orientation:' + event.orientation);
  $('.scroll-pane').jScrollPane({ autoReinitialise: true });
});

//getClassName
var getElementsByClassName = function (searchClass, node, tag) {
  if (document.getElementsByClassName) {
    return  document.getElementsByClassName(searchClass)
  } else {
    node = node || document;
    tag = tag || '*';
    var returnElements = []
    var els = (tag === "*" && node.all) ? node.all : node.getElementsByTagName(tag);
    var i = els.length;
    searchClass = searchClass.replace(/\-/g, "\\-");
    var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
    while (--i >= 0) {
      if (pattern.test(els[i].className)) {
        returnElements.push(els[i]);
      }
    }
    return returnElements;
  }
};

function hasClass(obj, cls) {
  return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
  if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
  if (hasClass(obj, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    obj.className = obj.className.replace(reg, ' ');
  }
}

var tooltipTimeout;

function showTooltip(source, num) {
  getElementsByClassName('tip' + num)[0].style.display = 'block';
  getElementsByClassName('tip' + num)[0].style.top = source.getBoundingClientRect().top + (document.documentElement.scrollTop || document.body.scrollTop) + 2 + 'px';
  if (hasClass(getElementsByClassName('tip' + num)[0], 'reviewStyleTip')) {
    getElementsByClassName('tip' + num)[0].style.left = source.getBoundingClientRect().left + (document.documentElement.scrollLeft || document.body.scrollLeft) - 210 + 'px';
  } else {
    getElementsByClassName('tip' + num)[0].style.left = source.getBoundingClientRect().left + (document.documentElement.scrollLeft || document.body.scrollLeft) + 32 + 'px';
  }
}

function hideTooltip(num) {
  tooltipTimeout = setTimeout(function () {
    getElementsByClassName('tip' + num)[0].style.display = 'none';
  }, 200);
}

function enterTooltip(num) {
  clearTimeout(tooltipTimeout);
  getElementsByClassName('tip' + num)[0].style.display = 'block';
}

function ieHack() {
  var browser = navigator.appName;
  var b_version = navigator.appVersion;
  var version = b_version.split(";");
  if (version[1]) {
    var trim_Version = version[1].replace(/[ ]/g, "");
  }
  if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0") {
    for (i = 0; i < getElementsByClassName('shadow').length; i++) {
      getElementsByClassName('shadow')[i].style.marginTop = '-1px';
    }
  }
}

function updateDeadlineBoxMobile() {
  $('.deadlineBoxContent').addClass("hide");
  $('.allDeadlineNextBoxContent').addClass('hide');
  $('.nextDeadlineNextBoxContent').removeClass('hide');
}

function updateDeadlineBox() {
  if ($('.nextDeadlineNextBoxContent').hasClass('hide')) {
    $('.allDeadlinedeadlineBoxContent').removeClass("hide");
  } else {
    $('.nextDeadlinedeadlineBoxContent').removeClass("hide");
  }
}

function updateDesignContestMobile() {
  if (prizeSliderActive == false) {
    $('.prizeTable').addClass("hide");
    $('.prizeSlider').removeClass("hide");
    prizeSliderActive = createPrizeSlider();
  }
  $('.tabsWrap .tabNav').not('.mobile').addClass('hide');
  $('.tabsWrap .tabNav.mobile').removeClass('hide');
}

function updateDesignContest() {
  if (prizeSliderActive == true) {
    $('.prizeTable').removeClass("hide");
    $('.prizeSlider').addClass("hide");
    prizeSlider.destroySlider();
    prizeSliderActive = false;
  }
  $('.tabsWrap .tabNav').not('.mobile').removeClass('hide');
  $('.tabsWrap .tabNav.mobile').addClass('hide');
}


$(function () {
  $('.scroll-pane').jScrollPane();
  //switch the view all deadline and view next deadline
  $(".viewAllDeadLineBtn").click(function () {
    $(".nextDeadlinedeadlineBoxContent").addClass("hide");
    $(".allDeadlinedeadlineBoxContent").removeClass("hide");
    $(".nextDeadlineNextBoxContent").addClass("hide");
    $(".allDeadlineNextBoxContent").removeClass("hide");
    $(".contestEndedBox").addClass("hide");

  });
  //switch the view all deadline and view next deadline
  $(".viewNextDeadLineBtn").click(function () {
    $(".contestEndedBox").addClass("hide");
    $(".allDeadlinedeadlineBoxContent").addClass("hide");
    $(".nextDeadlinedeadlineBoxContent").removeClass("hide");
    $(".allDeadlineNextBoxContent").addClass("hide");
    $(".nextDeadlineNextBoxContent").removeClass("hide");
  });

  $(".morePayments.active").click(function () {
    if ($(this).hasClass("closed")) {
      $(".morePayments.active").removeClass("closed");
      $(".morePayments.active").addClass("open");
      $(".additionalPrizes").removeClass("hide");
    } else {
      $(".morePayments.active").removeClass("open");
      $(".morePayments.active").addClass("closed");
      $(".additionalPrizes").addClass("hide");
    }
  });

  $(".challengeRegisterBtn").click(function () {
    if ($(this).hasClass("disabled")) { return false; }
    var tcjwt = getCookie('tcjwt');
    if (tcjwt) {
      if ($('.loading').length <= 0) {
        $('body').append('<div class="loading">Loading...</div>');
      } else {
        $('.loading').show();
      }
      $.getJSON(ajaxUrl, {
        "action": "register_to_challenge",
        "challengeId": challengeId,
        "jwtToken": tcjwt.replace(/["]/g, "")
      }, function (data) {
        $('.loading').hide();
        if (data["message"] === "ok") {
          showModal("#registerSuccess");
        } else if (data["error"]["details"] === "You should agree with all terms of use.") {
          window.location = siteURL + "/challenge-details/terms/" + challengeId + "?challenge-type=" + challengeType;
        } else if (data["error"]["details"]) {
          $("#registerFailed .failedMessage").text(data["error"]["details"]);
          showModal("#registerFailed");
        }
      });
    } else {
      $('.actionLogin').click();
    }
  });

  if (autoRegister) {
    $(".challengeRegisterBtn").click();
  }

  $("#registerSuccess .closeModal").click(function () {
    closeModal();
    window.location.href = siteURL + "/challenge-details/" + challengeId + "?type=" + challengeType + "&nocache=true";
  });

});

/* checkpoint contest css*/
$(function () {
  // checkpoint box click
  $('.winnerList .box').on('click', function () {
    var idx = $(this).closest('li').index();
    $('a', $('.expandCollaspeList li').eq(idx)).trigger('click');
    var top = $('a', $('.expandCollaspeList li').eq(idx)).offset().top - 20;
    var body = $("html, body");
    body.animate({scrollTop: top}, '500', 'swing');
  });

  $('.expandCollaspeList li a').each(function () {
    var _this = $(this).parents('li')
    if (!$(this).hasClass('collapseIcon')) {
      _this.children('.bar').css('border-bottom', '1px solid #e7e7e7');
    } else {
      _this.children('.bar').css('border-bottom', 'none');
    }
  });
  $('.expandCollaspeList li .bar').on(ev, function () {
    var _this = $(this).closest('li');
    if (!$('a', _this).hasClass('collapseIcon')) {
      $('a', _this).addClass('collapseIcon');
      _this.children('.feedBackContent').hide();
      _this.children('.bar').css('border-bottom', 'none');
    } else {
      $('a', _this).removeClass('collapseIcon')
      _this.children('.feedBackContent').show();
      _this.children('.bar').css('border-bottom', '1px solid #e7e7e7');
    }
  });

  $('#submissions .jsViewSubmission').on(ev, function () {
    $('.submissionAllView').hide();
    $('.submissionSingleView').show();
  });


  /* view next */
  $('#submissions .pager').on(ev, '.nextLink', function (e) {
    $('#submissions .prevLink').show();
    return false;
  });
  $('#submissions .pager').on(ev, '.prevLink', function (e) {
    $('#submissions .nextLink').show();

    return false;
  });

  $('.jsSeeMore').on(ev, function () {
    $(this).hide();
    $(this).parents('.stockArtInfo').find('.seeMoreInfo').show();
  });
  if ($('.scrollPane').length > 0) {
    $('.scrollPane').jScrollPane({autoReinitialise: true});
  }

  $('.challenge-detail #submissions .submissionShowcaseList li a').click(function () {
    $('.submissionBig').hide();
    $('.submissionBigMock').hide();
    if (!$(this).hasClass('mock')) {
      $('.submissionBig').show();
      $('.submissionBigMock').hide();
    } else {

      $('.submissionBig').hide();
      $('.submissionBigMock').show();
    }
    $('.challenge-detail #submissions .submissionShowcaseList li a').removeClass('active');
    $(this).addClass('active');
  });

  var userAgent = navigator.userAgent.toLowerCase();
  jQuery.browser = {
    version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: /webkit/.test(userAgent),
    opera: /opera/.test(userAgent),
    msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
    mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
  };
  if ($.browser.msie && $.browser.version == 10) {
    if (window.innerWidth < 1019) {
      $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '0');
      $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', 'auto');
    } else {
      $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '-6px');
      $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', '73px');
    }
    $(window).resize(function () {
      if (window.innerWidth < 1019) {
        $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '0');
        $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', 'auto');
      } else {
        $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '-6px');
        $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', '73px');
      }
    });
  }
  if ($.browser.mozilla) {

    if (window.innerWidth < 1019) {
      $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '0');
      $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', 'auto');
    } else {
      $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '-6px');
      $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', '75px');
    }

    $(window).resize(function () {
      if (window.innerWidth < 1019) {
        $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '0');
        $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', 'auto');
      } else {
        $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '-6px');
        $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', '75px');
      }
    });
  }
  if ($.browser.safari) {
    if (window.innerWidth < 1019) {
      $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '0');
      $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', 'auto');
    } else {
      $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', '74px');
      $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '-5px');
    }
    $(window).resize(function () {

      if (window.innerWidth < 1019) {
        $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '0');
        $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', 'auto');
      }
      if (window.innerWidth > 1019) {
        $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', '74px');
        $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '-5px');
      }
    });
  }

  var Sys = {};
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/version\/([\d.]+).*safari/) != null && ua.match(/version\/([\d.]+).*safari/)[1].split('.')[0] > 3) {
    if (window.innerWidth < 1019) {
      $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '0');
      $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', 'auto');
      //$('.winnerListAlt li .boxName').css('width','50%');
    } else {
      $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', '74px');
      $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '0px');
    }

    $(window).resize(function () {
      if (window.innerWidth < 1019) {
        $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '0');
        $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', 'auto');
        //$('.winnerListAlt li .boxName').css('width','50%');
      } else {
        $('.challenge-detail #checkpoints .winnerListEndAlt').css('height', '74px');
        $('.winnerList li .boxName,.winnerListAlt li .boxName').css('top', '0px');
      }
    });

  }

});


app.tabNavinit = function () {

  // tab navs
  $('.tabNav a').off().on(ev, function () {
    var id = $(this).attr('href');
    var tabIdx = id.lastIndexOf('tab=');
    if (tabIdx > 0) {
      id = "#" + id.substr(tabIdx + 4);
    }
    $('.tab', $(this).closest('.tabsWrap')).hide();
    $(id).fadeIn();
    $('.active', $(this).closest('nav')).removeClass('active');
    $(this).addClass('active');

    id = id.replace('#', '');
    $('#mainContent').attr('class', '').addClass('splitLayout').addClass('currentTab-' + id);
    return false;
  });

  $('.challenge-detail .tabsWrap .tabNav a').each(function () {
    var value = $.trim($(this).text()).toLocaleLowerCase();
    if (activeTab === value) {
      $('.active', $(this).closest('ul')).removeClass('active');
      $(this).addClass('active');
    }
  })
}
