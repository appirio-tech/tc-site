/**
 * This code is copyright (c) 2015 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.1
 *
 * Changed in 1.1 (topcoder new community site - Removal proxied API calls)
 * Replaced proxided calls with direct calls to API
 *
 * Terms functions
 */
appChallengeTerms = {
  init: function () {
    var tcjwt = getCookie('tcjwt');

    if (termType) {
        //Bugfix I-109575: missing break statements caused unneccessary API calls and unpredictable element behaviour
      switch (termType) {
        case "list":
          app.initList(tcjwt);
        break;
        case "detail":
          app.initDetail(tcjwt);
        break;
      }
    }

  },

  initDetail: function (tcjwt) {
    app.setLoading();
    $.ajax({
      type: "GET",
      url: tcconfig.apiURL + "/terms/detail/" + termsOfUseID + (app.isLoggedIn() ? '' : '?noauth=true'),
      dataType: 'json',
      headers: app.isLoggedIn() ? {
        'Authorization': 'Bearer ' + tcjwt.replace(/["]/g, "")
      } : {},
      success: function(data) {
        $(".formContent").addClass("pageContent");
        if (data.title) {
          $(".formContent .terms").show();
          $(".formContent .warning").hide();
          $(".overviewPageTitle").text(data["title"]);
          //Bugfix I-116354
          $('#agreement-section').removeClass('hide');
          
          if (data.agreeabilityType === 'Non-electronically-agreeable') {
            $('#agreement-section').addClass('hide');
            $('.loading').hide();
            $(".termsText").html(data.text);
          } else if (data["agreeabilityType"] !== "Electronically-agreeable" && typeof data["docusignTemplateId"] !== "undefined") {
            if (!app.isLoggedIn()) {
              window.location.href = 'login?next=' + window.location.href;
            }
            //if DocuSign, get URL from docuSign API and output iframe
            $('.agree-label').hide();
            $('#termSubmit').text('Go Back');
            $('.agreement').removeClass('notAgreed');
            var finalDest = escape(tcconfig.mainURL + "/challenge-details/terms/" + challengeId + "?challenge-type=" + challengeType + "&cb=" + Math.random());
            $.ajax({
              url: tcconfig.apiURL + '/terms/docusign/viewURL',
              type: 'POST',
              data: {
                templateId: data["docusignTemplateId"],
                returnUrl: tcconfig.mainURL + "/iframe-break/?dest=" + finalDest
              },
              cache: false,
              beforeSend: function(bxhr) {
                bxhr.setRequestHeader('Authorization', 'Bearer ' + tcjwt.replace(/["]/g, ""));
              },
              complete: function(docuData) {
                $('.loading').hide();
                //output iframe when AJAX data returns
                var responseObj = docuData.responseJSON;
                if (typeof responseObj["recipientViewUrl"] !== "undefined") {
                  $(".termsText").html('<iframe class="termsFrame" src="' + responseObj["recipientViewUrl"] + '"></iframe>');
                } else {
                  //url not in data result, error
                  $(".formContent .terms").hide();
                  $(".formContent .warning").text(responseObj["description"]);
                  $(".formContent .warning").show();
                }
              },
              error: function(jqXHR, textStatus, errorThrown) {
                // Handle errors here
                $(".termsText").html('Sorry, your request could not be completed at this time.');
              }
            });
          } else {
            $('.loading').hide();
            //if not docuSign, output normal terms text
            $(".termsText").html(data["text"]);
          }
        } else {
          $('.loading').hide();
          $(".formContent .terms").hide();
          $(".formContent .warning").text(data["error"]["details"]);
          $(".formContent .warning").show();
        }
        $('#agree').change(function () {
          if ($(this).prop('checked')) {
            $(this).closest('section.agreement').removeClass('notAgreed');
          } else {
            $(this).closest('section.agreement').addClass('notAgreed');
          }
        });
        $("#termSubmit").click(function () {
          if ($(this).parents(".notAgreed").length === 0) {
            app.setLoading();
            $.ajax({
              type: "POST",
              url: tcconfig.apiURL + "/terms/" + termsOfUseID + "/agree",
              dataType: 'json',
              headers: {
                'Authorization': 'Bearer ' + tcjwt.replace(/["]/g, "")
              },
              success: function(data) {
                window.location = tcconfig.mainURL + "/challenge-details/terms/" + challengeId + "?challenge-type=" + challengeType;
                $('.loading').hide();
              }
            });
          }
        });
      }
    });
    if (!app.isLoggedIn()) {
      $('#submitForm').hide();
    }
  },

  initList: function (tcjwt) {
    if (app.isLoggedIn()) {
      app.setLoading();
      var getTerms = function() {
        $.ajax({
          type: "GET",
          url: tcconfig.apiURL + "/terms/" + challengeId + "?role=Submitter",
          dataType: 'json',
          headers: {
            'Authorization': 'Bearer ' + tcjwt.replace(/["]/g, "")
          },
          success: function(data) {
            if (data["terms"]) {
              $(".formContent .terms, .formContent .termTable").show();
              $(".formContent .warning").hide();
              var terms = data["terms"];
              var allAgreed = true;
              for (var i = 0; i < terms.length; i++) {
                var agreed = terms[i]["agreed"]
                if (agreed === false) {
                  allAgreed = false;
                }
                var $tr = $("<tr>", {class: i % 2 == 1 ? "alt" : ""});
                var $td1 = $("<td>").text(terms[i]["title"]).append(" (").append($("<a>", {href: tcconfig.mainURL + "/challenge-details/terms/detail/" + terms[i]["termsOfUseId"] + "?contestID=" + challengeId + "&challenge-type=" + challengeType}).text(agreed ? "view" : "view and agree")).append(")");
                var $td2 = $("<td>").append($("<span>", {class: "status " + (agreed === true ? "complete" : "required")}).text(agreed === true ? "Completed" : "Required"));
                $tr.append($td1).append($td2);
                $(".termTable tbody").append($tr);
              }
              if (allAgreed === true) {
                $(".termsBtnRegister").removeClass("hide");
              } else {
                $(".termsBtnRegister").addClass("hide");
              }
            } else {
              $(".formContent .terms, .formContent .termTable").hide();
              $(".formContent .warning").text(data["error"]["details"]);
              $(".formContent .warning").show();
            }
            $('.loading').hide();

            $(".termsBtnRegister").click(function () {
              $.ajax({
                type: "POST",
                url: tcconfig.apiURL + "/challenges/" + challengeId + "/register",
                dataType: 'json',
                headers: {
                  'Authorization': 'Bearer ' + tcjwt.replace(/["]/g, "")
                },
                success: function(data) {
                  window.location = tcconfig.mainURL + "/challenge-details/" + challengeId  + "?type=" + challengeType + "&nocache=true";
                }
              });

            });
          }
        });
      };

      var termId = getParameterByName('termId');
      if (termId) {
        $.ajax({
          type: "POST",
          url: tcconfig.apiURL + "/terms/" + termId + "/agree",
          dataType: 'json',
          headers: {
            'Authorization': 'Bearer ' + tcjwt.replace(/["]/g, "")
          },
          success: function(data) {
            getTerms();
          }
        });
      }
      else getTerms();

    } else {
      $('.actionLogin').click();
    }
  }
};

$.extend(app, appChallengeTerms);
