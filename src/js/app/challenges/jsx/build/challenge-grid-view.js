/** @jsx React.DOM */
/*
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 * React component for Challenge Listing Page
 * Ideal for developing. Use http://facebook.github.io/react/jsx-compiler.html to compile to javascript.
 * You cannot import this file directly in script-register.json. Please refer to below to use.
 * How to use:
    1. In 'ng-page-challenge.php' Create a new <script> element with attribute 'type="text/jsx' : <script type="text/jsx">
    2. Paste the code after this comment block in the new tag.
    3. In script-register.json, include 'JSXTransformer-0.10.0.js' before 'react.js'
    4. In script-register.json, remove 'challenge-grid-view-compiled.js'
 * To Compile:
 * 1. $ cd wp-content/themes/tcs-responsivet/js/app/challenges/jsx
 * 2. $ jsx --watch src build
 */
  window.ChallengeTechsList = React.createClass({displayName: 'ChallengeTechsList',
    render: function() {
      var challenge = this.props.challenge;
      var scope = this.props.scope;

      var techRows = _.map(challenge.technologies, function(tech){
        var clickHandler = scope.$apply.bind (scope,
                           scope.findByTechnology.bind (null, tech));
        return (
            React.createElement("li", {key: 'tech.' + tech}, React.createElement("span", {className: "techTag"}, React.createElement("a", {href: "javascript:;", onClick: clickHandler}, tech)))
          )
      });
      var platRows = _.map(challenge.platforms, function(plat){
        var clickHandler = scope.$apply.bind (scope,
                           scope.findByPlatform.bind (null, plat));
        return (
            React.createElement("li", {key: 'plat.' + plat}, React.createElement("span", {className: "techTag"}, React.createElement("a", {href: "javascript:;", onClick: clickHandler}, plat)))
          )
      });
      return (
          React.createElement("ul", null,
            techRows,
            platRows
          )
        );
    }
  });

  window.ChallengeGridAll = React.createClass({displayName: 'ChallengeGridAll',
    render: function() {
    var scope = this.props.scope;

    var challenges = scope.challenges;
    var images = scope.images;
    var getTrackSymbol = scope.getTrackSymbol;
    var rows = _.map(challenges, function(challenge){
        var challengeCombo = challenge.challengeCommunity + '_' + scope.contest.listType;

        // #### Angular ngShow -> React ####
        var classNames = {
          design_active: {
            roundEnd : true,
            endDate : true,
            currentPhase: true,
            genInfo: true
          },
          design_past: {
            roundEnd : true,
            endDate : true,
            genInfo : true
          },
          design_upcoming: {
            registerBy : true,
            submitBy : true,
            currentStatus : true,
            tech : true,
            gdUpcoming : true
          },
          develop_active: {
            registerBy : true,
            submitBy : true,
            currentPhase : true,
            tech : true,
            genInfo : true
          },
          develop_past: {
            registerBy : true,
            submitBy : true,
            tech : true,
            genInfo : true
          },
          develop_upcoming: {
            roundEnd : true,
            endDate : true,
            currentStatus : true,
            tech : true,
            gdUpcoming : true
          },
          data_active: {
            endDate : true,
            genInfo : true
          },
          data_past: {
            endDate : true,
            genInfo : true
          },
          data_upcoming: {
            submitBy : true,
            gdUpcoming : true
          }
        }

        var track = getTrackSymbol(challenge.challengeType);
        var trackTag = 'track-' + track;
        return (
        React.createElement("div", {className: "contest "+ trackTag +" trackSD type-" + challenge.challengeCommunity, key: challenge.challengeId},
          React.createElement("div", {className: "cgCh"},
            React.createElement("a", {href: challenge.challengeCommunity != 'data' ? "/challenge-details/" +challenge.challengeId+"/?type="+challenge.challengeCommunity : tcconfig.communityURL + '/tc?module=MatchDetails&rd=' + challenge.roundId, className: "contestName"},
              React.createElement("img", {alt: "", className: "allContestIco", src: (scope.contest.contestType == 'data' && challenge.challengeCommunity == 'develop') ? images + 'banner-data.svg' : images + 'banner-' + challenge.challengeCommunity + '.svg'}), 
              React.createElement("span", {className: "gridChallengName"}, challenge.challengeName),
              React.createElement(Qtip, {text: challenge.challengeType, title: "Challenge Type", community: challenge.challengeCommunity},
                React.createElement("span", {className: "track-symbol"}, track.toUpperCase())
              )
            )
          ),
          React.createElement("div", {className: "cgTime"},
            React.createElement("div", null,
              React.createElement("div", {className: "row"},
                React.createElement("label", {className: "lbl"}, "Start Date"),
                React.createElement("div", {className: "val vStartDate"}, scope.dateFormatFilter(challenge.registrationStartDate, scope.dateFormat))
              ),
              React.createElement("div", {className: classNames[challengeCombo].registerBy !== undefined ? 'row':'row ng-hide'},
                React.createElement("label", {className: "lbl"}, "Register By"),
                React.createElement("div", {className: "val vStartDate"}, scope.dateFormatFilter(challenge.registrationEndDate, scope.dateFormat))
              ),
              React.createElement("div", {className: classNames[challengeCombo].roundEnd !== undefined && challenge.checkpointSubmissionEndDate !== '' ? 'row' : 'row ng-hide'},
                React.createElement("label", {className: "lbl"}, "Round 1 End"),
                React.createElement("div", {className: "val vEndRound"}, scope.dateFormatFilter(challenge.checkpointSubmissionEndDate, scope.dateFormat))
              ),
              React.createElement("div", {className: classNames[challengeCombo].endDate !== undefined ? 'row':'row ng-hide'},
                React.createElement("label", {className: "lbl"}, "End Date"),
                React.createElement("div", {className: "val vEndDate"}, scope.dateFormatFilter(challenge.submissionEndDate, scope.dateFormat))
              ),
              React.createElement("div", {className: classNames[challengeCombo].submitBy !== undefined ? 'row':'row ng-hide'},
                React.createElement("label", {className: "lbl"}, "Submit By"),
                  React.createElement("div", {className: "val vStartDate"}, scope.dateFormatFilter(challenge.submissionEndDate, scope.dateFormat))
                ),
              /*<div className={classNames[challengeCombo].currentPhase !== undefined ? 'row':'row ng-hide'}>
                <label className="lbl">Current Phase</label>
                <div className="val vPhase">{challenge.currentPhaseName}</div>
                <div className="clear" />
              </div>*/
              React.createElement("div", {className: classNames[challengeCombo].currentStatus !== undefined ? 'row':'row ng-hide'},
                 React.createElement("label", {className: "lbl"}, "Current Status"),
                 React.createElement("div", {className: "val vStatus"}, challenge.status)
              )
            )
          ),
          React.createElement("div", {id: challenge.challengeId, className: classNames[challengeCombo].tech !== undefined ? 'technologyTags':'technologyTags ng-hide'},
              React.createElement(ChallengeTechsList, {challenge: challenge, scope: scope}),
            React.createElement("div", {className: "clear"})
          ),
          React.createElement("div", {className: classNames[challengeCombo].genInfo !== undefined ? 'genInfo':'genInfo ng-hide'},
            React.createElement(Qtip, {text: scope.formatTimeLeft(challenge.currentPhaseRemainingTime, true, challenge.currentPhaseName).$$unwrapTrustedValue(), title: "Time Left", community: challenge.challengeCommunity},
              React.createElement("p", {className: "cgTLeft", 'data-hasqtip': "0", 'aria-describedby': "qtip-0"}, React.createElement("i", null), React.createElement("span", {dangerouslySetInnerHTML: {__html: scope.formatTimeLeft(challenge.currentPhaseRemainingTime, true, challenge.currentPhaseName)}})
              )
            ),
            React.createElement(Qtip, {text: scope.currencyFilter(challenge.totalPrize), title: "Total Prize", community: challenge.challengeCommunity},
              React.createElement("p", {className: "cgPur", 'data-hasqtip': "1", 'aria-describedby': "qtip-1"}, React.createElement("i", null), " ", scope.currencyFilter(challenge.totalPrize))
            ),
            React.createElement(Qtip, {text: challenge.numRegistrants, title: "Registrants", community: challenge.challengeCommunity},
              React.createElement("p", {className: "cgReg", 'data-hasqtip': "2", 'aria-describedby': "qtip-2"}, React.createElement("i", null), React.createElement("a", {href: "/challenge-details/" +challenge.challengeId + "/?type=" + challenge.challengeCommunity + "#viewRegistrant"}, challenge.numRegistrants)
              )
            ),
            React.createElement(Qtip, {text: challenge.numSubmissions, title: "Submissions", community: challenge.challengeCommunity},
              React.createElement("p", {className: "cgSub", 'data-hasqtip': "3", 'aria-describedby': "qtip-3"}, React.createElement("i", null), challenge.numSubmissions)
            )
          ),
          React.createElement("div", {className: classNames[challengeCombo].gdUpcoming !== undefined ? 'genInfo gdUpcoming':'genInfo gdUpcoming ng-hide'},
            React.createElement(Qtip, {text: scope.getContestDuration(challenge.registrationStartDate, challenge.submissionEndDate), title: "Duration (days)", community: challenge.challengeCommunity},
              React.createElement("p", {className: "cgTLeft", 'data-hasqtip': 0, 'aria-describedby': "qtip-0"}, React.createElement("i", null), scope.getContestDuration(challenge.registrationStartDate, challenge.submissionEndDate)+(scope.getContestDuration(challenge.registrationStartDate, challenge.submissionEndDate)<2?" Day":" Days"))
            ),
            React.createElement(Qtip, {text: scope.currencyFilter(challenge.totalPrize), title: "Total Prize", community: challenge.challengeCommunity},
              React.createElement("p", {className: "cgPur", 'data-hasqtip': 1, 'aria-describedby': "qtip-1"}, React.createElement("i", null), " ", scope.currencyFilter(challenge.totalPrize))
            )
          )
        )
      );
    });
    return (
      React.createElement("div", null,
        rows
      )
      );
    }
  });
