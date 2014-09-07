/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var crypto = require('crypto'),
  _ = require('lodash'),
  Promise = require('bluebird'),
  errors = require('../../../errors'),
  models = require('../../../models'),
  utils = require('../../../utils');

var Grant = utils.createObject(function () {
  this.identifier = null;
  this.client = null;
});

Grant.methods.getIdentifier = function () {
  return this.identifier;
};

/**
 * Tries to retrieve & verify client credentials using the
 * HTTP Basic scheme or using POST/GET data (not recommended) from request body.
 *
 * @param req
 * @returns {Promise}
 */
Grant.methods.verifyClient = Promise.method(function (req) {
  var input, clientId, clientSecret;

  input = _.merge(req.query, req.body);
  if (_.isUndefined(input.client_id) || _.isNull(input.client_id)) {
    // Could not find 'client_id' parameter.
    throw new errors.MissingParamError(['client_id']);
  }

  if (_.isUndefined(input.client_secret) || _.isNull(input.client_secret)) {
    // Could not find 'client_secret' parameter.
    throw new errors.MissingParamError(['client_secret']);
  }

  // Using POST body to send client details for authorization
  // is not recommended but its supported by the oauth2 specs.
  clientId = input.client_id;
  clientSecret = input.client_secret;

  if (clientId && clientSecret) {
    return models.ApiClient.findOne({
      client_id: clientId,
      client_secret: clientSecret
    }).bind(this).then(function (client) {
      return this.client = client;
    }).catch(models.ApiClient.NotFoundError, function (error) {
      throw new errors.InvalidClientError();
    })
  }

  throw new errors.InvalidClientError();
});

/**
 * A handy method for deleting `leftovers` of access sessions
 *
 * @param clientId
 * @param userId
 */
Grant.methods.clearSession = function (clientId, userId) {
  return models.ApiSession.destroy({
    client_id: clientId,
    user_id: userId
  }, {require: false});
};

/**
 * Helper method to be used by sub-classes to generate
 * access tokens / refresh token / code tokens or whatever;
 *
 * @param {int|optional} length optional
 * @returns {*|String|string}
 */
Grant.prototype.generateToken = function (length) {
  length = 48 || length;
  return crypto.randomBytes(length).toString('hex');
};

/**
 * This method is to be implemented by subclasses
 *
 * @param request
 */
Grant.prototype.completeFlow = function (request) {
};


module.exports = Grant;