/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var utils = require('../toolbox/utils'),
  ApiError = require('./api');

var CAUSE_MISSING = 'missing',
  CAUSE_INVALID = 'invalid',
  CAUSE_EXPIRED = 'expired';

/**
 * @type {*}
 */
var InvalidTokenError = utils.extendObject(function(cause) {
  var message = null;
  if (cause == CAUSE_MISSING) {
    message = 'Access token is missing.';
  } else if (cause == CAUSE_INVALID) {
    message = 'Access token provided is invalid.';
  } else if (cause == CAUSE_EXPIRED) {
    message = 'Access token provided has expired.'
  } else {
    message = 'The access token provided is expired, revoked, malformed, or invalid.';
  }

  ApiError.call(this, message, 'invalid_token', 401);
  this.name = 'Api.InvalidToken';
}, ApiError);

/**
 * Expose `InvalidTokenError`
 *
 * @type {*}
 */
module.exports = InvalidTokenError;
