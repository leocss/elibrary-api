/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var util = require('util'),
  utils = require('../utils'),
  ApiError = require('./api');

/**
 * @type {*}
 */
var InvalidRequestError = utils.extendObject(function(message) {
  ApiError.call(
    this,
    message,
    'invalid_request',
    400);
  this.name = 'InvalidRequestError';
  this.code = 'invalid_request';
}, ApiError);

/**
 * Expose `InvalidClientError`
 *
 * @type {*}
 */
module.exports = InvalidRequestError;