/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: ecnu_haozi
 * version 1.0
 */
'use strict';

angular.module('tc.SubmissionServices', [
  'restangular'
])

.factory('SubmissionServices', [ '$timeout', '$q',
  function ($timeout, $q) {

    return {
    /*
     * A mock implementation of submission data.
     */
      'getSubmissionInfo': function () {
        var deferred = $q.defer();

        // set some mock data.
        var submissionInfo = {};
        submissionInfo.comment = 'Lorem ipsum dolor sit amet conseqtetur adispicing elit orem ipsum dolor sit amet conseqtetur adispicing elit';
        submissionInfo.fonts=[{'name' : 'Arial'},{'name' : 'Tahoma'},{'name' : 'Helvetica'}];
        submissionInfo.stockArts = [
          {'link' : 'http://stockartlink.com/123451'},
          {'link' : 'http://stockartlink.com/123452'},
          {'link' : 'http://stockartlink.com/123453'},
          {'link' : 'http://stockartlink.com/123454'},
          {'link' : 'http://stockartlink.com/123455'},
          {'link' : 'http://stockartlink.com/123456'},
          {'link' : 'http://stockartlink.com/123457'}
        ];
        //Assume the network loading time is 1s.
        $timeout(function(){
          deferred.resolve(submissionInfo);
        }, 1000);

        return deferred.promise;
      }
    };
  }]
)

.factory('ImageService', ['$q',
    function ($q) {
        return {
          /*
           * Load several images asynchrous. The returned promise is resolved when all images
           * have a result, no matter fail or success. So the returned promise will always be
           * resolved.
          */

            'load': function (imageSources) {

                var loadImage = function (imageSource) {

                    var deferred = $q.defer();

                    // no matter success or fail, we count it as a result.
                    $(new Image()).load(function () {

                        deferred.resolve(true);

                    }).error(function () {

                        deferred.resolve(false);

                    }).prop('src', imageSource);

                    return deferred.promise;
                }

                var promises = [];

                $(imageSources).each(function () {
                    promises.push(loadImage(this));
                });

                return $q.all(promises);
            }
        };
    }
]);