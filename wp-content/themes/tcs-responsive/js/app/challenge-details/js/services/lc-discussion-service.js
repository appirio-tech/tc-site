/*jshint -W069 */
/*global angular:false */

(function () {
  angular.module('lc.services', ['ngCookies'])
      .factory('DiscussionService', ['$q', '$http', '$rootScope', '$cookies', function($q, $http, $rootScope, $cookies) {
        'use strict';

        /**
         *
         * @class " || lc.DiscussionService || "
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
           * Create a new discusion
           * @method
           * @name lc.DiscussionService#postDiscussions
           * @param {{}} body -
           *
           */
          this.postDiscussions = function(parameters) {
            if (parameters === undefined) {
              parameters = {};
            }
            var deferred = $q.defer();

            var path = '/discussions';

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

            if ($cookies.tcjwt) {
              headers.Authorization = 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "");
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
           * Get Discussions
           * @method
           * @name lc.DiscussionService#getDiscussions
           * @param {{string}} filter - {fieldName1}={fieldValue1}&...{fieldNameN}>{fieldValueN}. String value needs to be surrounded by single quotation(‘). fieldValue can contain multiple values using in() format {fieldName}=in({fieldValue1},{fieldValue2}). Operations can be =, > or <.  < and > operations are only for number, integers and dates
           * @param {{integer}} limit - maximum number of records to return
           * @param {{integer}} offset - id to start return values
           * @param {{string}} orderBy - field name to sort {asc [nulls {first | last} ] | desc  [nulls {first | last} }
           *
           */
          this.getDiscussions = function(parameters) {
            if (parameters === undefined) {
              parameters = {};
            }
            var deferred = $q.defer();

            var path = '/discussions';

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

            if (parameters.$queryParameters) {
              Object.keys(parameters.$queryParameters)
                  .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                  });
            }

            if ($cookies.tcjwt) {
              headers.Authorization = 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "");
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
           * Get a discussion
           * @method
           * @name lc.DiscussionService#getDiscussionsByDiscussionId
           * @param {{integer}} discussionId - Id of discussion
           *
           */
          this.getDiscussionsByDiscussionId = function(parameters) {
            if (parameters === undefined) {
              parameters = {};
            }
            var deferred = $q.defer();

            var path = '/discussions/{discussionId}';

            var body;
            var queryParameters = {};
            var headers = {};

            path = path.replace('{discussionId}', parameters['discussionId']);

            if (parameters['discussionId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: discussionId'));
              return deferred.promise;
            }

            if (parameters.$queryParameters) {
              Object.keys(parameters.$queryParameters)
                  .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                  });
            }

            if ($cookies.tcjwt) {
              headers.Authorization = 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "");
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
           * Create a Message
           * @method
           * @name lc.DiscussionService#postDiscussionsByDiscussionIdMessages
           * @param {{integer}} discussionId - Id of discussion
           * @param {{}} body -
           *
           */
          this.postDiscussionsByDiscussionIdMessages = function(parameters) {
            if (parameters === undefined) {
              parameters = {};
            }
            var deferred = $q.defer();

            var path = '/discussions/{discussionId}/messages';

            var body;
            var queryParameters = {};
            var headers = {};

            path = path.replace('{discussionId}', parameters['discussionId']);

            if (parameters['discussionId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: discussionId'));
              return deferred.promise;
            }

            if (parameters.body !== undefined) {
              body = parameters['body'];
            }

            if (parameters['body'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: body'));
              return deferred.promise;
            }

            if ($cookies.tcjwt) {
              headers.Authorization = 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "");
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
           * Get all messages for a discussion
           * @method
           * @name lc.DiscussionService#getDiscussionsByDiscussionIdMessages
           * @param {{integer}} discussionId - Id of discussion
           *
           */
          this.getDiscussionsByDiscussionIdMessages = function(parameters) {
            if (parameters === undefined) {
              parameters = {};
            }
            var deferred = $q.defer();

            var path = '/discussions/{discussionId}/messages';

            var body;
            var queryParameters = {};
            var headers = {};

            path = path.replace('{discussionId}', parameters['discussionId']);

            if (parameters['discussionId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: discussionId'));
              return deferred.promise;
            }

            if (parameters.$queryParameters) {
              Object.keys(parameters.$queryParameters)
                  .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                  });
            }

            if ($cookies.tcjwt) {
              headers.Authorization = 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "");
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
           * Get a Message and it's children
           * @method
           * @name lc.DiscussionService#getDiscussionsByDiscussionIdMessagesByMessageId
           * @param {{integer}} discussionId - Id of discussion
           * @param {{integer}} messageId - Id of message
           *
           */
          this.getDiscussionsByDiscussionIdMessagesByMessageId = function(parameters) {
            if (parameters === undefined) {
              parameters = {};
            }
            var deferred = $q.defer();

            var path = '/discussions/{discussionId}/messages/{messageId}';

            var body;
            var queryParameters = {};
            var headers = {};

            path = path.replace('{discussionId}', parameters['discussionId']);

            if (parameters['discussionId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: discussionId'));
              return deferred.promise;
            }

            path = path.replace('{messageId}', parameters['messageId']);

            if (parameters['messageId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: messageId'));
              return deferred.promise;
            }

            if (parameters.$queryParameters) {
              Object.keys(parameters.$queryParameters)
                  .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                  });
            }

            if ($cookies.tcjwt) {
              headers.Authorization = 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "");
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
           * Update a message
           * @method
           * @name lc.DiscussionService#putDiscussionsByDiscussionIdMessagesByMessageId
           * @param {{integer}} discussionId - Id of discussion
           * @param {{integer}} messageId - Id of message
           * @param {{}} body -
           *
           */
          this.putDiscussionsByDiscussionIdMessagesByMessageId = function(parameters) {
            if (parameters === undefined) {
              parameters = {};
            }
            var deferred = $q.defer();

            var path = '/discussions/{discussionId}/messages/{messageId}';

            var body;
            var queryParameters = {};
            var headers = {};

            path = path.replace('{discussionId}', parameters['discussionId']);

            if (parameters['discussionId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: discussionId'));
              return deferred.promise;
            }

            path = path.replace('{messageId}', parameters['messageId']);

            if (parameters['messageId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: messageId'));
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

            if ($cookies.tcjwt) {
              headers.Authorization = 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "");
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
           * Delete a messsage
           * @method
           * @name lc.DiscussionService#deleteDiscussionsByDiscussionIdMessagesByMessageId
           * @param {{integer}} discussionId - Id of discussion
           * @param {{integer}} messageId - Id of message
           *
           */
          this.deleteDiscussionsByDiscussionIdMessagesByMessageId = function(parameters) {
            if (parameters === undefined) {
              parameters = {};
            }
            var deferred = $q.defer();

            var path = '/discussions/{discussionId}/messages/{messageId}';

            var body;
            var queryParameters = {};
            var headers = {};

            path = path.replace('{discussionId}', parameters['discussionId']);

            if (parameters['discussionId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: discussionId'));
              return deferred.promise;
            }

            path = path.replace('{messageId}', parameters['messageId']);

            if (parameters['messageId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: messageId'));
              return deferred.promise;
            }

            if (parameters.$queryParameters) {
              Object.keys(parameters.$queryParameters)
                  .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                  });
            }

            if ($cookies.tcjwt) {
              headers.Authorization = 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "");
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
           * Create a reply to a message.  The message ID path param will be used as the parent id for the message.
           * @method
           * @name lc.DiscussionService#postDiscussionsByDiscussionIdMessagesByMessageIdMessages
           * @param {{integer}} discussionId - Id of discussion
           * @param {{integer}} messageId - Id of message
           * @param {{}} body -
           *
           */
          this.postDiscussionsByDiscussionIdMessagesByMessageIdMessages = function(parameters) {
            if (parameters === undefined) {
              parameters = {};
            }
            var deferred = $q.defer();

            var path = '/discussions/{discussionId}/messages/{messageId}/messages';

            var body;
            var queryParameters = {};
            var headers = {};

            path = path.replace('{discussionId}', parameters['discussionId']);

            if (parameters['discussionId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: discussionId'));
              return deferred.promise;
            }

            path = path.replace('{messageId}', parameters['messageId']);

            if (parameters['messageId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: messageId'));
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

            if ($cookies.tcjwt) {
              headers.Authorization = 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "");
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
           * Get the child messages for a message
           * @method
           * @name lc.DiscussionService#getDiscussionsByDiscussionIdMessagesByMessageIdMessages
           * @param {{integer}} discussionId - Id of discussion
           * @param {{integer}} messageId - Id of message
           *
           */
          this.getDiscussionsByDiscussionIdMessagesByMessageIdMessages = function(parameters) {
            if (parameters === undefined) {
              parameters = {};
            }
            var deferred = $q.defer();

            var path = '/discussions/{discussionId}/messages/{messageId}/messages';

            var body;
            var queryParameters = {};
            var headers = {};

            path = path.replace('{discussionId}', parameters['discussionId']);

            if (parameters['discussionId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: discussionId'));
              return deferred.promise;
            }

            path = path.replace('{messageId}', parameters['messageId']);

            if (parameters['messageId'] === undefined) {
              deferred.reject(new Error('Missing required  parameter: messageId'));
              return deferred.promise;
            }

            if (parameters.$queryParameters) {
              Object.keys(parameters.$queryParameters)
                  .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                  });
            }

            if ($cookies.tcjwt) {
              headers.Authorization = 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "");
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
        };
      }]);
})();