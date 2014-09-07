/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  errors = require('../../../errors');

/**
 * Bearer token type.
 * For those of you looking at this code and don't know what it
 * means. From oauth2 specs, there are different ways in which a
 * client can pass access token when making a request to the resource server
 * (which in our case is this library api). One way is to use the bearer method
 * which allows you to pass the access token in the header like so.
 *    HTTP Headers [Authorization: Bearer q3534AccessToken3535rtfSDfadf]
 *
 * Or passing it along with the request like so.
 *  GET /books/23434?access_token=q3534AccessToken3535rtfSDfadf]
 *
 * This class is meant to retrieve the access token...
 *
 * @type {{getAccessToken: getAccessToken}}
 */
var BearerTokenType = {
  getAccessToken: function(request) {
    var authorization = request.headers['authorization'],
      accessToken = null, methods, regex = /^(?:\s+)?Bearer(\s{1})/;

    // Ensure the client passes the access token using one method..
    // Either from authorization header or query parameter or
    // POST parameter but never more than one at a time.
    methods = !_.isNull(authorization)
      + !_.isUndefined(request.body.access_token);
    if (methods > 1) {
      throw new errors.InvalidRequestError(
        'Only one method can be used to authenticate'
          + ' at a time (Authorization header, POST or GET)'
      );
    }

    if (authorization) {
      // Yes! we've seen an authorization header specified..
      // Try to get the access token by removing the 'Bearer' from the
      // value of the Authorization header
      if (authorization.indexOf(',') != -1) {
        accessToken = authorization.split(',')[0].replace(regex, '')
      } else {
        accessToken = authorization.replace(regex, '')
      }

      if (accessToken == 'Bearer') {
        // Seems like no access token was passed. Only the Bearer param...
        // Okay everyone! false alarm.. set access token back to null;
        accessToken = null;
      }
    }

    if (_.isNull(accessToken)) {
      // If the access token is null, try to get it from request body.
      accessToken = (_.merge(request.body, request.query)).access_token;
    }

    if (!accessToken) {
      // Common! we've given you more than enough chance to verify your identity...
      // "SECURITY!!! show this client the exit :)"
      throw new errors.InvalidTokenError('missing');
    }

    return accessToken;
  }
};

module.exports = BearerTokenType;