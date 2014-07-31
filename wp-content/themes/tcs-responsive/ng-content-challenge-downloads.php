<h3>Downloads:</h3>
<div class="inner">
  <ul class="downloadDocumentList">
    <li ng-if="challenge.Documents && challenge.Documents.length > 0 && allowDownloads" ng-repeat="document in challenge.Documents">
      <a href="{{document.url}}">{{document.documentName}}</a>
    </li>
    <li ng-if="challenge.Documents && challenge.Documents.length === 0 && allowDownloads">
      <strong>None</strong>
    </li>
    <li ng-if="!allowDownloads">
      <strong>Downloads are no longer available for this challenge</strong>
    </li>
    <li ng-if="!challenge.Documents && allowDownloads && isLoggedIn">
      <strong>Register to Download Files (if available)</strong>
    </li>
    <li ng-if="!challenge.Documents && allowDownloads && !isLoggedIn">
      <strong>Log In and Register to Download Files <br>(if available)</strong>
    </li>
  </ul>
</div>
