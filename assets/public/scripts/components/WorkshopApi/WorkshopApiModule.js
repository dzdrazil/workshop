define(function(require) {
    'use strict';

    var workshopModule = require('angular')
        .module('WorkshopApi', []);

    workshopModule.factory('WorkshopConnectionService', require('./services/ConnectionService'));

    return workshopModule;
});
