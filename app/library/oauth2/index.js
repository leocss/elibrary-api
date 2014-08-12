/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var Grant = require('./grant/base');

var Oauth2 = function() {
  this.grantTypes = {};
};

/**
 * Registers a new grant type that the server should support.
 *
 * @param grant
 */
Oauth2.prototype.registerGrant = function(grant) {
  if (grant instanceof Grant) {
    this.grantTypes[grant.getIdentifier()] = grant;
  }
};

/**
 * Retrieve a grant implementation using its identifier.
 *
 * @param identifier
 * @returns {*}
 */
Oauth2.prototype.grant = function(identifier) {
  return this.grantTypes[identifier];
};

module.exports = Oauth2;