$(document).ready(function () {

	$('#formResetPassword .btnSubmit').click(function () {
		var handle = $("#formResetPassword .handleOrEmail").val();
		
		$("#formResetPassword .handleOrEmail").parent().find('.err1').hide();
                if($.trim(handle)!="") {
			$("#formResetPassword").submit();
		}
		else {
			$("#formResetPassword .handleOrEmail").parent().find('.err1').show();
		}
	});
	
	$('#formChangePassword .btnSubmit').click(function () {
		var handle = $("#formChangePassword .handle").val();
		var password = $("#formChangePassword .password").val();
		var confirm = $("#formChangePassword .confirm").val();
		var unlockCode = $("#formChangePassword .unlockCode").val();
		var isValid = true;

		$("#formChangePassword").find(".error").hide();
		//validate password
		if ($("#formChangePassword .password").val() == "") {
			$("#formChangePassword .password").parent().find('.err1').show();
			isValid = false;
        } else if ($(".strength .field.red").length > 0) {
			$("#formChangePassword .password").parent().find('.err2').show();
			isValid = false;
        } else if (pwdStrength($('#formChangePassword .password').val()) < -1) {
			$("#formChangePassword .password").parent().find('.err4').show();
			isValid = false;
        }
		
		//validate confirm
		if ($("#formChangePassword .confirm").val() == "") {
			$("#formChangePassword .confirm").parent().find('.err1').show();
			isValid = false;
        } else if ($("#formChangePassword .password").val() != $("#formChangePassword .confirm").val()) {
			$("#formChangePassword .confirm").parent().find('.err2').show();
			isValid = false;
        }
				
		if ($("#formChangePassword .handle").val() == "") {
			$("#formChangePassword .handle").parent().find('.err1').show();
			isValid = false;
        } 		
		
		//validate unlock code 
		if ($("#formChangePassword .unlockCode").val() == "") {
			$("#formChangePassword .unlockCode").parent().find('.err1').show();
			isValid = false;
        } 
		
		if(isValid) {
			$("#formChangePassword").submit();
		}
	});
	
	function pwdStrength(pwd) {

		var result = 0;
                if ($.trim(pwd)=='') return 0;
		if (pwd.length < 7) return -2;
		if (pwd.length > 30) return -3;

		if (pwd.match(/[a-z]/)) result++;
		if (pwd.match(/[A-Z]/)) result++;
		if (pwd.match(/\d/)) result++;
		if (pwd.match(/[\]\[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\\\^\_\`\{\|\}\~\-]/)) result++;

		return result;

	}
	
	/* Issue ID: I-115910 - Add validation on the time of entering password */
	$('#formChangePassword input.password:password').on('keyup', function () {
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
	
	/* Issue ID: I-115910 - Add matching validation on the time of entering confirmation password */
    $('#formChangePassword input.confirm:password').on('keyup', function () {
        var input = $(this);
        input.removeClass('invalid');
        input.closest('.row').find('.err1,.err2').hide();
        if (input.val() == "") {
            input.closest('.row').find('.err1').show();
            input.addClass('invalid');
        } else if (input.val() != $('#formChangePassword input.password:password').val()) {
            input.closest('.row').find('.err2').show();
            input.addClass('invalid');
        }
    });
});



