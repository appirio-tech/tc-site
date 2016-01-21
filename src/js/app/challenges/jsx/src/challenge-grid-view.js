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
  window.ChallengeTechsList = React.createClass({
    render: function() {
      var challenge = this.props.challenge;
      var scope = this.props.scope;

      var techRows = _.map(challenge.technologies, function(tech){
        var clickHandler = scope.$apply.bind (scope,
                           scope.findByTechnology.bind (null, tech));
        return (
            <li key={'tech.' + tech}><span className="techTag"><a href="javascript:;" onClick={clickHandler}>{tech}</a></span></li>
          )
      });
      var platRows = _.map(challenge.platforms, function(plat){
        var clickHandler = scope.$apply.bind (scope,
                           scope.findByPlatform.bind (null, plat));
        return (
            <li key={'plat.' + plat}><span className="techTag"><a href="javascript:;" onClick={clickHandler}>{plat}</a></span></li>
          )
      });
      return (
          <ul>
            {techRows}
            {platRows}
          </ul>
        );
    }
  });

  window.ChallengeGridAll = React.createClass({
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
        <div className={"contest "+ trackTag +" trackSD type-" + challenge.challengeCommunity} key={challenge.challengeId}>
          <div className="cgCh">
            <a href={challenge.challengeCommunity != 'data' ? "/challenge-details/" +challenge.challengeId+"/?type="+challenge.challengeCommunity : tcconfig.communityURL + '/tc?module=MatchDetails&rd=' + challenge.roundId} className="contestName">
              <img alt="" className="allContestIco" src={(scope.contest.contestType == 'data' && challenge.challengeCommunity == 'develop') ? images + 'ico-competitive-develop-challenge.svg' : images + 'ico-track-' + challenge.challengeCommunity + '.svg'} />
              <span className="gridChallengName">{challenge.challengeName}</span>
              <Qtip text={challenge.challengeType} title="Challenge Type" community={challenge.challengeCommunity}>
                <span className="track-symbol">{track.toUpperCase()}</span>
              </Qtip>
            </a>
          </div>
          <div className="cgTime">
            <div>
              <div className="row">
                <label className="lbl">Start Date</label>
                <div className="val vStartDate">{scope.dateFormatFilter(challenge.registrationStartDate, scope.dateFormat)}</div>
              </div>
              <div className={classNames[challengeCombo].registerBy !== undefined ? 'row':'row ng-hide'}>
                <label className="lbl">Register By</label>
                <div className="val vStartDate">{scope.dateFormatFilter(challenge.registrationEndDate, scope.dateFormat)}</div>
              </div>
              <div className={classNames[challengeCombo].roundEnd !== undefined && challenge.checkpointSubmissionEndDate !== '' ? 'row' : 'row ng-hide'}>
                <label className="lbl">Round 1 End</label>
                <div className="val vEndRound">{scope.dateFormatFilter(challenge.checkpointSubmissionEndDate, scope.dateFormat)}</div>
              </div>
              <div className={classNames[challengeCombo].endDate !== undefined ? 'row':'row ng-hide'}>
                <label className="lbl">End Date</label>
                <div className="val vEndDate">{scope.dateFormatFilter(challenge.submissionEndDate, scope.dateFormat)}</div>
              </div>
              <div className={classNames[challengeCombo].submitBy !== undefined ? 'row':'row ng-hide'}>
                <label className="lbl">Submit By</label>
                  <div className="val vStartDate">{scope.dateFormatFilter(challenge.submissionEndDate, scope.dateFormat)}</div>
                </div>
              {/*<div className={classNames[challengeCombo].currentPhase !== undefined ? 'row':'row ng-hide'}>
                <label className="lbl">Current Phase</label>
                <div className="val vPhase">{challenge.currentPhaseName}</div>
                <div className="clear" />
              </div>*/}
              <div className={classNames[challengeCombo].currentStatus !== undefined ? 'row':'row ng-hide'}>
                 <label className="lbl">Current Status</label>
                 <div className="val vStatus">{challenge.status}</div>
              </div>
            </div>
          </div>
          <div id={challenge.challengeId} className={classNames[challengeCombo].tech !== undefined ? 'technologyTags':'technologyTags ng-hide'}>
              <ChallengeTechsList challenge={challenge} scope={scope}/>
            <div className="clear" />
          </div>
          <div className={classNames[challengeCombo].genInfo !== undefined ? 'genInfo':'genInfo ng-hide'}>
            <Qtip text={scope.formatTimeLeft(challenge.currentPhaseRemainingTime, true, challenge.currentPhaseName).$$unwrapTrustedValue()} title="Time Left" community={challenge.challengeCommunity}>
              <p className="cgTLeft" data-hasqtip="0" aria-describedby="qtip-0"><i /><span dangerouslySetInnerHTML={{__html: scope.formatTimeLeft(challenge.currentPhaseRemainingTime, true, challenge.currentPhaseName)}}></span>
              </p>
            </Qtip>
            <Qtip text={scope.currencyFilter(challenge.totalPrize)} title="Total Prize" community={challenge.challengeCommunity}>
              <p className="cgPur" data-hasqtip="1" aria-describedby="qtip-1"><i /> {scope.currencyFilter(challenge.totalPrize)}</p>
            </Qtip>
            <Qtip text={challenge.numRegistrants} title="Registrants" community={challenge.challengeCommunity}>
              <p className="cgReg" data-hasqtip="2" aria-describedby="qtip-2"><i /><a href={challenge.challengeCommunity == 'data' ? "//community.topcoder.com/longcontest/?module=ViewRegistrants&rd=" + challenge.roundId : "/challenge-details/" +challenge.challengeId + "/?type=" + challenge.challengeCommunity + "#viewRegistrant"}>{challenge.numRegistrants}</a>
              </p>
            </Qtip>
            <Qtip text={challenge.numSubmissions} title="Submissions" community={challenge.challengeCommunity}>
              <p className="cgSub" data-hasqtip="3" aria-describedby="qtip-3"><i />{challenge.numSubmissions}</p>
            </Qtip>
          </div>
          <div className={classNames[challengeCombo].gdUpcoming !== undefined ? 'genInfo gdUpcoming':'genInfo gdUpcoming ng-hide'}>
            <Qtip text={scope.getContestDuration(challenge.registrationStartDate, challenge.submissionEndDate)} title="Duration (days)" community={challenge.challengeCommunity}>
              <p className="cgTLeft" data-hasqtip={0} aria-describedby="qtip-0"><i />{scope.getContestDuration(challenge.registrationStartDate, challenge.submissionEndDate)+(scope.getContestDuration(challenge.registrationStartDate, challenge.submissionEndDate)<2?" Day":" Days")}</p>
            </Qtip>
            <Qtip text={scope.currencyFilter(challenge.totalPrize)} title="Total Prize" community={challenge.challengeCommunity}>
              <p className="cgPur" data-hasqtip={1} aria-describedby="qtip-1"><i /> {scope.currencyFilter(challenge.totalPrize)}</p>
            </Qtip>
          </div>
        </div>
      );
    });
    return (
      <div>
        {rows}
      </div>
      );
    }
  });
