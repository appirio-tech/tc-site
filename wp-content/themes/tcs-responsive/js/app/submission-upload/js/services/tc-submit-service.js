'use strict';

/**
 * This code is copyright (c) 2014 Topcoder Corporation
 * author: TCSASSEMBLER
 * version 1.0
 */

/*jslint nomen: true*/
/*global angular: true, _: true */
(function() {

  angular
    .module('tc.submissionUpload')
    .factory('SubmitService', SubmitService);

  SubmitService.$inject = ['Restangular', 'API_URL', '$q', '$cookies', 'Utils'];

  /**
   * This service play the real uploading post request.
   * Three public methods are exposed and the others ought to be treated private.
   *
   * cancel() is to cancel the on-going post request.
   * submitDevelop(...) is to upload develop submission.
   * submitDesign(...) is to upload design submission.
   */
  function SubmitService(Restangular, API_URL, $q, $cookies, Utils) {

    var service = Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(API_URL);
      if ($cookies.tcjwt) {
        RestangularConfigurer.setDefaultHeaders({
          'Authorization': 'Bearer ' + $cookies.tcjwt.replace(/["]/g, "")
        });
      }
    });
    /*
     * private field
     */

    service._abortSubmit = undefined;

    /*
     * public methods.
     */

    service.cancel = cancel;

    service.submitDesign = submitDesign;

    service.submitDevelop = submitDevelop;

    /*
     * method implementations.
     */


    function cancel() {
      if (service._abortSubmit) {
        service._abortSubmit.resolve();
      }
    }

    function submitDevelop(challengeId, file) {
      var fd = new FormData();
      fd.append("submissionFile", file);

      return post('develop', challengeId, fd);
    }

    function submitDesign(challengeId, submissionFile, sourceFile, previewFile, rank, comment, fonts, stockArts, type) {
      var fd = new FormData();
      fd.append("submissionFile", submissionFile);
      fd.append("sourceFile", sourceFile);
      fd.append("previewFile", previewFile);

      var postParams = {};
      if (type) {
        postParams.type = type;
      }
      if (rank) {
        postParams.rank = rank;
      }
      if (comment) {
        postParams.comment = comment;
      }

      fonts = $.grep(fonts, function(font) {
        return !Utils.isBlank(font.site);
      });
      if (fonts.length > 0) {
        postParams.fonts = fonts.map(function(font) {
          return font.site;
        }).join('||');
        postParams.fontNames = fonts.map(function(font) {
          return font.name;
        }).join('||');
        postParams.fontUrls = fonts.map(function(font) {
          return font.url;
        }).join('||');
      }
      stockArts = $.grep(stockArts, function(stockArt) {
        return !Utils.isBlank(stockArt.photo);
      });
      if (stockArts.length > 0) {
        postParams.stockArtNames = stockArts.map(function(stockArt) {
          return stockArt.photo;
        }).join('||');
        postParams.stockArtFileNumbers = stockArts.map(function(stockArt) {
          return stockArt.number;
        }).join('||');
        postParams.stockArtUrls = stockArts.map(function(stockArt) {
          return stockArt.url;
        }).join('||');
      }
      $.each(postParams, function(key, value) {
        fd.append(key, value);
      });

      return post('design', challengeId, fd);
    }

    function post(challengeType, challengeId, content) {
      var defer = $q.defer();

      if (!$cookies.tcjwt) {
        defer.resolve({
          'error': {
            'details': 'Internal error. Try to login again.'
          }
        });
        return defer.promise;
      }

      var signature = (challengeType === 'develop' ? 'upload' : 'submit');
      var header = {
        'Content-Type': undefined
      };
      //set _abortSubmit to a new defer().
      service._abortSubmit = $q.defer();

      service
        .one(challengeType)
        .one('challenges')
        .one(challengeId)
        .withHttpConfig({
          timeout: service._abortSubmit.promise,
          transformRequest: angular.identity
        })
        .post(signature, content, undefined, header)
        .then(function(response) {
          console.log('success: the response: ');
          console.log(response);
          defer.resolve(response);
        }, function error(reason) {
          console.log('fail: the reason: ');
          console.log(reason);
          defer.resolve(reason);
        });
      return defer.promise;
    }

    return service;
  }

})();