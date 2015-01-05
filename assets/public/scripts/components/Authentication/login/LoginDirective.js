define(function(require) {
    'use strict';

    require('../services/Authentication');

    require('../AuthenticationModule')
        .directive('loginForm', function(AuthenticationService) {

            return {
                restrict: 'A',
                template: require('text!./LoginDirectiveTemplate.html'),
                replace: true,
                controller: function($scope) {
                    $scope.onSubmit = function() {
                        AuthenticationService.login($scope.user.email)
                        /**
                         * @todo Finish login success
                         */
                            .then(function() {
                                console.log('login success');
                                alert('Todo: set router state to workspace listing');
                            })
                            .catch(function() {
                                $scope.loginForm.uEmail.$error.email = true;
                            });
                    };
                }
            };
        });
});
