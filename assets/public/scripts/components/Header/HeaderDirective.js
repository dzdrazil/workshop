define(function(require) {
    'use strict';

    var HeaderModule = require('./HeaderModule');

    HeaderModule
        .directive('appHeader', function() {
            return {
                restrict: 'A',
                template: require('text!./HeaderDirectiveTemplate.html'),
                replace: true
            };
        });
});
