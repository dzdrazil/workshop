'use strict';

var errors = require('common-errors');

module.exports = errors.helpers.generateClass('BadImplementationError', {
  extends: errors.Error,
  args: ['message'],
  generateMessage: function() {
    return 'Bad Implementation: ' + this.message;
  }
});
