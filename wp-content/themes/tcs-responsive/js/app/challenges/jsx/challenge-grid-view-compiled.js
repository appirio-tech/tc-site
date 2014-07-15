/*
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 * React component for Challenge Listing Page
 * compiled javascript version of challenge-grid-view.js
 * Ideal for production
*/

var ChallengeTechsList = React.createClass({displayName: 'ChallengeTechsList',
  render: function() {
    var challenge = this.props.challenge;
    var scope = this.props.scope;

    var techRows = _.map(challenge.technologies, function(tech){
      var clickHandler = scope.$apply.bind (scope,
                         scope.findByTechnology.bind (null, tech));
      return (
          React.DOM.li(null, React.DOM.span( {className:"techTag"}, React.DOM.a( {href:"javascript:;", onClick:clickHandler}, tech)))
        )
    });
    var platRows = _.map(challenge.platforms, function(plat){
      var clickHandler = scope.$apply.bind (scope,
                         scope.findByPlatform.bind (null, plat));
      return (
          React.DOM.li(null, React.DOM.span( {className:"techTag"}, React.DOM.a( {href:"javascript:;", onClick:clickHandler}, plat)))
        )
    });
    return (
        React.DOM.ul(null,
          techRows,
          platRows
        )
      );
  }
});

var ChallengeGridAll = React.createClass({displayName: 'ChallengeGridAll',
  render: function() {
  var scope = this.props.scope;

  var challenges = scope.challenges;
  var images = scope.images;

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
          techUpcoming : true,
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
          techUpcoming : true,
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

      var trackTag;
      switch(challenge.challengeCommunity){
        case 'design':
          trackTag = 'track-ig';
          break;
        default:
          trackTag = 'track-ff';
      }

      return (
        React.DOM.div( {className:"contest "+ trackTag +" trackSD type-" + challenge.challengeCommunity},
          React.DOM.div( {className:"cgCh"},
            React.DOM.a( {href:"/challenge-details/" +challenge.challengeId+"/?type="+challenge.challengeCommunity, className:"contestName"},
              React.DOM.img( {alt:"", className:"allContestIco", src:images + '/ico-track-' + challenge.challengeCommunity + '.png'} ),
              React.DOM.span( {className:"gridChallengName"}, challenge.challengeName),
              React.DOM.img( {alt:"", className:"allContestTCOIco", src:images + '/tco-flag-' + challenge.challengeCommunity + '.png'} )
            )
          ),
          React.DOM.div( {className:"cgTime"},
            React.DOM.div(null,
              React.DOM.div( {className:"row"},
                React.DOM.label( {className:"lbl"}, "Start Date"),
                React.DOM.div( {className:"val vStartDate"}, scope.dateFormatFilter(challenge.registrationStartDate, scope.dateFormat))
              ),
              React.DOM.div( {className:classNames[challengeCombo].registerBy !== undefined ? 'row':'row ng-hide'},
                React.DOM.label( {className:"lbl"}, "Register by"),
                React.DOM.div( {className:"val vStartDate"}, scope.dateFormatFilter(challenge.registrationEndDate, scope.dateFormat))
              ),
              React.DOM.div( {className:classNames[challengeCombo].roundEnd !== undefined && challenge.checkpointSubmissionEndDate !== '' ? 'row' : 'row ng-hide'},
                React.DOM.label( {className:"lbl"}, "Round 1 End"),
                React.DOM.div( {className:"val vEndRound"}, scope.dateFormatFilter(challenge.checkpointSubmissionEndDate, scope.dateFormat))
              ),
              React.DOM.div( {className:classNames[challengeCombo].endDate !== undefined ? 'row':'row ng-hide'},
                React.DOM.label( {className:"lbl"}, "End Date"),
                React.DOM.div( {className:"val vEndDate"}, scope.dateFormatFilter(challenge.submissionEndDate, scope.dateFormat))
              ),
              React.DOM.div( {className:classNames[challengeCombo].submitBy !== undefined ? 'row':'row ng-hide'},
                React.DOM.label( {className:"lbl"}, "Submit by"),
                  React.DOM.div( {className:"val vStartDate"}, scope.dateFormatFilter(challenge.submissionEndDate, scope.dateFormat))
                ),
              React.DOM.div( {className:classNames[challengeCombo].currentPhase !== undefined ? 'row':'row ng-hide'},
                React.DOM.label( {className:"lbl"}, "Current Phase"),
                React.DOM.div( {className:"val vPhase"}, challenge.currentPhaseName),
                React.DOM.div( {className:"clear"} )
              ),
              React.DOM.div( {className:classNames[challengeCombo].currentStatus !== undefined ? 'row':'row ng-hide'},
                 React.DOM.label( {className:"lbl"}, "Current Status"),
                 React.DOM.div( {className:"val vStatus"}, challenge.status)
              ),
              React.DOM.div( {className:classNames[challengeCombo].techUpcoming !== undefined ? 'row':'row ng-hide'},
                React.DOM.label( {className:"lbl"}, "Technologies"),
                React.DOM.div( {className:challenge.technologies === undefined || challenge.technologies.length === 0 ? 'val vTech' : 'val vTech ng-hide'},
                  React.DOM.span(null, "N/A")
                ),
                React.DOM.div( {className:challenge.technologies !== undefined || challenge.technologies.length !== 0 ? 'technologyTags' : 'technologyTags ng-hide'},
                  ChallengeTechsList( {challenge:challenge, scope:scope})
                ),
                React.DOM.div( {class:"clear"})
              )
            )
          ),
          React.DOM.div( {id:challenge.challengeId, className:classNames[challengeCombo].tech !== undefined ? 'technologyTags':'technologyTags ng-hide'},
              ChallengeTechsList( {challenge:challenge, scope:scope}),
            React.DOM.div( {className:"clear"} )
          ),
          React.DOM.div( {className:classNames[challengeCombo].genInfo !== undefined ? 'genInfo':'genInfo ng-hide'},
            React.DOM.p( {className:"cgTLeft", 'data-hasqtip':"0", 'aria-describedby':"qtip-0"}, React.DOM.i(null ),React.DOM.span( {dangerouslySetInnerHTML:{__html: scope.formatTimeLeft(challenge.currentPhaseRemainingTime, true, challenge.currentPhaseName)}})
            ),
            React.DOM.p( {className:"cgPur", 'data-hasqtip':"1", 'aria-describedby':"qtip-1"}, React.DOM.i(null ), " ", scope.currencyFilter(challenge.totalPrize)),
            React.DOM.p( {className:"cgReg", 'data-hasqtip':"2", 'aria-describedby':"qtip-2"}, React.DOM.i(null ),React.DOM.a( {href:"/challenge-details/" +challenge.challengeId + "/?type=" + challenge.challengeCommunity + "#viewRegistrant"}, challenge.numRegistrants)
            ),
            React.DOM.p( {className:"cgSub", 'data-hasqtip':"3", 'aria-describedby':"qtip-3"}, React.DOM.i(null ),challenge.numSubmissions)
          ),
          React.DOM.div( {className:classNames[challengeCombo].gdUpcoming !== undefined ? 'genInfo gdUpcoming':'genInfo gdUpcoming ng-hide'},
            React.DOM.p( {className:"cgTLeft", 'data-hasqtip':0, 'aria-describedby':"qtip-0"}, React.DOM.i(null ),scope.getContestDuration(challenge.registrationStartDate, challenge.submissionEndDate)),
            React.DOM.p( {className:"cgPur", 'data-hasqtip':1, 'aria-describedby':"qtip-1"}, React.DOM.i(null ), " ", scope.currencyFilter(challenge.totalPrize))
          ),
          React.DOM.i( {className:"ico trackType"},  " ", React.DOM.span( {className:"tooltipData"}, React.DOM.span( {className:"tipT"}, "Contest Type"),React.DOM.span( {className:"tipC"}, challenge.challengeType)))
        )
      );
  });
  return (
    React.DOM.div(null,
      rows
    )
    );
  }
});