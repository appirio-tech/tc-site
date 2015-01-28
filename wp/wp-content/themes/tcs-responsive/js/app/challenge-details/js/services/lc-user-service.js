/*jshint -W069 */
/*global angular:false */

(function () {
  angular.module('lc.services.user', ['ngCookies'])
    .factory('UserService', ['$q', '$http', '$rootScope', '$cookies', function($q, $http, $rootScope, $cookies) {
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
        this.postUser = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/user';

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
            headers.Authorization = 'Bearer ' + $cookies.tcjwt;
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
         *
         */
        this.getUsers = function(parameters) {
          if (parameters === undefined) {
            parameters = {};
          }
          var deferred = $q.defer();

          var path = '/users';

          var body;
          var queryParameters = {};
          var headers = {};

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

          if ($cookies.tcjwt) {
            headers.Authorization = 'Bearer ' + $cookies.tcjwt;
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