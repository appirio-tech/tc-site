/*global angular: true */
/**
 * Changelog
 * 09/17/2014 Add My Challenges Filter and Improve Filters
 * - Added My Role column, active if displaying user challenges
*/
(function (angular) {
  'use strict';
  var challengesService = angular.module('tc.challenges.services');

  challengesService.factory('GridService', [
    function () {
      
      function getChallengeNameWidth(contest) {
        if (!contest.isUserChallenges && contest.contestType !== 'design') {
          return 400;
        }
        if (contest.isUserChallenges && contest.contestType !== 'design') {
          return 340;
        }
        if (!contest.isUserChallenges) {
          return 340;
        }
        return 300;
      }

      function colums(contest) {
        return [
          {
            field: 'challengeName',
            fieldName: 'Challenge',
            width: getChallengeNameWidth(contest)
          },
          /*{
            field: 'challengeType',
            fieldName: 'Type',
            width: 45
          },*/
          {
            field: 'registrationStartDate',
            fieldName: 'Timeline',
            minWidth: 184,
            width: 210,
            maxWidth: 210,
            tplName: 'timeline'
          },
          {
            field: 'registrationStartDate',
            fieldName: 'Duration (days)',
            width: 127,
            tplName: 'duration',
            visible: contest.listType === 'upcoming'
          },
          {
            field: 'currentPhaseRemainingTime',
            fieldName: 'Time Left',
            width: 80,
            visible: contest.listType === 'active'
          },
          {
            field: 'totalPrize',
            fieldName: 'Prize',
            width: 73,
            tplName: 'prizes'
          },
          {
            field: 'currentPhaseName',
            fieldName: 'Current Phase',
            minWidth: contest.isUserChallenges ? 70 : 77,
            width: 90,
            maxWidth: 130,
            visible: contest.listType === 'active'
          },
          {
            field: 'numRegistrants',
            fieldName: 'Registrants',
            width: contest.isUserChallenges ? 64 : 74,
            minWidth: 64,
            maxWidth: 90,
            visible: contest.listType !== 'upcoming'
          },
          {
            field: 'numSubmissions',
            fieldName: 'Submissions',
            width: contest.isUserChallenges ? 70 : 74,
            minWidth: 70,
            maxWidth: 74,
            visible: contest.listType === 'active'
          },
          {
            field: 'numSubmissions',
            fieldName: 'Eligible Submissions',
            width: 120,
            minWidth: 120,
            visible: contest.listType === 'past'
          },

          {
            field: 'chalengeId',
            fieldName: 'Winners',
            width: 90,
            minWidth: 90,
            tplName: 'winners',
            visible: contest.listType === 'past'
          },
          {
            field: 'isPrivate',
            fieldName: 'Public/Private',
            minWidth: 104,
            width: 104,
            visible: contest.listType === 'past'
          },
          {
            field: 'status',
            fieldName: 'Status',
            width: 242,
            visible: contest.listType === 'upcoming'
          },
          {
            field: 'roles',
            fieldName: 'My Role',
            width: 80,
            visible: contest.isUserChallenges === true
          }
        ];
      }

      function fieldTpl(fieldName) {
        return 'tableView/' + fieldName + '.html';
      }

      function toDef(fieldDef) {
        var tplName = fieldDef.tplName || fieldDef.field;

        return {
          field: fieldDef.field,
          displayName: fieldDef.fieldName,
          sortable: true,
          resizable: false,
          enableCellEdit: false,
          pinnable: false,
          visible: typeof fieldDef.visible === 'undefined' ? true : fieldDef.visible,
          width: fieldDef.width,
          minWidth: fieldDef.minWidth,
          cellTemplate: fieldTpl(tplName)
        };
      }

      function getDefinitions(contest) {
        return colums(contest).map(function (col) {
          return toDef(col);
        });
      }

      function getGridOptions(definitionsName, contest) {
        return {
          data: 'challenges',
          headerRowTemplate: 'tableView/header.html',
          rowTemplate: 'tableView/row.html',
          headerRowHeight: 43,
          enableHighlighting: true,
          rowHeight: contest.contestType !== 'data' ? 140 : 70,
          columnDefs: definitionsName,
          enableRowSelection: false,
          useExternalSorting: true,
          enableColumnResize: false,
          virtualizationThreshold: 2000 //need to set this high because if number of rows exceeds this number then table breaks and only 6 rows will display in browser

        };
      }

      return {
        definitions: getDefinitions,
        gridOptions: getGridOptions
      };
    }]);
}(angular));
