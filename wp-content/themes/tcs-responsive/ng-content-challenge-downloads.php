<h3>Downloads:</h3>
<div class="inner">
  <ul class="downloadDocumentList">
    <li ng-if="CD.challenge.Documents && CD.challenge.Documents.length > 1" ng-repeat="document in CD.challenge.Documents">
      <a href="{{document.url}}">{{document.documentName}}</a>
    </li>
    <li ng-if="CD.challenge.Documents && CD.challenge.Documents.length === 0">
      <strong>None</strong>
    </li>
    <li ng-if="!CD.challenge.Documents">
      <strong>Register to Download Files (if available)</strong>
    </li>
  </ul>
</div>
