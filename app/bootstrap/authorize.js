/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var Oauth2 = require('../library/oauth2'),
  PasswordGrant = require('../library/oauth2/grant/password'),
  ClientCredentialsGrant = require('../library/oauth2/grant/client-credentials');

var oauth2 = new Oauth2();

oauth2.registerGrant(new PasswordGrant());
oauth2.registerGrant(new ClientCredentialsGrant());

/**
 * Expose the instance of oauth2 server to the rest of
 * the application
 *
 * @type {Oauth2}
 */
module.exports = oauth2;
