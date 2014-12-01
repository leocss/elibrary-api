/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  Promise = require('bluebird'),
  Grant = require('./base'),
  models = require('../../../models'),
  errors = require('../../../errors'),
  utils = require('../../../utils');

var IDENTIFIER = 'password',
  OWNER = 'user',
  TOKEN_TYPE = 'Bearer';

var Password = utils.extendObject(function () {
  this.identifier = IDENTIFIER;
}, Grant);

Password.methods.completeFlow = function (req) {
  return this.verifyClient(req).bind(this).then(function () {
    var self = this;
    var input, session, promise, token, user;

    input = _.extend(req.query, req.body);
    token = {
      token_type: TOKEN_TYPE,
      expires_in: 3600 * 24 * 30 //expires in a month
    };

    // Begin user validation
    // Ensure that the 'user_unique_id' && 'user_password' param exists
    if (_.isNull(input.user_unique_id) || _.isUndefined(input.user_unique_id)) {
      throw new errors.MissingParamError(['user_unique_id']);
    }

    if (_.isNull(input.user_password) || _.isUndefined(input.user_password)) {
      throw new errors.MissingParamError(['user_password']);
    }

    promise = models.User.findOne({
      unique_id: input.user_unique_id
    }).then(function (result) {
      user = result;
      // Ensure password is valid
      if (!user.checkPassword(input.user_password)) {
        throw new errors.ApiError('Unable to authenticate user with provided credentials.');
      }

      return user;
    }).catch(models.User.NotFoundError, function (error) {
      throw new errors.ObjectNotFoundError(
        'Staff or student with login ID [' + input.user_unique_id + '] does not exists'
      );
    });

    // Done with user validation and everything went well (i hope -- cos -> [No Tests]).
    return promise.bind(this).then(function (user) {
      // Check if this client and user already has an active session created.
      // If it has, the system returns the access token instead of generating a new one.
      // This fixes issue [logs out a user from a device when the user logs into another device]
      // Credits to 'Famous Ehichioha' for bringing my attention to this issue. :)
      return models.ApiSession.findOne({
        client_id: this.client.get('id'),
        user_id: user.get('id')
      }, {require: false});
    }).then(function (session) {
      var promises = [];
      if (session && !session.isExpired()) {
        // A session does exists... build the token from this instead.
        token.access_token = session.get('token');
      } else {
        // No session exists already... or probably access token expired.
        token.access_token = self.generateToken();
      }

      // Just clear any dangling sessions...
      return this.clearSession(self.client.get('id'), user.get('id'));
      
    }).then(function () {
      // Create a (client <--> user) access session...
      return models.ApiSession.create({
        client_id: this.client.get('id'),
        owner: OWNER,
        user_id: user.get('id'),
        life_time: token.expires_in,
        token: token.access_token
      });
    }).then(function (session) {
      token.created_at = session.get('created_at');
      token.user_id = user.get('id');

      // Flow is complete, return the token
      return token;
    });
  })
};

module.exports = Password;