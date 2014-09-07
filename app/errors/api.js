/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var utils = require('../utils');

/**
 * Base Error Class.
 * All other error/exception classes must extend this one.
 *
 * @type {*}
 */
var ApiError = utils.extendObject(function(message, code, status) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);

  this.name = 'ApiError';
  this.message = message;
  this.code = code || 'server_error';
  this.status = status || 500;
}, Error);

/**
 * Expose ApiError
 *
 * @type {*}
 */
module.exports = ApiError;
