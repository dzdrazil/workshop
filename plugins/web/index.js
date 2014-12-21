'use strict';

var Path = require('path');

module.exports.register = function(server, options, next) {

  server.views({
    engines: {
      hbs: {
        module: require('handlebars'),
        path: Path.join(__dirname, '../../templates'),
        partialsPath: Path.join(__dirname, '../../templates/_partials'),
        helpersPath: Path.join(__dirname, '../../templates/_helpers'),
        layoutPath: Path.join(__dirname, '../../templates/_layouts'),
        compileMode: 'sync'
      }
    }
  });

  server.route({
    path: '/',
    method: 'GET',
    handler: {
      view: 'index'
    }
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: Path.join(__dirname, '../../' + options.publicPath)
      }
    }
  });

  next();
};

module.exports.register.attributes = {
  name: 'web'
};
