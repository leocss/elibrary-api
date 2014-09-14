/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  errors = require('../errors'),
  models = require('../models');

module.exports = {
  /**
   * Endpoint to get a list of printjobs.
   *
   * Usage:
   * GET /print-jobs
   *
   * @param context
   * @param request
   * @param response
   */
  getJobs: function (context, req, res) {
    return models.PrintJob.all({
      withRelatd: ['documents']
    });
  },

  /**
   * Endpoint to get a list of printjobs.
   *
   * Usage:
   * GET /print-jobs/:id
   *
   * @param context
   * @param request
   * @param response
   */
  getJob: function (context, req, res) {
    return models.PrintJob.findById(req.params.id, {
      withRelated: ['documents']
    });
  },

  /**
   *
   * @param context
   * @param request
   * @param response
   */
  createJob: function (context, req, res) {
    _.forEach(['user_id', 'name'], function (item) {
      if (!_.has(req.body, item)) {
        throw new errors.MissingParamError([item]);
      }

      if (_.isNull(req.body[item])) {
        throw new errors.ApiError(item + ' field cannot be empty.');
      }
    });

    return models.PrintJob.create(_.pick(req.body, ['user_id', 'name']));
  }
};
