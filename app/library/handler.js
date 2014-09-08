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

    return function (request, response, next) {
      var context, accessTokenString, session;

      context = new Context(request);

      return Promise.method(bearerTokenType.getAccessToken)(request)
        .then(function (token) {
          accessTokenString = token;
          // Retrieve the access token from the request
          return models.ApiSession.findOne({
            token: token
          }).catch(models.ApiSession.NotFoundError, function () {
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
        }).catch(function (error) {
          // There was an error when trying to retrieve access token,
          if (options.oauth2) {
            // If this controller is oauth2 protected, then we cannot continue.
            // as an access token is required to access this endpoint
            throw error;
          }

          return true;
        }).then(function () {
          // Execute the controller method and get its returned data
          return controller.call(controller, context, request, response, next);
        }).then(function (result) {
          // If everything goes well, the data is outputted
          return response.json({data: result});
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
          return response.json(error.status, {
            error: {
              message: error.message || error
            }
          })
        });
    };
  };
};
