/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
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
    var input, session, promise, token;

    input = _.extend(req.query, req.body);
    token = {
      access_token: this.generateToken(),
      token_type: TOKEN_TYPE,
      expires_in: 3600 // TODO: change this to 60 days
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
    }).then(function (user) {
      // Ensure password is valid
      if (!user.checkPassword(input.user_password)) {
        throw new errors.ApiError('Unable to authenticate user with provided credentials.');
      }

      return user;
    }).catch(models.User.NotFoundError, function (error) {
      throw new errors.ObjectNotFoundError(
        'Staff or student with unique pass [' + input.user_unique_id + '] does not exists'
      );
    });

    // Done with user validation and everything went well (i hope ---> [No Tests]).
    return promise.bind(this).tap(function(user) {
      return this.clearSession(this.client.get('id'), user.get('id'));
    }).bind(this).then(function (user) {
      // Create a (client <--> user) access session...
      return models.ApiSession.create({
        client_id: this.client.get('id'),
        owner: OWNER,
        user_id: user.get('id'),
        life_time: token.expires_in,
        token: token.access_token
      })
    }).then(function (session) {
      token.created_at = session.get('created_at');
      // Flow is complete, return the token
      return token;
    })
  })
};

module.exports = Password;