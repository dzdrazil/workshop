define(function(require) {
    'use strict';

    var socketio = require('socketio');

    return function($location, $q) {
        function WorkshopApiService() {

        }

        WorkshopApiService.prototype = {
            baseSocketUrl: $location.host() + ':' + $location.port(),
            connection: null,

            connect: function(authenticationPayload) {
                if (this.connection) {
                    return;
                }

                var defer = $q.defer();

                var self = this;
                var connection = socketio.connect(
                    this.baseSocketUrl,
                    {transports: ['websocket']}
                )
                    .on('connect', function() {
                        connection.emit('authenticate', authenticationPayload);
                    })
                    .on('authenticated', function() {
                        self.connection = connection;
                        defer.resolve();
                    })
                    .on('error', defer.reject);

                return defer.promise;
            },

            disconnect: function() {
                this.connection.disconnect();

                this.connection = null;
            }
        };

        return new WorkshopApiService();
    };
});
