/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var utils = require('../utils'),
  ApiError = require('./api');

/**
 * This error is mainly triggered around this api if a resource
 * (eg Book, User, PrintJob) is not found.
 *
 * @type {*}
 */
var ObjectNotFoundError = utils.extendObject(function(message) {
  message = message || 'This object does not exists.';
  ApiError.call(this, message, 'object_not_found', 404);
  this.name = 'Api.ObjectNotFound';
}, ApiError);

/**
 * Expose `ObjectNotFound`
 *
 * @type {*}
 */
module.exports = ObjectNotFoundError;