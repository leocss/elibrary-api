/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var utils = require('../../toolbox/utils'),
  Grant = require('./base');

var IDENTIFIER = 'client_credentials';
OWNER = 'owner';

var ClientCredentials = utils.extendObject(function() {
  Grant.call(this);
  this.identifier = IDENTIFIER;
}, Grant);

module.exports = ClientCredentials;
