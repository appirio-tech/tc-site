/*jshint -W069 */
/*global angular:false */
angular.module('challenge-consumer', [])
    .factory('Challenge', ['$q', '$http', '$rootScope', function($q, $http, $rootScope) {
      'use strict';

      /**
       * API to host challenge, requirements, scorecard and results
       * @class " || Challenge || "
       * @param {string} domain - The project domain
       * @param {string} cache - An angularjs cache implementation
       */
      return function(domain, cache) {

        if (typeof(domain) !== 'string') {
          throw new Error('Domain parameter must be specified as a string.');
        }

        this.$on = function($scope, path, handler) {
          var url = domain + path;
          $scope.$on(url, function() {
            handler();
          });
          return this;
        };

        this.$broadcast = function(path) {
          var url = domain + path;
          //cache.remove(url);
          $rootScope.$broadcast(url);
          return this;
        };

        /**
         * get all the challenges
         * @method
         * @name Challenge#getChallenges
         * @param {{string}} filter - {fieldName1}={fieldValue1}&...{fieldNameN}>{fieldValueN}. String value needs to be surrounded by single quotation(‘). fieldValue can contain multiple values using in() format {fieldName}=in({fieldValue1},{fieldValue1}). Operations can be =, > or <.  < and > operations are only for number, integers and dates
         * @param {{integer}} limit - maximum number of records to return
         * @param {{integer}} offset - id to start return values
         * @param {{string}} orderBy - field name to sort {asc [nulls {first | last} ] | desc  [nulls {first | last} }
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallenges = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges';

          var body;
          var queryParameters = {};
          var headers = {};

          if (parameters['filter'] !== undefined) {
            queryParameters['filter'] = parameters['filter'];
          }

          if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
          }

          if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
          }

          if (parameters['orderBy'] !== undefined) {
            queryParameters['orderBy'] = parameters['orderBy'];
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Create a new challenge
         * @method
         * @name Challenge#postChallenges
         * @param {{}} body - API to host challenge, requirements, scorecard and results
         *
         */
        this.postChallenges = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges';

          var body;
          var queryParameters = {};
          var headers = {};

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'POST',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get a challenge
         * @method
         * @name Challenge#getChallengesByChallengeId
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Update a challenge
         * @method
         * @name Challenge#putChallengesByChallengeId
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{}} body - API to host challenge, requirements, scorecard and results
         *
         */
        this.putChallengesByChallengeId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'PUT',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Delete a challenge
         * @method
         * @name Challenge#deleteChallengesByChallengeId
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         *
         */
        this.deleteChallengesByChallengeId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'DELETE',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Add a new file to the challenge
         * @method
         * @name Challenge#postChallengesByChallengeIdFiles
         * @param {{integer}} challengeId - the id of the challenge
         * @param {{}} body - body of post
         *
         */
        this.postChallengesByChallengeIdFiles = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/files';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'POST',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get files assoicated to a challenge
         * @method
         * @name Challenge#getChallengesByChallengeIdFiles
         * @param {{integer}} challengeId - the id for the challenge to add the participant to
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdFiles = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/files';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get the metadata information for a file
         * @method
         * @name Challenge#getChallengesByChallengeIdFilesByFileId
         * @param {{integer}} challengeId - The Challenge Id
         * @param {{integer}} fileId - The Id of the file
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdFilesByFileId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/files/{fileId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{fileId}', parameters['fileId']);

          if (parameters['fileId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: fileId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Update a file
         * @method
         * @name Challenge#putChallengesByChallengeIdFilesByFileId
         * @param {{integer}} challengeId - The Challenge Id
         * @param {{integer}} fileId - The Id of the file
         * @param {{}} body - API to host challenge, requirements, scorecard and results
         *
         */
        this.putChallengesByChallengeIdFilesByFileId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/files/{fileId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{fileId}', parameters['fileId']);

          if (parameters['fileId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: fileId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'PUT',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Delete a file
         * @method
         * @name Challenge#deleteChallengesByChallengeIdFilesByFileId
         * @param {{integer}} challengeId - The Challenge Id
         * @param {{integer}} fileId - The Id of the file
         *
         */
        this.deleteChallengesByChallengeIdFilesByFileId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/files/{fileId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{fileId}', parameters['fileId']);

          if (parameters['fileId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: fileId'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'DELETE',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Add a new participant to a challenge
         * @method
         * @name Challenge#postChallengesByChallengeIdParticipants
         * @param {{integer}} challengeId - the id for the challenge to add the participant to
         * @param {{}} body - body of post
         *
         */
        this.postChallengesByChallengeIdParticipants = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/participants';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'POST',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get all participants for a challenge
         * @method
         * @name Challenge#getChallengesByChallengeIdParticipants
         * @param {{integer}} challengeId - the id for the challenge to add the participant to
         * @param {{string}} role - The role to filter the results by
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdParticipants = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/participants';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters['role'] !== undefined) {
            queryParameters['role'] = parameters['role'];
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get the metadata information for a participant
         * @method
         * @name Challenge#getChallengesByChallengeIdParticipantsByParticipantId
         * @param {{integer}} challengeId - The Challenge Id
         * @param {{integer}} participantId - The Id of the participant
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdParticipantsByParticipantId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/participants/{participantId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{participantId}', parameters['participantId']);

          if (parameters['participantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Update the relationship from a user to a challenge
         * @method
         * @name Challenge#putChallengesByChallengeIdParticipantsByParticipantId
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{integer}} participantId - API to host challenge, requirements, scorecard and results
         * @param {{}} body - API to host challenge, requirements, scorecard and results
         *
         */
        this.putChallengesByChallengeIdParticipantsByParticipantId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/participants/{participantId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{participantId}', parameters['participantId']);

          if (parameters['participantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'PUT',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Remove a participant from a challenge
         * @method
         * @name Challenge#deleteChallengesByChallengeIdParticipantsByParticipantId
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{integer}} participantId - API to host challenge, requirements, scorecard and results
         *
         */
        this.deleteChallengesByChallengeIdParticipantsByParticipantId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/participants/{participantId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{participantId}', parameters['participantId']);

          if (parameters['participantId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: participantId'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'DELETE',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Submit to a challenge
         * @method
         * @name Challenge#postChallengesByChallengeIdSubmissions
         * @param {{integer}} challengeId - the id for the challenge to create a scorecard for
         * @param {{}} body - body of post
         *
         */
        this.postChallengesByChallengeIdSubmissions = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/submissions';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'POST',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get the submissions for a challenge
         * @method
         * @name Challenge#getChallengesByChallengeIdSubmissions
         * @param {{integer}} challengeId - the id for the challenge to add the participant to
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdSubmissions = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/submissions';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get the metadata information for a submission
         * @method
         * @name Challenge#getChallengesByChallengeIdSubmissionsBySubmissionId
         * @param {{integer}} challengeId - The Challenge Id
         * @param {{integer}} submissionId - The Id of the submission
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdSubmissionsBySubmissionId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/submissions/{submissionId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{submissionId}', parameters['submissionId']);

          if (parameters['submissionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: submissionId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Update the submission
         * @method
         * @name Challenge#putChallengesByChallengeIdSubmissionsBySubmissionId
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{integer}} submissionId - API to host challenge, requirements, scorecard and results
         * @param {{}} body - API to host challenge, requirements, scorecard and results
         *
         */
        this.putChallengesByChallengeIdSubmissionsBySubmissionId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/submissions/{submissionId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{submissionId}', parameters['submissionId']);

          if (parameters['submissionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: submissionId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'PUT',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Remove a submission from a challenge
         * @method
         * @name Challenge#deleteChallengesByChallengeIdSubmissionsBySubmissionId
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{integer}} submissionId - API to host challenge, requirements, scorecard and results
         *
         */
        this.deleteChallengesByChallengeIdSubmissionsBySubmissionId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/submissions/{submissionId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{submissionId}', parameters['submissionId']);

          if (parameters['submissionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: submissionId'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'DELETE',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Add a new file to the challenge
         * @method
         * @name Challenge#postChallengesByChallengeIdSubmissionsBySubmissionIdFiles
         * @param {{integer}} challengeId - the id of the challenge
         * @param {{integer}} submissionId - the id of the challenge
         * @param {{}} body - body of post
         *
         */
        this.postChallengesByChallengeIdSubmissionsBySubmissionIdFiles = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/submissions/{submissionId}/files';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{submissionId}', parameters['submissionId']);

          if (parameters['submissionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: submissionId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'POST',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get files assoicated to a challenge
         * @method
         * @name Challenge#getChallengesByChallengeIdSubmissionsBySubmissionIdFiles
         * @param {{integer}} challengeId - the id for the challenge to add the participant to
         * @param {{integer}} submissionId - the id of the challenge
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdSubmissionsBySubmissionIdFiles = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/submissions/{submissionId}/files';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{submissionId}', parameters['submissionId']);

          if (parameters['submissionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: submissionId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get the metadata information for a file
         * @method
         * @name Challenge#getChallengesByChallengeIdSubmissionsBySubmissionIdFilesByFileId
         * @param {{integer}} challengeId - The Challenge Id
         * @param {{integer}} submissionId - the id of the challenge
         * @param {{integer}} fileId - The Id of the file
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdSubmissionsBySubmissionIdFilesByFileId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/submissions/{submissionId}/files/{fileId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{submissionId}', parameters['submissionId']);

          if (parameters['submissionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: submissionId'));
            return deferred.promise;
          }

          path = path.replace('{fileId}', parameters['fileId']);

          if (parameters['fileId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: fileId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Update a file
         * @method
         * @name Challenge#putChallengesByChallengeIdSubmissionsBySubmissionIdFilesByFileId
         * @param {{integer}} challengeId - The Challenge Id
         * @param {{integer}} submissionId - the id of the challenge
         * @param {{integer}} fileId - The Id of the file
         * @param {{}} body - API to host challenge, requirements, scorecard and results
         *
         */
        this.putChallengesByChallengeIdSubmissionsBySubmissionIdFilesByFileId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/submissions/{submissionId}/files/{fileId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{submissionId}', parameters['submissionId']);

          if (parameters['submissionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: submissionId'));
            return deferred.promise;
          }

          path = path.replace('{fileId}', parameters['fileId']);

          if (parameters['fileId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: fileId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'PUT',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Delete a file
         * @method
         * @name Challenge#deleteChallengesByChallengeIdSubmissionsBySubmissionIdFilesByFileId
         * @param {{integer}} challengeId - The Challenge Id
         * @param {{integer}} submissionId - the id of the challenge
         * @param {{integer}} fileId - The Id of the file
         *
         */
        this.deleteChallengesByChallengeIdSubmissionsBySubmissionIdFilesByFileId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/submissions/{submissionId}/files/{fileId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{submissionId}', parameters['submissionId']);

          if (parameters['submissionId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: submissionId'));
            return deferred.promise;
          }

          path = path.replace('{fileId}', parameters['fileId']);

          if (parameters['fileId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: fileId'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'DELETE',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Create a new requirement on a challenge
         * @method
         * @name Challenge#postChallengesByChallengeIdRequirements
         * @param {{integer}} challengeId - the id for the challenge to create a scorecard for
         * @param {{}} body - body of post
         *
         */
        this.postChallengesByChallengeIdRequirements = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/requirements';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'POST',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get all the requirements for a particular challenge
         * @method
         * @name Challenge#getChallengesByChallengeIdRequirements
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdRequirements = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/requirements';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get the requirements details
         * @method
         * @name Challenge#getChallengesByChallengeIdRequirementsByRequirementId
         * @param {{integer}} challengeId - The Challenge Id
         * @param {{integer}} requirementId - The Id of the requirement
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdRequirementsByRequirementId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/requirements/{requirementId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{requirementId}', parameters['requirementId']);

          if (parameters['requirementId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: requirementId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Update a requirement
         * @method
         * @name Challenge#putChallengesByChallengeIdRequirementsByRequirementId
         * @param {{integer}} challengeId - The Challenge Id
         * @param {{integer}} requirementId - The Id of the requirement
         * @param {{}} body - API to host challenge, requirements, scorecard and results
         *
         */
        this.putChallengesByChallengeIdRequirementsByRequirementId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/requirements/{requirementId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{requirementId}', parameters['requirementId']);

          if (parameters['requirementId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: requirementId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'PUT',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Delete a requirement
         * @method
         * @name Challenge#deleteChallengesByChallengeIdRequirementsByRequirementId
         * @param {{integer}} challengeId - The Challenge Id
         * @param {{integer}} requirementId - The Id of the requirement
         *
         */
        this.deleteChallengesByChallengeIdRequirementsByRequirementId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/requirements/{requirementId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{requirementId}', parameters['requirementId']);

          if (parameters['requirementId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: requirementId'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'DELETE',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Creates a new scorecard
         * @method
         * @name Challenge#postChallengesByChallengeIdScorecards
         * @param {{integer}} challengeId - the id for the challenge to create a scorecard for
         * @param {{}} body - body of post
         *
         */
        this.postChallengesByChallengeIdScorecards = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/scorecards';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'POST',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get all the scorecards for a particular challenge
         * @method
         * @name Challenge#getChallengesByChallengeIdScorecards
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         * @param {{string}} filter - {fieldName1}={fieldValue1}&...{fieldNameN}>{fieldValueN}. String value needs to be surrounded by single quotation(‘). fieldValue can contain multiple values using in() format {fieldName}=in({fieldValue1},{fieldValue1}). Operations can be =, > or <.  < and > operations are only for number, integers and dates
         *
         */
        this.getChallengesByChallengeIdScorecards = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/scorecards';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters['filter'] !== undefined) {
            queryParameters['filter'] = parameters['filter'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get a scorecard
         * @method
         * @name Challenge#getChallengesByChallengeIdScorecardsByScorecardId
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{integer}} scorecardId - API to host challenge, requirements, scorecard and results
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdScorecardsByScorecardId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/scorecards/{scorecardId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{scorecardId}', parameters['scorecardId']);

          if (parameters['scorecardId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: scorecardId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Delete a scorecard
         * @method
         * @name Challenge#deleteChallengesByChallengeIdScorecardsByScorecardId
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{integer}} scorecardId - API to host challenge, requirements, scorecard and results
         *
         */
        this.deleteChallengesByChallengeIdScorecardsByScorecardId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/scorecards/{scorecardId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{scorecardId}', parameters['scorecardId']);

          if (parameters['scorecardId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: scorecardId'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'DELETE',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Update a scorecard
         * @method
         * @name Challenge#putChallengesByChallengeIdScorecardsByScorecardId
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{integer}} scorecardId - API to host challenge, requirements, scorecard and results
         * @param {{}} body - API to host challenge, requirements, scorecard and results
         *
         */
        this.putChallengesByChallengeIdScorecardsByScorecardId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/scorecards/{scorecardId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{scorecardId}', parameters['scorecardId']);

          if (parameters['scorecardId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: scorecardId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'PUT',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Retrieve all scorecard items for a scorecard
         * @method
         * @name Challenge#getChallengesByChallengeIdScorecardsByScorecardIdScorecardItems
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{integer}} scorecardId - API to host challenge, requirements, scorecard and results
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdScorecardsByScorecardIdScorecardItems = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/scorecards/{scorecardId}/scorecardItems';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{scorecardId}', parameters['scorecardId']);

          if (parameters['scorecardId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: scorecardId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Generates a scorecard item for each requirement of a challenge
         * @method
         * @name Challenge#postChallengesByChallengeIdScorecardsByScorecardIdScorecardItems
         * @param {{integer}} challengeId - API to host challenge, requirements, scorecard and results
         * @param {{integer}} scorecardId - API to host challenge, requirements, scorecard and results
         * @param {{}} body - API to host challenge, requirements, scorecard and results
         *
         */
        this.postChallengesByChallengeIdScorecardsByScorecardIdScorecardItems = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/scorecards/{scorecardId}/scorecardItems';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{scorecardId}', parameters['scorecardId']);

          if (parameters['scorecardId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: scorecardId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'POST',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Get a scorecard item
         * @method
         * @name Challenge#getChallengesByChallengeIdScorecardsByScorecardIdScorecardItemsByScorecardItemId
         * @param {{integer}} challengeId - id of challenge
         * @param {{integer}} scorecardId - id of scorecard
         * @param {{integer}} scorecardItemId - id of scorecardItem
         * @param {{string}} fields - partial fields that need to be response. Support (1) comma-separated field list and (2) a/b nested selection.
         *
         */
        this.getChallengesByChallengeIdScorecardsByScorecardIdScorecardItemsByScorecardItemId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/scorecards/{scorecardId}/scorecardItems/{scorecardItemId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{scorecardId}', parameters['scorecardId']);

          if (parameters['scorecardId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: scorecardId'));
            return deferred.promise;
          }

          path = path.replace('{scorecardItemId}', parameters['scorecardItemId']);

          if (parameters['scorecardItemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: scorecardItemId'));
            return deferred.promise;
          }

          if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          var cached = parameters.$cache && parameters.$cache.get(url);
          if (cached !== undefined && parameters.$refresh !== true) {
            deferred.resolve(cached);
            return deferred.promise;
          }
          $http({
            timeout: parameters.$timeout,
            method: 'GET',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Update a scorecard item
         * @method
         * @name Challenge#putChallengesByChallengeIdScorecardsByScorecardIdScorecardItemsByScorecardItemId
         * @param {{integer}} challengeId - id of challenge
         * @param {{integer}} scorecardId - id of scorecard
         * @param {{integer}} scorecardItemId - API to host challenge, requirements, scorecard and results
         * @param {{}} body - API to host challenge, requirements, scorecard and results
         *
         */
        this.putChallengesByChallengeIdScorecardsByScorecardIdScorecardItemsByScorecardItemId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/scorecards/{scorecardId}/scorecardItems/{scorecardItemId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{scorecardId}', parameters['scorecardId']);

          if (parameters['scorecardId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: scorecardId'));
            return deferred.promise;
          }

          path = path.replace('{scorecardItemId}', parameters['scorecardItemId']);

          if (parameters['scorecardItemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: scorecardItemId'));
            return deferred.promise;
          }

          if (parameters.body !== undefined) {
            body = parameters['body'];
          }

          if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'PUT',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
        /**
         * Delete a scorecard item deleted
         * @method
         * @name Challenge#deleteChallengesByChallengeIdScorecardsByScorecardIdScorecardItemsByScorecardItemId
         * @param {{integer}} challengeId - id of challenge
         * @param {{integer}} scorecardId - id of scorecard
         * @param {{integer}} scorecardItemId - API to host challenge, requirements, scorecard and results
         *
         */
        this.deleteChallengesByChallengeIdScorecardsByScorecardIdScorecardItemsByScorecardItemId = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/challenges/{challengeId}/scorecards/{scorecardId}/scorecardItems/{scorecardItemId}';

          var body;
          var queryParameters = {};
          var headers = {};

          path = path.replace('{challengeId}', parameters['challengeId']);

          if (parameters['challengeId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: challengeId'));
            return deferred.promise;
          }

          path = path.replace('{scorecardId}', parameters['scorecardId']);

          if (parameters['scorecardId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: scorecardId'));
            return deferred.promise;
          }

          path = path.replace('{scorecardItemId}', parameters['scorecardItemId']);

          if (parameters['scorecardItemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: scorecardItemId'));
            return deferred.promise;
          }

          if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                  var parameter = parameters.$queryParameters[parameterName];
                  queryParameters[parameterName] = parameter;
                });
          }

          var url = domain + path;
          $http({
            timeout: parameters.$timeout,
            method: 'DELETE',
            url: url,
            params: queryParameters,
            data: body,
            headers: headers
          })
              .success(function(data, status, headers, config) {
                deferred.resolve(data);
                if (parameters.$cache !== undefined) {
                  parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                }
              })
              .error(function(data, status, headers, config) {
                deferred.reject({
                  status: status,
                  headers: headers,
                  config: config,
                  body: data
                });
              });

          return deferred.promise;
        };
      };
    }]);