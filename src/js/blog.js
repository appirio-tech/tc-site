$(document).ready(function () {
  /* swipe slider for category widget */
  window.mySwipe = $('#mySwipe').Swipe(
    {
      callback: function (pos) {
        var n = $("#mySwipe .swipeNavWrapper a").length;
        var index = pos % n;
        $("#mySwipe .swipeNavWrapper a").removeClass("on");
        $("#swipeNav" + index).addClass("on");
      }
    }
  ).data('Swipe');

  /* swipe nav button */
  $("#mySwipe .swipeNavWrapper a").click(function () {
    var id = $(this).attr("id");
    var index = parseInt(id.replace("swipeNav", ""));
    mySwipe.slide(index);
  });

  /* subscribe function on subscribe widget */
  $(".subscribeButton").click(function () {
    var email = $(this).parent().parent().find(".subscribeInput").val();
    $(this).parent().parent().find(".errorInput").html("");
    email = $.trim(email);

    if (email == "") {
      $(".subscribeBox .errorInput").html("Please fill the email!");
    }
    else if (!validateEmail(email)) {
      $(".subscribeBox .errorInput").html("Email is invalid email format!");
    }
    else {
      $(".subscribeBox form").submit();
    }
  });
})

/* validate email */
function validateEmail(email) {
  var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (reg.test(email)) {
    return true;
  }
  else {
    return false;
  }
} 
