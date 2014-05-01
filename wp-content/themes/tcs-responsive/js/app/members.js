'use strict';

tcapp.factory('Members', function(Restangular) {
  return Restangular.service('users');
});