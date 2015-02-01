'use strict';

var errors = require('common-errors');

/**
 * @class AuthenticationError
 */
module.exports = errors.helpers.generateClass('AuthenticationError', {
	extends: errors.ValidationError,
	args: [],
	generateMessage: function() {
		return 'Unable to authenticate user';
	}
});
