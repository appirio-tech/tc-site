'use strict';

tcapp.factory('Challenges', function(Restangular) {
  return Restangular.service('challenges');
});

tcapp.controller('ChallengesCtrl', ['$scope', 'Challenges', function($scope, challenges) {
  $scope.challenges = [];
  $scope.gridOptions = {
    data: 'challenges',
    columnDefs: [ //@TODO replace with row template
      {
        field: 'challengeName',
        displayName: 'Challenges'
      },
      {
        field: 'challengeType',
        displayName: 'Type'
        // @TODO add template
      },
      { // @TODO replace with "Timeline"
        field: 'postingDate',
        displayName: 'Timeline'
      },
      { // @TODO format of "timeleft"
        field: 'currentPhaseRemainingTime',
        displayName: 'Time Left'
      },
      {
        field: 'currentPhaseName',
        displayName: 'Current Phase'
      },
      {
        field: 'numRegistrants',
        displayName: 'Registrants'
      },
      {
        field: 'numSubmissions',
        displayName: 'Submissions'
      }
    ]
  };
  challenges.getList().then(function(challenges) {
    console.log('hi');
    console.log(challenges);
    $scope.challenges = challenges;
  });
}]);