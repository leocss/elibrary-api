/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  Promise = require('bluebird'),
  oauth2 = require('../bootstrap/oauth2'),
  errors = require('../errors');

module.exports = {
  /**
   * Endpoint used by the client to request for access token.
   *
   *  Example client request using the 'password' credentials
   *
   *    POST /oauth2/token
   *    {
   *        'grant_type': 'password',
   *        'client_id': '...',
   *        'client_secret': '...',
   *        'user_unique_id' : '...',
   *        'user_password' : '...'
   *    }
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  generateAccessToken: function (context, req, res) {
    var input, identifier, grant;
    return new Promise(
      function (resolve, reject) {
        input = _.merge(req.body, req.query);
        identifier = input.grant_type;

        if (identifier == null) {
          // If the client didn't specify which grant type
          // to use for authentication, lets throw some error.
          reject(new errors.MissingParamError(['grant_type']));
        }

        resolve(oauth2.grant(identifier));
      }).then(function (grant) {
        // If the request seems ok and were able to
        // retrieve a supported grant type, we pass
        // control to the grant object to complete its flow.
        return grant.completeFlow(req);
      }).then(function (token) {
        // All done, its time to give the client an access token..
        return token;
      });
  },

  /**
   *
   * @param context
   * @param req
   * @param res
   */
  invalidateAccessToken: function (context, req, res) {

  },

  verifyAccessToken: function () {

  }
};
