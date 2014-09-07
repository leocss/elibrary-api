/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var utils = require('../utils'),
  ApiError = require('./api');

/**
 * @type {*}
 */
var InvalidClientError = utils.extendObject(function () {
  ApiError.call(this, 'Client authentication failed.', 'invalid_client', 401);
  this.name = 'Api.InvalidClient';
}, ApiError);

/**
 * Expose `InvalidClientError`
 *
 * @type {*}
 */
module.exports = InvalidClientError;
