'use strict';

var Boom = require('boom');
var Joi = require('joi');

module.exports.register = function(server, options, next) {
  var db = server.plugins.db;
  var errors = server.plugins.errors;

  var jwt = require('jsonwebtoken');

  server.route({
    method: 'POST',
    path: '/login',
    handler: function(request, reply) {
      db.User.authenticate(request.payload.email)
        .then(function(user) {
          if (!user) {
            throw new errors.AuthenticationError();
          }
          return db.User.createSession(user);
        })
        /* jshint camelcase:false */
        .then(function(session) {
          reply({
            userId: session.user_id,
            token: jwt.sign({sessionId: session.id, userId: session.user_id}, options.jwtKey)
          });
        })
        .catch(function(e) {
          if (e instanceof errors.AuthenticationError) {
            return reply(Boom.unauthorized(e));
          }
          reply(Boom.badImplementation(e.stack));
        });
    },
    config: {
      validate: {
        payload: {
          email: Joi.string().email().required()
        }
      },
      response: {
        schema: Joi.object().keys({
          userId: Joi.string(),
          token: Joi.string()
        })
      }
    }
  });

  return next();
};

module.exports.register.attributes = {
  name: 'authenticate'
};
