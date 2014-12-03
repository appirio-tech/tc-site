/**
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
    if (app.isLoggedIn()) {
      app.setLoading();
      $.getJSON(ajaxUrl, {
        "action": "get_challenge_term_details",
        "termId": termsOfUseID,
        "isLc": isLC,
        "jwtToken": tcjwt.replace(/["]/g, "")
      }, function (data) {
        $(".formContent").addClass("pageContent");
        if (data.title) {
          $(".formContent .terms").show();
          $(".formContent .warning").hide();
          $(".overviewPageTitle").text(data["title"]);
          //Bugfix I-116354
          $('#agreement-section').removeClass('hide');
          if (data["agreeabilityType"] !== "Electronically-agreeable" && typeof data["docusignTemplateId"] !== "undefined") {
            //if DocuSign, get URL from docuSign API and output iframe
            $('.agree-label').hide();
            $('#termSubmit').text('Go Back');
            $('.agreement').removeClass('notAgreed');
            var finalDest = escape(siteURL + "/challenge-details/terms/" + challengeId + "?challenge-type=" + challengeType + "&termId=" + termsOfUseID + "lc=" + isLC + "&cb=" + Math.random());
            $.ajax({
              url: tcApiRUL + '/terms/docusign/viewURL',
              type: 'POST',
              data: {
                templateId: data["docusignTemplateId"],
                returnUrl: siteURL + "/iframe-break/?dest=" + finalDest
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
            $.getJSON(ajaxUrl, {
              "action": "agree_challenge_terms",
              "termId": termsOfUseID,
              "isLc": isLC,
              "jwtToken": tcjwt.replace(/["]/g, "")
            }, function (data) {
              window.location = siteURL + "/challenge-details/terms/" + challengeId + "?challenge-type=" + challengeType + "&lc=" + isLC;
              $('.loading').hide();
            });
          }
        });
      });
    } else {
      $('.actionLogin').click();
    }
  },

  initList: function (tcjwt) {
    if (app.isLoggedIn()) {
      app.setLoading();
      var getTerms = function() {
        $.getJSON(ajaxUrl, {
          "action": "get_challenge_terms",
          "challengeId": challengeId,
          "role": "Submitter",
          "isLc": isLC,
          "jwtToken": tcjwt.replace(/["]/g, "")
        }, function (data) {
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
              var $td1 = $("<td>").text(terms[i]["title"]).append(" (").append($("<a>", {href: siteURL + "/challenge-details/terms/detail/" + terms[i]["termsOfUseId"] + "?contestID=" + challengeId + "&challenge-type=" + challengeType + "&lc=" + isLC}).text(agreed ? "view" : "view and agree")).append(")");
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
            window.location = siteURL + "/challenge-details/register/" + challengeId  + "?type=" + challengeType + "&nocache=true&lc=" + isLC;
          });
        });
      };

      var termId = getParameterByName('termId');
      if (termId) {
        $.getJSON(ajaxUrl, {
          "action": "agree_challenge_terms",
          "termId": termId,
          "jwtToken": tcjwt.replace(/["]/g, "")
        }, function (data) {
          getTerms();
        });
      }
      else getTerms();

    } else {
      $('.actionLogin').click();
    }
  }
};

$.extend(app, appChallengeTerms);
