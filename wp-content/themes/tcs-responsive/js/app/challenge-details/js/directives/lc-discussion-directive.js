'use strict';

/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

/*jslint nomen: true*/
/*global angular: true, _: true */
(function () {
  angular
    .module('lc.directives.discussion', ['lc.services.discussion', 'lc.services.user'])

  /**
   * The directive to display discussion and messages.
   *   Input parameters:
   *     - remoteObjectName: the name of remote object, provided from remote-object-name attribute value.
   *     - remoteObjectId: the id of remote object, provided from remote-object-id attribute value.
   *     - discussionUrl: the url of discussions service endpoint, ex) http://lc1-discussion-service.herokuapp.com/discussions,
   *            provided from the parent scope.
   */
    .directive('lcDiscussion', ['DiscussionService', 'UserService', function (DiscussionService, UserService) {
      return {
        restrict: 'E',
        scope: {
          remoteObjectKey: '@',
          remoteObjectId: '=',
          discussionUrl: '='
        },
        controller: function ($scope) {

          $scope.discussion = null;
          $scope.users = {};
          // $scope.messages = [];

          // create a Swagger client for discussion service
          var client = new DiscussionService($scope.discussionUrl);
          var userClient = new UserService(lcUserUrl);

          console.log($scope.remoteObjectId);
          // check a discussion exists for remoteObjectKey and remoteObjectId
          getDiscussionByRemoteObject($scope.remoteObjectKey, $scope.remoteObjectId)
            .then(function (discussion) {
              if (discussion) {
                $scope.discussion = discussion;
                return getAllMessagesInDiscussion(discussion.id);
              } else {
                $scope.booted = true;
              }
            })
            .then(function (messages) {
              if (messages) {
                $scope.messages = messages;

                var userIds = _.pluck(messages, 'authorId');
                return getUsers(userIds);
              } else {
                return [];
              }
            })
            .then(function(users) {
              _.forEach(users, function(user) {
                $scope.users[user.id] = user;
              });
            })
            .catch(function (err) {
              console.log('get discussion messages error: ', err);
            })
            .finally(function () {
              $scope.booted = true;
              if (!$scope.messages) {
                $scope.messages = [];
              }
            });

          $scope.addComment = function () {
            console.log('addComment is clicked, comment: ', $scope.comment);
            if ($scope.discussion) {
              // post the message to the existing discussion
              createMessageInDiscussion($scope.discussion.id, $scope.comment).then(function (message) {
                if (message) {
                  $scope.messages.push(message);
                }
              })
                .catch(function (err) {
                  console.log('create new message-1 error: ', err);
                })
                .finally(function () {
                  $scope.comment = '';
                });
            } else {
              // no discussion yet on this challenge, create a discussion first
              createDiscussion($scope.remoteObjectKey, $scope.remoteObjectId)
                .then(function (discussion) {
                  if (discussion) {
                    $scope.discussion = discussion;
                    return createMessageInDiscussion(discussion.id, $scope.comment);
                  }
                })
                .then(function (message) {
                  if (message) {
                    $scope.messages.push(message);
                  }
                })
                .catch(function (err) {
                  console.log('create new message-2 error: ', err);
                })
                .finally(function () {
                  $scope.comment = '';
                });
            }

          };

          // get a discussion by remote object key/id
          function getDiscussionByRemoteObject(remoteObjectKey, remoteObjectId) {
            var filter = 'remoteObjectKey=' + remoteObjectKey + '&remoteObjectId=' + remoteObjectId;
            var params = {filter: filter};
            // this should return one discussion.
            // DB schema needs an unique constraint on remoteObjectId in Discussion table to ensure only one discussion object returned.
            return client.getDiscussions(params).then(function (data) {
              if (data.content && data.content.length > 0) {
                return data.content[0];
              }
            });
          }

          // get all messages in a discussion
          function getAllMessagesInDiscussion(discussionId) {
            var params = {
              discussionId: discussionId,
              orderBy: 'createdAt'
            };
            return client.getDiscussionsByDiscussionIdMessages(params)
              .then(function (data) {
                return data.content;  // messages are in content property
              });
          }

          // create a discussion with remote object key/id
          function createDiscussion(remoteObjectKey, remoteObjectId) {
            var params = {
              body: {
                remoteObjectKey: remoteObjectKey,
                remoteObjectId: parseInt(remoteObjectId)
              }
            };
            return client.postDiscussions(params)
              .then(function (data) {
                return client.getDiscussionsByDiscussionId({discussionId: data.id});
              })
              .then(function (data) {
                return data.content;  // discussion is in content property
              });
          }

          // create a message in the discussion
          function createMessageInDiscussion(discussionId, message) {
            var params = {
              discussionId: discussionId,
              body: {
                content: message,
                useCurrentUserAsAuthor: true
              }
            };
            return client.postDiscussionsByDiscussionIdMessages(params)
              .then(function (data) {
                return client.getDiscussionsByDiscussionIdMessagesByMessageId({
                  discussionId: discussionId,
                  messageId: data.id
                });
              })
              .then(function (data) {
                return data.content;  // message is in content property
              });
          }

          function getUsers(users) {
            var params = {
              filter: 'id=in(' + users.join(',') + ')'
            };

            return userClient.getUsers(params)
              .then(function(data) {
                return data.users;
              });
          }
        },
        templateUrl: 'lc-discussion.html'
      };
    }]);
})();
