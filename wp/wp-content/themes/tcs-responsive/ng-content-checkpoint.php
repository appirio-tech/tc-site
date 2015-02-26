<div ng-show="CD.checkpointData">
  <h1>checkpoint WINNERS</h1>
  <p class="info">The following submissions have received a checkpoint prize.</p>
  <ul class="winnerList">
    <li ng-repeat="result in CD.checkpointResults" class="{{$index == CD.checkpointResults.length - 1 ? last : ''}}">
      <span class="{{$index == 0 ? 'firstPrizeIcon' : ($index == 1 ? 'secondPrizeIcon' : '')}} prizeIcon"></span>
      <span class="box">#{{result.submissionId}}</span>
    </li>
  </ul>
  <div class="clear"></div>
  <h1>Checkpoint General Feedback</h1>
  <div class="generalFeedback">
    <p>
      {{CD.checkpointData.generalFeedback}}
    </p>
  </div>
  <h1 class="noBorder">Personal Feedback</h1>
  <ul class="expandCollaspeList">
    <li ng-repeat="result in CD.checkpointResults">
      <div class="bar" ng-init="feedbackOpen=false" ng-click="feedbackOpen = !feedbackOpen" ng-style="{true: {'border-bottom':'1px solid #e7e7e7'}, false: {'border-bottom':'none'}}[feedbackOpen]">
        <a ng-class="{true: '', false: 'collapseIcon'}[feedbackOpen]"></a>
        Feedback #{{result.submissionId}}
      </div>
      <div class="feedBackContent ng-hide" ng-show="feedbackOpen">
        <p>
          {{result.feedback && result.feedback.length > 0 ? result.feedback : 'N/A'}}
        </p>
      </div>
    </li>
  </ul>
</div>
<h1 ng-show="!CD.checkpointData">Data is not available.</h1>
