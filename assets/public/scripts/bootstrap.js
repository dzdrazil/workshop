require(
    [
        'angular',
        'angular-ui-router',
        './states/StateModule',
        './components/Header/index',
        './components/Authentication/index',
        './components/WorkshopApi/WorkshopApiModule'
    ],
    function(
        angular,
        _, // ui-router is a plugin
        StateModule,
        HeaderModule,
        AuthenticationModule,
        WorkshopApiModule
    ) {
        'use strict';

        var ApplicationModule = angular.module('app', [
            'ui.router',
            StateModule.name,
            HeaderModule.name,
            AuthenticationModule.name,
            WorkshopApiModule.name
        ]);

        ApplicationModule.config(function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.when('', '/');
            // $urlRouterProvider.otherwise('/404');
        });

        ApplicationModule.run(function(SessionService) {
            SessionService.restoreIdentity();
        });

        angular.bootstrap(document, [ApplicationModule.name]);
    }
);
