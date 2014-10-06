/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash');

var Context = function(req) {
  this.client = {};
  this.req = req;
};

Context.prototype.parseIncludes = function(allowedIncludes) {
  var includes = [];
  if (this.req.query.include) {
    _.forEach(this.req.query.include.split(','), function(include) {
      if (allowedIncludes.indexOf(include) != -1) {
        includes.push(include);
      }
    });
  }

  return includes;
};

module.exports = Context;
