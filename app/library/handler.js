/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  Promise = require('bluebird'),
  models = require('../models'),
  errors = require('../errors'),
  Context = require('./context'),
  bearerTokenType = require('./oauth2/type/bearer');

module.exports = function (app) {
  /**
   * Adds a utility apiHandler() method to express app.
   * Creates a context that contains relevant & extra information
   * about a request and attaches it to the controller being requested.
   *
   * @param controller
   * @param options
   * @returns {Function}
   */
  app.apiHandler = function (controller, options) {
    options = _.merge({oauth2: true}, options);

    return function (req, res, next) {
      var context, accessTokenString, session;

      context = new Context(req);

      return Promise.method(bearerTokenType.getAccessToken)(req)
        .then(function (token) {
          accessTokenString = token;

          // Check if the access token is an internal clients access token
          if (token.indexOf(':') != -1) {
            var parts = token.split(':');
            return models.ApiClient.findOne({
              client_id: parts[0],
              client_secret: parts[1]
            });
          } else {
            // Retrieve the access token from the req
            return models.ApiSession.findOne({
              token: token
            }, {withRelated: ['user']}).catch(models.ApiSession.NotFoundError,function () {
              // Couldn't find any session associated with this access token
              throw new errors.InvalidTokenError('invalid');
            }).then(function (result) {
              session = result;
              // Validate the access token
              if (session.isExpired()) {
                // Ensure access session has not expired
                throw new errors.InvalidTokenError('expired');
              }

              return session;
            });
          }

        }).catch(function (error) {
          // There was an error when trying to retrieve access token,
          if (options.oauth2) {
            // If this controller is oauth2 protected, then we cannot continue.
            // as an access token is required to access this endpoint
            throw error;
          }

          return true;
        }).then(function (result) {
          if (result instanceof models.ApiClient) {
            // An api client access token was used.
            context.setAuthType('client');
          } else if (result instanceof models.ApiSession) {
            // An access token session was created propably for a user.
            context.setAuthType('user');
            context.setUser(result.related('user'));
          }
          
          // Execute the controller method and get its returned data
          return controller.call(controller, context, req, res, next);
        }).then(function (result) {
          // If everything goes well, the data is outputted

          if (options.paginate && result.models.length > 20) {
            return res.json({
              data: result,
              pager: {

              }
            });
          }

          return res.json({data: result});
        }).catch(function (error) {
          // Handle Errors: ensure all errors are converted to ApiError
          if (error instanceof models.Model.NotFoundError) {
            // Throw appropriate error when a model error is encountered.
            // This is to avoid catching errors manually on all model findXXX()
            throw new errors.ObjectNotFoundError('This resource does not exist.');
          } else {
            // Seems some other unidentified error occurred..
            // Lets throw the generic ApiError
            throw error;
          }
        }).catch(errors.ApiError, function (error) {
          return res.json(error.status, {
            error: {
              message: error.message || error,
              code: error.code
            }
          })
        });
    };
  };
};
