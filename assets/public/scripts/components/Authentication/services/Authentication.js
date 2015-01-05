define(function(require) {
    'use strict';
    // var socketio = require('socketio');

    require('../AuthenticationModule')
        .factory('AuthenticationService', function($http, WorkshopConnectionService, SessionService) {
            function AuthenticationService() {

            }

            AuthenticationService.prototype = {
                login: function(email, password) {
                    return $http.post('/login', {
                        email: email,
                        password: password
                    })
                        .then(function(response) {
                            var payload = response.data;

                            return SessionService.setIdentity(payload.userId, payload.token);
                        });
                },

                logout: function() {
                    SessionService.clearIdentity();
                }
            };

            return new AuthenticationService();
        });
});
