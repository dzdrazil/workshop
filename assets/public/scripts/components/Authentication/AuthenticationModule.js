define(function(require) {
    'use strict';

    var angular = require('angular');

    var AuthenticationModule = angular.module('app.authentication', []);

    AuthenticationModule.factory('SessionService', require('./services/SessionService'));

    return AuthenticationModule;
});
