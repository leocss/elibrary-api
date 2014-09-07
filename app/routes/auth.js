/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var auth = require('../controllers/auth');

module.exports = function (app) {
  app.post('/oauth2/token', app.apiHandler(auth.generateAccessToken));

  // I will not be implementing the endpoints after this line.
  // But whoever wants to extend and improve this system can
  // implement them... But for now, i will be adding them to my
  // further recommendations list under 'Security Concerns' Section (o_o )

  /**
   * This endpoint should be used to validate/verify the authenticity of an access token.
   * The client should send a request like this
   *
   *    GET /oauth2/verify-token?access_token=344fa441gkj3j41j534kh
   *
   * And this server will retrieve the Access Token via the access_token param
   * and return a response like so:
   *
   *    {
   *      "access_token": "...",
   *      "client_id": "...",
   *      "expires": "...",
   *      "expires_at": "...",
   *      "created_at": "...",
   *      "valid": true | false
   *    }
   */
  // app.get('/oauth2/verity-token', app.apiHandler(auth.verifyAccessToken));
};
