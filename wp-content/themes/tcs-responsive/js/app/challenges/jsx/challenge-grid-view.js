/*
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 *
 * React component for Challenge Listing Page
 * jsx source file for challenge-grid-view-compiled.js.
 * Ideal for developing. Use http://facebook.github.io/react/jsx-compiler.html to compile to javascript.
 * You cannot import this file directly in script-register.json. Please refer to below to use.
 * How to use:
    1. In 'ng-page-challenge.php' Create a new <script> element with attribute 'type="text/jsx' : <script type="text/jsx">
    2. Paste the code after this comment block in the new tag.
    3. In script-register.json, include 'JSXTransformer-0.10.0.js' before 'react.js'
    4. In script-register.json, remove 'challenge-grid-view-compiled.js'
 */

/** @jsx React.DOM */
  window.ChallengeTechsList = React.createClass({
    render: function() {
      var challenge = this.props.challenge;
      var scope = this.props.scope;

      var techRows = _.map(challenge.technologies, function(tech){
        var clickHandler = scope.$apply.bind (scope,
                           scope.findByTechnology.bind (null, tech));
        return (
            <li><span className="techTag"><a href="javascript:;" onClick={clickHandler}>{tech}</a></span></li>
          )
      });
      var platRows = _.map(challenge.platforms, function(plat){
        var clickHandler = scope.$apply.bind (scope,
                           scope.findByPlatform.bind (null, plat));
        return (
            <li><span className="techTag"><a href="javascript:;" onClick={clickHandler}>{plat}</a></span></li>
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
        <div className={"contest "+ trackTag +" trackSD type-" + challenge.challengeCommunity}>
          <div className="cgCh">
            <a href={"/challenge-details/" +challenge.challengeId+"/?type="+challenge.challengeCommunity} className="contestName">
              <img alt="" className="allContestIco" src={images + '/ico-track-' + challenge.challengeCommunity + '.png'} />
              <span className="gridChallengName">{challenge.challengeName}</span>
              <img alt="" className="allContestTCOIco" src={images + '/tco-flag-' + challenge.challengeCommunity + '.png'} />
            </a>
          </div>
          <div className="cgTime">
            <div>
              <div className="row">
                <label className="lbl">Start Date</label>
                <div className="val vStartDate">{scope.dateFormatFilter(challenge.registrationStartDate, scope.dateFormat)}</div>
              </div>
              <div className={classNames[challengeCombo].registerBy !== undefined ? 'row':'row ng-hide'}>
                <label className="lbl">Register by</label>
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
                <label className="lbl">Submit by</label>
                  <div className="val vStartDate">{scope.dateFormatFilter(challenge.submissionEndDate, scope.dateFormat)}</div>
                </div>
              <div className={classNames[challengeCombo].currentPhase !== undefined ? 'row':'row ng-hide'}>
                <label className="lbl">Current Phase</label>
                <div className="val vPhase">{challenge.currentPhaseName}</div>
                <div className="clear" />
              </div>
              <div className={classNames[challengeCombo].currentStatus !== undefined ? 'row':'row ng-hide'}>
                 <label className="lbl">Current Status</label>
                 <div className="val vStatus">{challenge.status}</div>
              </div>
              <div className={classNames[challengeCombo].techUpcoming !== undefined ? 'row':'row ng-hide'}>
                <label className="lbl">Technologies</label>
                <div className={challenge.technologies === undefined || challenge.technologies.length === 0 ? 'val vTech' : 'val vTech ng-hide'}>
                  <span>N/A</span>
                </div>
                <div className={challenge.technologies !== undefined || challenge.technologies.length !== 0 ? 'technologyTags' : 'technologyTags ng-hide'}>
                  <ChallengeTechsList challenge={challenge} scope={scope}/>
                </div>
                <div class="clear"></div>
              </div>
            </div>
          </div>
          <div id={challenge.challengeId} className={classNames[challengeCombo].tech !== undefined ? 'technologyTags':'technologyTags ng-hide'}>
              <ChallengeTechsList challenge={challenge} scope={scope}/>
            <div className="clear" />
          </div>
          <div className={classNames[challengeCombo].genInfo !== undefined ? 'genInfo':'genInfo ng-hide'}>
            <p className="cgTLeft" data-hasqtip="0" aria-describedby="qtip-0"><i /><span dangerouslySetInnerHTML={{__html: scope.formatTimeLeft(challenge.currentPhaseRemainingTime, true)}}></span>
            </p>
            <p className="cgPur" data-hasqtip="1" aria-describedby="qtip-1"><i /> {scope.currencyFilter(challenge.totalPrize)}</p>
            <p className="cgReg" data-hasqtip="2" aria-describedby="qtip-2"><i /><a href={"/challenge-details/" +challenge.challengeId + "/?type=" + challenge.challengeCommunity + "#viewRegistrant"}>{challenge.numRegistrants}</a>
            </p>
            <p className="cgSub" data-hasqtip="3" aria-describedby="qtip-3"><i />{challenge.numSubmissions}</p>
          </div>
          <div className={classNames[challengeCombo].gdUpcoming !== undefined ? 'genInfo gdUpcoming':'genInfo gdUpcoming ng-hide'}>
            <p className="cgTLeft" data-hasqtip={0} aria-describedby="qtip-0"><i />{scope.getContestDuration(challenge.registrationStartDate, challenge.submissionEndDate)}</p>
            <p className="cgPur" data-hasqtip={1} aria-describedby="qtip-1"><i /> {scope.currencyFilter(challenge.totalPrize)}</p>
          </div>
          <i className="ico trackType"> <span className="tooltipData"><span className="tipT">Contest Type</span><span className="tipC">{challenge.challengeType}</span></span></i>
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