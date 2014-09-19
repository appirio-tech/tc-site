/**
 * Challenge submit functions
 */
appChallengeSubmit = {
  init: function() {
    var tcjwt = getCookie('tcjwt');

    if (!app.isLoggedIn()) {
      $(function() {
        $('.actionLogin').click();
        $('.closeModal,#bgModal').on('click', function() {
          challengeURL = $('.back').attr('href');
          window.location.replace(challengeURL);
          closeModal();
        });
      });
    };
    
    $('#submitForm').jqTransform();
    $('body').delegate('.fileBrowser', 'click', function() {
      var fileUploaderWrapper = $(this).parent().removeClass('empty');
      $('.fileInput', fileUploaderWrapper).trigger('click');
    });
    $('#agree').change(function(){
      if($(this).prop('checked')){
        $(this).closest('section.agreement').removeClass('notAgreed');
      }else{
        $(this).closest('section.agreement').addClass('notAgreed');
      }
    });
    $("#termsLink").click(function(event){
      event.stopPropagation();
    });

    if (challengeType) {
      switch (challengeType) {
        case "develop":
          app.initDevelopSubmit(tcjwt);
        case "design":
          app.initDesignSubmit(tcjwt);
      }
    }

  },

  initDevelopSubmit: function(tcjwt) {
    $('.submitForChallenge.develop #submit').click(function(){
      url = $(this).data('href');
      if($('#agree').prop('checked')){
        var empty = false;
        if($("#submission").val()===''){
            $('.formSection .leftCol dd span.error').text('Please upload a submission first');
            $("#submission").closest('dd').addClass('empty');
            empty = true;
        }else if($("#submission").data('type')){
            var type = $("#submission").data('type').split(',');
            var ext = $("#submission").val().split('.').pop().toLowerCase();
            if($.inArray(ext, type) == -1) {
                //bugfix: if wrong file type, show correct error message
                if (type.length > 1) {
                  //display error if multiple file formats available
                  $('.formSection .leftCol dd span.error').text('Submissions must be in one of the following file formats: .' + type.join(', .'));
                } else {
                  //display error if only one file format is available
                  $('.formSection .leftCol dd span.error').text('Submissions must be in .' + type[0] + ' format only');
                }
                $("#submission").closest('dd').addClass('empty');
                empty = true;
            }
        }else{
            $("#submission").closest('dd').removeClass('empty');
        }
        if(!empty){
            if(app.isLoggedIn()){
              $('.container').addClass('uploading');
              ajaxFileUpload();
              var submission = document.getElementById('submission').files[0];
              var fileReader= new FileReader();
              fileReader.onload = function(e) {
                var xhr = $.post(ajaxUrl, {
                  "action": "submit_to_dev_challenge",
                  "challengeId": challengeId,
                  "fileName": submission.name,
                  "fileData": e.target.result.split("base64,")[1],
                  "jwtToken": tcjwt.replace(/["]/g, "")
                }, function(data) {
                  if (data["submissionId"]){
                    ajaxFileUploadSuccess(submission.name);
                  } else {
                    $( ".uploadBar .loader" ).stop();
                    $('.container').removeClass('uploading');
                    if(data["error"]["details"]){
                      $("#registerFailed .failedMessage").text(data["error"]["details"]);
                    } else {
                      $("#registerFailed .failedMessage").text("The submission could not be uploaded.");               
                    }
                    showModal("#registerFailed");
                  }
                });
                $("#cancelUpload").click(function(){
                  xhr.abort();
                  $( ".uploadBar .loader" ).stop();
                  $('.container').removeClass('uploading');
                });
              };
              fileReader.readAsDataURL(submission);
            } else {
              $('.actionLogin').click();
            }
        }
      }
    });
  },

  initDesignSubmit: function (tcjwt) {

  }
};

function ajaxFileUpload()
{
  $( ".uploadBar .loader").removeAttr('style')
    .animate(
    {
        width: "90%"
    },
    {
        duration: 5000,
        step: function( width ){
            if(parseInt(width)> 50){
                $( ".uploadBar .percentage").css({color : '#fff'})
            }else{
                $( ".uploadBar .percentage").removeAttr('style');
            }
            $( ".uploadBar .percentage").html(parseInt(width)+'%');
        }
    }
  );
}

function ajaxFileUploadSuccess(submissionName)
{
  $( ".uploadBar .loader").stop()
      .animate(
      {
          width: "100%"
      },
      {
          duration: 2000,
          step: function( width ){
              if(parseInt(width)> 50){
                  $( ".uploadBar .percentage").css({color : '#fff'})
              }else{
                  $( ".uploadBar .percentage").removeAttr('style');
              }
              $( ".uploadBar .percentage").html(parseInt(width)+'%');
          },
          complete: function(){
              $(".submitContainer").addClass("hide");
              $(".successContainer").removeClass("hide");
              $(".successContainer .submissions .file").text(submissionName);
          }
      }
  );
}

function ajaxFileUploadFailed()
{
  $( ".uploadBar .loader").stop()
      .animate(
      {
          width: "100%"
      },
      {
          duration: 500,
          step: function( width ){
              if(parseInt(width)> 50){
                  $( ".uploadBar .percentage").css({color : '#fff'})
              }else{
                  $( ".uploadBar .percentage").removeAttr('style');
              }
              $( ".uploadBar .percentage").html(parseInt(width)+'%');
          }
      }
  );
}

//browse file
function browseFileTrigger(obj) {
    var fileUploaderWrapper = $(obj).parent();
    var url = $(obj).val();
    var lastIndex = url.lastIndexOf('\\');
    var fileName = url.substring(lastIndex + 1);

    var lastIndex = url.lastIndexOf('/');
    var name2 = url.substring(lastIndex + 1);
    if (fileName.length > name2.length) {
        fileName = name2;
    }
    $('.fileNameDisplay', fileUploaderWrapper).html(fileName).removeClass("fileNameDisplayNoFile");
}

$.extend(app, appChallengeSubmit);
