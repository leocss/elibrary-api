/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var path = require('path'),
  _ = require('lodash'),
  hat = require('hat'),
  Promise = require('bluebird'),
  fse = Promise.promisifyAll(require('fs-extra')),
  errors = require('../errors'),
  models = require('../models');

var PRINT_JOB_DIR = __dirname + '/../../public/files/printjobs';

module.exports = {
  /**
   * Endpoint to get a specific library user
   * GET /users/314234213
   *
   * @param context
   * @param request
   * @param response
   */
  getUser: function (context, request, response) {
    return models.User.findById(request.params.id)
      .then(function (user) {
        return user.toJSON();
      });
  },

  /**
   * @param context
   * @param request
   */
  updateUser: function (context, request) {
    return models.User.update(_.pick(request.body, [
      'first_name', 'last_name', 'email', 'address',
      'gender', 'matric_number', 'school', 'course'
    ]));
  },

  /**
   * @param context
   * @param request
   */
  createUser: function (context, request) {
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
  uploadPhoto: function (context, request) {

  },

  /**
   *
   * @param context
   * @param request
   */
  deleteUser: function (context, request) {
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
  getPrintJobs: function (context, request, response) {
    return models.User.findById(request.params.user_id, {
      withRelated: ['printJobs', 'printJobs.documents']
    }).then(function (user) {
      return user.related('printJobs');
    });
  },

  getPrintJob: function (context, req, res) {
    return models.PrintJob.findById(req.params.job_id, {
      withRelated: ['documents']
    });
  },

  /**
   *
   * @param context
   * @param request
   * @param response
   */
  createPrintJob: function (context, req, res) {
    _.forEach(['name'], function (item) {
      if (!_.has(req.body, item)) {
        throw new errors.MissingParamError([item]);
      }

      if (_.isNull(req.body[item])) {
        throw new errors.ApiError(item + ' field cannot be empty.');
      }
    });

    return models.PrintJob.create({
      id: req.body.user_id + '-' + hat(),
      user_id: req.params.user_id,
      name: req.body.name
    }, {method: 'insert'});
  },

  /**
   * Uploads documents for print jobs
   *
   * @param context
   * @param req
   * @param res
   */
  uploadPrintJobDocument: function (context, req, res) {
    if (_.isUndefined(req.files.document)) {
      throw new errors.MissingParamError(['document']);
    }

    var savename = req.params.user_id + '-' + req.files.document.name;
    return fse.moveAsync(req.files.document.path, PRINT_JOB_DIR + '/' + savename).then(function () {
      // Delete temp file after moving to main location
      return fse.removeAsync(req.files.document.path);
    }).then(function () {
      return models.PrintJobDocument.create({
        user_id: req.params.user_id,
        job_id: req.params.job_id,
        file_name: req.body.name || req.files.document.originalname,
        file_path: savename,
        file_size: req.files.document.size,
        file_type: req.files.document.mimetype
      });
    }).catch(function (error) {
      throw new errors.ApiError(error.message || error);
    });
  },

  /**
   * Deletes a document from a print job
   * Usage:
   *  DELETE /users/2/print-jobs/3/documents/555
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  deletePrintJobDocument: function (context, req, res) {
    var document;

    models.PrintJobDocument.findById(req.params.document_id).then(function (result) {
      document = result;
      return result.destroy();
    }).then(function () {
      return fse.removeAsync(path.join(PRINT_JOB_DIR + '/', document.get('file_path')));
    }).then(function () {
      return document.get('id');
    });
  },

  getPrintJobDocument: function (context, req, res) {
    return models.PrintJobDocument.findById(req.params.document_id);
  },

  getPrintJobDocuments: function (context, req, res) {
    return models.PrintJobDocument.findMany({where: {job_id: req.params.job_id}});
  },

  /**
   * Delete a user print job
   *
   * @param context
   * @param request
   * @param response
   */
  deletePrintJob: function (context, request, response) {
    return models.PrintJob.destroy({
      id: request.params.job_id,
      user_id: request.params.user_id
    });
  },

  /**
   *
   * @param context
   * @param request
   * @param response
   */
  getFavouriteBooks: function (context, request, response) {

  }
}
;
