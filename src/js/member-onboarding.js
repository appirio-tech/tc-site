$( document ).ready(function() {
    
    if($('#filters').length)
        var top = $('#filters').offset().top - parseFloat($('#filters').css('marginTop').replace(/auto/, 100));
  $(window).scroll(function (event) {
    // what the y position of the scroll is
    var y = $(this).scrollTop();

    // whether that's below the form
    if (y >= top) {
      // if so, ad the fixed class
      $('#filters').addClass('fixed');
    } else {
      // otherwise remove it
      $('#filters').removeClass('fixed');
    }
  });
	
    $('.mk-smooth').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                            scrollTop: (target.offset().top - 120)
                            }, 800);
                return false;
            }
        }
    });
  
    if ($('#single-member-onboarding').length){
        $('.pagnav-wrapper').show();
    } else {
        $('.pagnav-wrapper').hide();
    }
  
    function mobilecheck() {
        var check = false;
        (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }
  
    function mk_theme_toggle_box() {

        "use strict";

        var eventtype = mobilecheck() ? 'touchstart' : 'click';

        jQuery('.mk-toggle-trigger').on(eventtype, function() {
            var $this = jQuery(this);

            if (!$this.hasClass('mk-toggle-active')) {
                jQuery('.mk-box-to-trigger').fadeOut(100);
                $this.parent().find('.mk-box-to-trigger').fadeIn(150);
                jQuery('.mk-toggle-trigger').removeClass('mk-toggle-active');
                $this.addClass('mk-toggle-active');
            } else {
                jQuery('.mk-box-to-trigger').fadeOut(100);
                $this.removeClass('mk-toggle-active');
            }
            return false;
        });
    }

    function mk_social_share_global() {

        "use strict";

        var eventtype = mobilecheck() ? 'touchstart' : 'click';

        jQuery('.twitter-share').on(eventtype, function() {
            var $this = jQuery(this),
            $url = $this.attr('data-url'),
            $title = $this.attr('data-title');

            window.open('http://twitter.com/intent/tweet?text=' + $title + ' ' + $url, "twitterWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });

        jQuery('.pinterest-share').on(eventtype, function() {
            var $this = jQuery(this),
            $url = $this.attr('data-url'),
            $title = $this.attr('data-title'),
            $image = $this.attr('data-image');
            window.open('http://pinterest.com/pin/create/button/?url=' + $url + '&media=' + $image + '&description=' + $title, "twitterWindow", "height=320,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });

        jQuery('.facebook-share').on(eventtype, function() {
            var $url = jQuery(this).attr('data-url');
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + $url, "facebookWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });

        jQuery('.googleplus-share').on(eventtype, function() {
            var $url = jQuery(this).attr('data-url');
            window.open('https://plus.google.com/share?url=' + $url, "googlePlusWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });

        jQuery('.linkedin-share').on(eventtype, function() {
            var $this = jQuery(this),
            $url = $this.attr('data-url'),
            $title = $this.attr('data-title'),
            $desc = $this.attr('data-desc');
            window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + $url + '&title=' + $title + '&summary=' + $desc, "linkedInWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });
    }

    mk_theme_toggle_box();
    mk_social_share_global();

	
});


   
  
  
/*
(function($){
 
  var $container = $('#portfolio'),
 
      // create a clone that will be used for measuring container width
      $containerProxy = $container.clone().empty().css({ visibility: 'hidden' });   
 
  $container.after( $containerProxy );  
 
    // get the first item to use for measuring columnWidth
  var $item = $container.find('.portfolio-item').eq(0);
  $container.imagesLoaded(function(){
  $(window).smartresize( function() {
 
    // calculate columnWidth
    var colWidth = Math.floor( $containerProxy.width() / 2 ); // Change this number to your desired amount of columns
 
    // set width of container based on columnWidth
    $container.css({
        width: colWidth * 2 // Change this number to your desired amount of columns
    })
    .isotope({
 
      // disable automatic resizing when window is resized
      resizable: false,
 
      // set columnWidth option for masonry
      masonry: {
        columnWidth: colWidth
      }
    });
 
    // trigger smartresize for first time
  }).smartresize();
   });
 
// filter items when filter link is clicked
$('#filters a').click(function(){
$('#filters a.active').removeClass('active');
var selector = $(this).attr('data-filter');
$container.isotope({ filter: selector, animationEngine : "css" });
$(this).addClass('active');
return false;
 
});
 
} ) ( jQuery );*/
