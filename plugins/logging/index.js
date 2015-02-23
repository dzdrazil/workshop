'use strict';

module.exports.register = function(server, options, next) {
	var reporters = [];

	var consoleSetup = {
		reporter: require('good-console')
	};
	if (options.reporters.console) {
		consoleSetup.args = options.reporters.console.args;
		reporters.push(consoleSetup);
	}

	var goodOptions = {
		reporters: reporters
	};

	server
		.register({
			register: require('good'),
			options: goodOptions
		}, function(e) {
			if (e) console.error(e);
			else next();
		});
};

module.exports.register.attributes = {
	name: 'logging'
};
