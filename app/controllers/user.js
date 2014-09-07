/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var models = require('../models');

module.exports = {
  /**
   * Endpoint to get a specific library user
   * GET /users/314234213
   *
   * @param context
   * @param request
   * @param response
   */
  getUser: function(context, request, response) {
    return models.User.findById(request.params.id)
      .then(function(user) {
        return user.toJSON();
      });
  },

  /**
   * @param context
   * @param request
   */
  updateUser: function(context, request) {
    return models.User.update(_.pick(request.body, [
      'first_name', 'last_name', 'email', 'address',
      'gender', 'matric_number', 'school', 'course'
    ]));
  },

  /**
   * @param context
   * @param request
   */
  createUser: function(context, request) {
    return models.User.create(_.pick(request.body, [
      'first_name', 'last_name', 'email', 'address',
      'gender', 'matric_number', 'school', 'course'
    ]));
  },

  /**
   *
   * @param context
   * @param request
   */
  uploadPhoto: function(context, request) {

  },

  /**
   *
   * @param context
   * @param request
   */
  deleteUser: function(context, request) {
    return models.User.delete({id: request.params.id});
  },

  /**
   * Gets all printjobs for a user
   * Usage:
   *  GET /users/2433423/printjobs
   *
   * @param context
   * @param request
   * @param response
   */
  getPrintJobs: function(context, request, response) {
    return models.User.findById(request.params.id, {
      withRelated: ['printJobs']
    }).then(function(user) {
      return user.related('printJobs');
    });
  },

  /**
   *
   * @param context
   * @param request
   * @param response
   */
  createPrintJob: function(context, request, response) {

  },

  /**
   * Uploads documents for print jobs
   *
   * @param context
   * @param request
   */
  uploadPrintJobDocuments: function(context, request) {

  },

  /**
   * Delete a user print job
   *
   * @param context
   * @param request
   * @param response
   */
  deletePrintJob: function(context, request, response) {
    return models.PrintJob.destroy({
      id: request.params.job_id,
      user_id: request.params.id
    });
  },

  /**
   *
   * @param context
   * @param request
   * @param response
   */
  getFavouriteBooks: function(context, request, response) {

  }
};
