define(function() {
    'use strict';

    return function($q, WorkshopConnectionService, $cacheFactory) {
        function SessionStorage() {
            this.cache = $cacheFactory('sessionStorage');
        }

        SessionStorage.prototype = {
            id: '',
            token: '',
            cache: null,

            hasIdentity: function() {
                return this.id !== '' && this.token !== '';
            },

            getIdentity: function() {
                if (!this.cache.get('identity')) {
                    return this.restoreIdentity();
                }

                return this.cache.get('identity');
            },

            setIdentity: function(userId, token) {
                var self = this;

                if (this.cache.get('identity')) {
                    return this.cache.get('identity');
                }

                var promise = WorkshopConnectionService.connect({token: token})
                    .then(function() {
                        sessionStorage.setItem('userId', userId);
                        sessionStorage.setItem('token', token);
                        self.id = userId;
                        self.token = token;
                    })
                    .catch(function(e) {
                        this.cache.remove('identity');
                        throw new Error('unable to authenticate identity token', e);
                    });

                this.cache.put('identity', promise);
                return promise;
            },

            restoreIdentity: function() {
                if (sessionStorage.getItem('userId') && sessionStorage.getItem('token')) {
                    return this.setIdentity(sessionStorage.getItem('userId'), sessionStorage.getItem('token'));
                } else {
                    var d = $q.defer();
                    d.reject();
                    return d.promise;
                }
            },

            clearIdentity: function() {
                this.id = '';
                this.token = '';
                sessionStorage.clear();
                WorkshopConnectionService.disconnect();
            }
        };

        return new SessionStorage();
    };
});
