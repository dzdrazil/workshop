'use strict';

var errors = require('common-errors');

/**
 * @class BadImplementationError
 */
module.exports = errors.helpers.generateClass('BadImplementationError', {
	extends: errors.Error,
	args: ['message'],
	generateMessage: function() {
		return 'Bad Implementation: ' + this.message;
	}
});
