/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  Promise = require('bluebird'),
  models = require('../models'),
  errors = require('./error'),
  Context = require('./context');

module.exports = function(app) {
  /**
   * Adds a utility apiHandler() method to express app.
   * Creates a context that contains relevant & extra information
   * about a request and attaches it to the controller being requested.
   *
   *
   * @param controller
   * @returns {Function}
   */
  app.apiHandler = function(controller) {
    return function(request, response, next) {
      var context = new Context(request);
      return Promise.resolve().then(function() {
        // Execute the controller method and get its returned data
        return controller.call(controller, context, request, response, next);
      }).then(function(result) {
        // If everything goes well, the data is outputted
        return response.json(result);
      }).catch(function(error) {
        // Handle Errors: ensure all errors are converted to ApiError
        if (error instanceof models.Model.NotFoundError) {
          // Throw appropriate error when a model error is encountered.
          // This is to avoid catching errors manually on all model findXXX()
          throw new errors.ObjectNotFoundError('This resource does not exist.');
        } else {
          // Seems some other unidentified error occurred..
          // Lets throw the generic ApiError
          throw new errors.ApiError('An unexpected error occurred. Try again.' + error);
        }
      }).catch(errors.ApiError, function(error) {
        return response.json(error.status, {
          error: {
            message: error.message
          }
        })
      });
    };
  };
};
