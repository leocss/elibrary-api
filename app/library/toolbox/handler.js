/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  Promise = require('bluebird'),
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
        return controller.call(controller, context, request, response, next);
      }).catch(function(error) {
        console.log(error);
      }).then(function() {
        return response.json({});
      });
    };
  };
};
