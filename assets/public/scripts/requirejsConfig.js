require.config({
    baseUrl: 'scripts',
    // alias paths for library modules
    paths: {
        angular: '../vendor/angular/angular',
        'angular-ui-router': '../vendor/angular-ui-router/release/angular-ui-router.min',
        'angular-bindonce': '../vendor/angular-bindonce/bindonce',
        text: '../vendor/requirejs-text/text',
        socketio: '../vendor/socket.io-client/socket.io'
    },

    // shim settings for files that are not AMD compliant
    // this tells require.js how to handle non-modular files
    shim: {
        angular: {
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'angular-bindonce': {
            deps: ['angular']
        },
        socketio: {
            exports: 'io'
        }
    }
});
