var coder = {
  // binding member module events
  initMemberEvents: function () {




    // tab navs


    $('.subTrackTabs .tabNav a').on(ev, function () {
      $('.isActive', $(this).closest('.tabNav')).removeClass('isActive');
      $(this).addClass('isActive');
    });

    //pager
    $('.pager .nextLink').on(ev, function () {
      var pager = $(this).closest('.pager');
      var nextLink = $('.isActive', pager).next('.pageLink');
      if (nextLink.length > 0) {
        nextLink.trigger('click');
      }
    });

    $('.pager .prevLink').on(ev, function () {
      var pager = $(this).closest('.pager');
      var prevLink = $('.isActive', pager).prev('.pageLink');
      if (prevLink.length > 0) {
        prevLink.trigger('click');
      }
    });
    /*$('.pager .pageLink').on(ev,function(e){
     var pager = $(this).closest('.pager');
     $('.prevLink',pager).show();
     $('.nextLink',pager).show();
     var page = $(this).attr('href').replace(/#/g,'');
     var newUrl = url+ '?pageSize='+postPerPage+'&page='+page;
     app.forum.populate(newUrl);
     $('.isActive',$(this).closest('.pager')).removeClass('isActive');
     $(this).addClass('isActive');
     if($('.pageLink:last',pager).hasClass('isActive')){
     $('.nextLink',pager).hide();
     }
     if($('.pageLink:first',pager).hasClass('isActive')){
     $('.prevLink',pager).hide();
     }
     e.preventDefault();
     });*/
    $('.pager .pageLink').on(ev, function (e) {
      var pager = $(this).closest('.pager');
      $('.prevLink', pager).show();
      $('.nextLink', pager).show();
      var page = $(this).attr('href').replace(/#/g, '');
      $('.isActive', $(this).closest('.pager')).removeClass('isActive');
      $(this).addClass('isActive');
      $('.page').hide();
      $('.page' + parseInt($(this).text().trim())).show();
      if ($('.pageLink:last', pager).hasClass('isActive')) {
        $('.nextLink', pager).hide();
      }
      if ($('.pageLink:first', pager).hasClass('isActive')) {
        $('.prevLink', pager).hide();
      }
      e.preventDefault();
    });

    // view switch
    $('.viewSwitch a').on(ev, function (e) {
      var id = $(this).attr('href');
      $('.ratingViews #graphView').hide();
      $('.ratingViews #tabularView').hide();
      $('.ratingViews ' + id).fadeIn();
      $(window).resize();
      e.preventDefault();
      $('.isActive', $(this).closest('.viewSwitch')).removeClass('isActive');
      $(this).addClass('isActive');
    });

    //design carousel
    if ($('.submissionCarousel').length > 0) {
      var len = $('.submissionCarousel .slider .slide').length;
      $('.submissionCarousel .slider').iCarousel({
        slides: 5,
        dir: 'rtl',
        easing: 'ease-in-out',
        slidesSpace: 190,
        mouseWheel: false,
        onAfterChange: function () {
          var aIdx = this.defs.slide;
          $('.ratingInfo .slider-pager .isActive').removeClass('isActive');
          $('.ratingInfo .slider-pager li:eq(' + aIdx + ') a').addClass('isActive');
          $('.submissonInfo .submissionThumb img').attr('src', $('img', this.defs.currentSlide).attr('src') + '?sbt=full');

          var desc = $('.comptetionData', this.defs.currentSlide);
          $('.winInfo .contestTitle').html('<i></i>' + $('.name', desc).val());
          $('.winInfo .prizeAmount .val').html('<i></i>' + $('.prize', desc).val());
          $('.winInfo .submittedOn .time').html($('.submiissionDate', desc).val());
        }
      });
      window.setTimeout(function () {
        $('.submissionCarousel .slider').trigger('iCarousel:pause');
        $('.ratingInfo .slider-pager li:eq(0) a').addClass('isActive');
      }, 2000);
      var pagination = $("<div class='slider-ctrl'><ul class='slider-pager'></ul></div>");
      for (var i = 0; i < len; i++) {
        $('.slider-pager', pagination).append('<li class="slider-pager-item"><a href="javascript:;" class="navDot"></a></li>');
      }
      $('.ratingInfo').append($(pagination));

    }

    //slider nav
    $('.ratingInfo').on(ev, '.slider-ctrl a', function () {
      var idx = $(this).parent().index();
      var ctrl = $(this).closest('.slider-ctrl');
      $('.isActive', ctrl).removeClass('isActive');
      $(this).addClass('isActive');
      $('.submissionCarousel .slider').trigger('iCarousel:goSlide', [idx]);
      return false;
    });
  },
  // forum function
  forum: {
    // adding records to forum list
    populate: function (dataUrl) {
      if (xhr != "") {
        xhr.abort();
      }
      app.setLoading();
      xhr = $.getJSON(dataUrl, '', function (data) {
        var count = 0;
        $('.forumPosts .forumList').html(null);
        $.each(data, function (key, rec) {
          var post = $(memBluprints.forum).clone();
          post.addClass('post' + rec.type);
          $('.postTitle', post).html(rec.title);
          $('.postAuthor', post).html(rec.postedBy);
          $('.postBody', post).html(rec.postContent);
          $('.postCat', post).html(rec.postCategory);
          $('.postedAt', post).html(rec.postedOn);
          $('.nThread em', post).html(rec.threads);
          $('.nMsg em', post).html(rec.messages);

          $('.forumPosts .forumList').append(post);
          count += 1;
          if (count >= postPerPage) {
            $('.loading').hide();
            return false;
          }
        });
        $('.loading').hide();
      });
    }
  }
}

// htmldata
var memBluprints = {
  forum: '<div class="post">\
				<a href="#" class="thumb"></a>\
				<div class="head">\
					<a href="#" class="postTitle"></a>\
					<span class="postedBy">Last Post by: <a href="#" class="postAuthor"></a></span>\
				</div>\
				<div class="postBody"></div>\
				<div class="postInfo">\
					<div class="row">\
						<a href="#" class="postCat"></a>\
						<span class="sep"></span><span class="postedAt"></span>\
					</div>\
					<div class="row">\
						<span class="info nThread"><em>8</em> Threads</span><span class="sep"></span><span class="info nMsg"><em>24</em> Messages</span>\
					</div>\
				</div>\
			</div>'
}

// extending base prototype
$.extend(app, coder);
