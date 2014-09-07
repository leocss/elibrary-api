/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var utils = require('../utils'),
  ApiError = require('./api');

/**
 * @type {*}
 */
var MissingParamError = utils.extendObject(function (params) {
  ApiError.call(
    this,
    ['Invalid request: missing the [' + params.join(',') + '] parameter(s).'].join(),
    'invalid_request',
    400);
  this.name = 'Api.MissingParam';
  this.code = 'invalid_request';
}, ApiError);

/**
 * Expose `MissingParamError`
 *
 * @type {*}
 */
module.exports = MissingParamError;