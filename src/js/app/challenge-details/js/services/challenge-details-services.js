/**
 * This code is copyright (c) 2015 Topcoder Corporation
 *
 * Changes in version 1.1 (topcoder new community site - Removal proxied API calls):
 * - Removed LC related conditionals and calls
 * - Replaced ajaxUrl with direct calls to api
 *
 * author: TCSASSEMBLER
 * version 1.1
 */
/* TODO:
 * - bring up to style guide standards
 * - rename file to service name
 */

(function () {

  angular
    .module('challengeDetails.services', [])
    .factory('ChallengeService', ChallengeService);

  ChallengeService.$inject = ['Restangular', 'API_URL', '$q', '$cookies']

  /**
   * Geting challenge information
   *
   * @param Restangular
   * @param API_URL
   * @param $q
   * @returns {*}
   * @constructor
   */
  function ChallengeService(Restangular, API_URL, $q, $cookies) {

    var service = Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(API_URL);
      if ($cookies.tcjwt) {
        RestangularConfigurer.setDefaultHeaders({
          'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")
        });
      }
    });

    var servicev3 = Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(tcconfig.api3URL);
      if ($cookies.tcjwt) {
        RestangularConfigurer.setDefaultHeaders({
          'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")
        });
      }
    });

    /**
     *
     * @param id
     * @returns {ng.IPromise<T>}
     */
    service.getResults = function(id) {
      var defer = $q.defer();

      //challengeType is a global variable.
      service
        .one(challengeType)
        .one('challenges')
        .one('result', id)
        .getList()
        .then(function(results) {
        results = results[0];
        var submissionMap = {};
        var leftovers = []; // for those that got a score of 0
        results.results.map(function(x) {
          if (x.placement == 'n/a' || !x.placement || x.submissionStatus == 'Failed Review') {
            leftovers.push(x);
          } else {
            submissionMap[x.placement] = x;
          }
        });
        results.firstPlaceSubmission = submissionMap[1];
        results.secondPlaceSubmission = submissionMap[2];
        results.numSubmissions = results.submissions;
        results.submissions = [];
        var i = 1;
        while (submissionMap[i]) {
          results.submissions.push(submissionMap[i]);
          i++;
        }
        while (leftovers.length > 0) {
          results.submissions.push(leftovers.pop());
        }
        leftovers.reverse();
        results.initialScoreSum = 0;
        results.finalScoreSum = 0;
        results.submissions.map(function(x) {
          results.initialScoreSum += x.initialScore;
          results.finalScoreSum += x.finalScore;
        });

        defer.resolve(results);
      });
      return defer.promise;
    };

    service.getPeerReviewResults = function(id) {
      var defer = $q.defer();

      servicev3
        .one('challenges', id)
        .one('results')
        .getList().then(function(data) {
          data = data[0].result.content
          if (data.error) {
            defer.resolve(false);
          }
          defer.resolve(data);
        });

        return defer.promise;
    };

    /**
     *
     * @param id
     * @returns {ng.IPromise<T>}
     */
    service.getCheckpointData = function(id) {
      var defer = $q.defer();

      service
        .one(challengeType)
        .one('challenges')
        .one('checkpoint', id)
        .getList()
        .then(function(data) {
          data = data[0];
          if (data.error) {
            defer.resolve(false);
          }
          defer.resolve(data);
        });

      return defer.promise;
    };

    /**
     * Get challenge data
     * @param id
     * @returns {ng.IPromise<T>}
     */
    service.getChallenge = function(id) {
      var defer = $q.defer();
      service
        .one(challengeType)
        .one('challenges')
        .getList(id, {refresh: 't'})
        .then(function(challenge) {
        challenge = challenge[0];
        challenge.registrants = challenge.registrants || [];
        challenge.submissions = challenge.submissions || [];

        if (challenge.event) {
          if (challenge.event.shortDescription == 'tc015') {
            challenge.event.url = 'http://tco15.topcoder.com/';
          } else if (challenge.event.shortDescription == 'tco16') {
            challenge.event.url = 'http://tco16.topcoder.com/';
          } else if (challenge.event.shortDescription == 'tco17') {
            challenge.event.url = 'http://tco17.topcoder.com/';
          } else if (challenge.event.shortDescription == 'swiftprogram') {
            challenge.event.url = 'http://ios.topcoder.com';
          } else {
            challenge.event.url = tcconfig.communityURL + '/' + challenge.event.shortDescription;
          }
        }

        var submissionMap = {};
        challenge.submissions.map(function(submission) {
          if (submissionMap[submission.handle || submission.submitter]) {
            var neu = moment(submission.submissionDate || submission.submissionTime);
            var alt = moment(submissionMap[submission.handle || submission.submitter]);
            if (neu > alt) {
              submissionMap[submission.handle || submission.submitter] = submission.submissionDate || submission.submissionTime;
            }
          } else {
            submissionMap[submission.handle || submission.submitter] = submission.submissionDate || submission.submissionTime;
          }
        });

        challenge.registrants.map(function(x) {
          //initialize submissionStatus on all registrants
          x.submissionStatus = '';
        });
        //bugfix: refactored-challenge-details-68: copy submissionStatus here for all registered users last submissions into registrants object for easy access
        challenge.registrants.map(function(x) {
          challenge.submissions.map(function(y) {
            if (x.handle == y.handle && x.lastSubmissionDate == y.submissionDate) {
              x.submissionStatus = y.submissionStatus;
            }
          });
        });

        if (challenge.allowStockArt) {
          challenge.allowStockArt = challenge.allowStockArt == 'true';
        }

        challenge.submitDisabled = true;

        var handleMap = {};
        challenge.registrants.map(function(x) {
          handleMap[x.handle] = true;
        });

        // Initialize Documents, if not comming
        if (typeof challenge.Documents === 'undefined') {
          challenge.Documents = [];
        }

        defer.resolve(challenge);
      });

      return defer.promise;
    };

    /**
     * Registers or unregisters the user for challenge.
     * @param {String} challengeId Challenge ID.
     * @param {String} action The action, MUST be either 'register' or
     *    'unregister'.
     * @returns {Promise}
     */
    function _challengeRegistrationAction(challengeId, action) {
      var defer = $q.defer();

      var tcjwt = getCookie('tcjwt');
      if (!tcjwt) {
        defer.resolve({'error':{'details':'Internal error. Try to login again.'}});
      }

      service
        .one('challenges', challengeId)
        .post(action)
        .then(function(response) {
          defer.resolve(response);
        }, function(reason) {
          defer.reject(reason['data']);
        });

      return defer.promise;
    }

    /**
     *
     * @param id
     * @returns {promise}
     */
    service.registerToChallenge = function(id) {
      return _challengeRegistrationAction(id, 'register');
    };

    /**
     * Unregisters from challenge.
     * @param id Challenge ID.
     * @returns {promise}
     */
    service.unregisterFromChallenge = function(id) {
      return _challengeRegistrationAction(id, 'unregister');
    };

    /**
     *
     * @param id
     * @param challengeType
     * @returns {promise}
     */
    service.getDocuments = function(id, challengeType) {
      var defer = $q.defer();

      var tcjwt = getCookie('tcjwt');
      if (!tcjwt) {
        defer.resolve({'error':{'details':'Internal error. Try to login again.'}});
      }

      service
        .one(challengeType)
        .one('challenges')
        .getList(id, {refresh: 't'})
        .then(function(response) {
          challenge = response[0];
          defer.resolve(challenge);
        });

      return defer.promise;
    };

    return service;
  }

})();
