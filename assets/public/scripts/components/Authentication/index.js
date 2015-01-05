define(function(require) {
    'use strict';

    require('./services/Authentication');
    require('./login/LoginDirective');

    return require('./AuthenticationModule');
});
