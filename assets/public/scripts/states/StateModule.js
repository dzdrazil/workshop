define(function(require) {
    'use strict';

    var angular = require('angular');
    var StateModule = angular.module('app.states', []);

    StateModule.config(function($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                template: require('text!./templates/home.html'),
                controller: function() {
                    console.log('home template ontroller');
                }
            })
            .state('login', {
                url: '/login',
                template: require('text!./templates/login.html')
            })
            .state('workspaces', {
                url: '/workspaces',
                template: require('text!./templates/workspaces.html')
            })
            .state('workspaces.projects', {
                url: '/:workspaceId',
                template: require('text!./templates/projects/index.html')
            })
            .state('workspaces.projects.project', {
                url: 'projects/:projectId',
                template: require('text!./templates/projects/project.html')
            })
            .state('workspaces.projects.project.file', {
                url: 'files/:fileId',
                template: require('text!./templates/projects/file.html')
            });
    });

    return StateModule;
});
