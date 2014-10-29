/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var path = require('path'),
  _ = require('lodash'),
  hat = require('hat'),
  Promise = require('bluebird'),
  fse = Promise.promisifyAll(require('fs-extra')),
  gm = require('gm'),
  errors = require('../errors'),
  models = require('../models');

var USER_PHOTO_DIR = __dirname + '/../../public/files/user-photos';
var PRINT_JOB_DIR = __dirname + '/../../public/files/print-jobs';

module.exports = {
  /**
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  getUsers: function (context, req, res) {
    return new models.User().query(function (qb) {

      if (req.query.filter) {
        if (req.query.filter != '*') {
          qb.where('first_name', 'LIKE', '%' + req.query.filter.replace(' ', '%').replace('+', '%') + '%');
          qb.orWhere('last_name', 'LIKE', '%' + req.query.filter.replace(' ', '%').replace('+', '%') + '%');
        }

        if (req.query.type && (['staff', 'student'].indexOf(req.query.type) != -1)) {
          qb.where('type', '=', req.query.type);
        }
      }

      if (req.query.limit && !req.query.stat) {
        qb.limit(parseInt(req.query.limit));
      }

      if (req.query.offset && !req.query.stat) {
        qb.skip(parseInt(req.query.offset));
      }
    }).fetchAll();
  },

  /**
   * Endpoint to get a specific library user
   * GET /users/314234213
   *
   * @param context
   * @param request
   * @param response
   */
  getUser: function (context, request, response) {
    var includes = context.parseIncludes(['printJobs', 'favorites', 'transactions']);
    return models.User.findById(request.params.id, {
      withRelated: includes
    }).then(function (user) {
      return user.toJSON();
    });
  },

  /**
   *
   * @param context
   * @param req
   * @returns {*}
   */
  updateUser: function (context, req) {
    return models.User.update(_.pick(req.body, [
      'first_name', 'last_name', 'email', 'address',
      'gender', 'phone', 'rfid', 'type', 'unique_id'
    ]));
  },

  /**
   * @param context
   * @param request
   */
  createUser: function (context, req) {
    var required = ['first_name', 'last_name', 'password', 'email', 'address', 'gender', 'unique_id', 'rfid', 'type'];
    var data = _.pick(req.body, required);

    required.forEach(function (item) {
      if (!_.has(data, item)) {
        throw new errors.MissingParamError([item]);
      }

      if (_.isEmpty(data[item])) {
        throw new errors.ApiError('"' + item + '" cannot be empty.');
      }
    });

    return models.User.create(data);
  },

  /**
   * Uploads user photo
   *
   * @param context
   * @param request
   */
  uploadPhoto: function (context, req) {
    if (_.isUndefined(req.files.photo) || _.isNull(req.files.photo)) {
      throw new errors.MissingParamError(['photo']);
    }

    // First resize uploaded image
    var gmi = gm(req.files.photo.path);
    gmi.write = Promise.promisify(gmi.write)
    gmi.resize(480, 640);

    return gmi.write(req.files.photo.path)
      .then(function () {
        // Move tmp file to final destination.
        return fse.moveAsync(req.files.photo.path, [USER_PHOTO_DIR, req.files.photo.name].join('/'));
      })
      .then(function () {
        // Delete temp file after moving to main location
        return fse.removeAsync(req.files.photo.path);
      }).then(function () {
        return models.User.findById(req.params.user_id).tap(function (user) {
          if (user.get('photo') != null) {
            // Delete the old user photo file...
            return fse.removeAsync([USER_PHOTO_DIR, user.get('photo')].join('/'));
          }

          return true;
        });
      }).then(function (user) {
        // Update the user 'photo' field
        return user.update({
          photo: req.files.photo.name
        });
      }).catch(function (error) {
        throw new errors.ApiError(error.message || error);
      });
  },

  /**
   *
   * @param context
   * @param request
   */
  deleteUser: function (context, req) {
    return models.User.destroy({id: req.params.id});
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
    var documentIndex;
    var includes = context.parseIncludes(['documents']);

    includes.push('printJobs');
    if ((documentIndex = includes.indexOf('documents')) !== -1) {
      includes[documentIndex] = 'printJobs.documents';
    }

    return models.User.findById(request.params.user_id, {
      withRelated: includes
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
      return models.PrintDocument.create({
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

    models.PrintDocument.findById(req.params.document_id).then(function (result) {
      document = result;
      return result.destroy();
    }).then(function () {
      return fse.removeAsync(path.join(PRINT_JOB_DIR + '/', document.get('file_path')));
    }).then(function () {
      return document.get('id');
    });
  },

  getPrintJobDocument: function (context, req, res) {
    return models.PrintDocument.findById(req.params.document_id);
  },

  getPrintJobDocuments: function (context, req, res) {
    return models.PrintDocument.findMany({where: {job_id: req.params.job_id}}, {require: false});
  },

  /**
   * Delete a user print job
   *
   * @param context
   * @param request
   * @param response
   */
  deletePrintJob: function (context, req, resp) {
    return models.PrintJob.destroy({
      id: req.params.job_id,
      user_id: req.params.user_id
    });
  },

  /**
   *
   * @param context
   * @param request
   * @param response
   */
  getFavorites: function (context, req, res) {
    var includes = context.parseIncludes(['object']);

    return models.UserFavorite.findMany({
        where: {
          user_id: req.params.user_id
        }
      }, {
        require: false,
        withRelated: includes
      }
    );
  },

  /**
   * Removes an item from the user favorites.
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  deleteFavorite: function (context, req, res) {
    return models.UserFavorite.destroy({
      user_id: req.params.user_id,
      id: req.params.favorite_id
    });
  },

  /**
   * Adds an item to the user favorites.
   *
   * @param context
   * @param req
   * @param res
   */
  addFavorite: function (context, req, res) {
    var required = ['object_id', 'object_type'];
    required.forEach(function (item) {
      if (!_.has(req.body, item)) {
        throw new errors.MissingParamError([item]);
      }
    });

    var data = _.pick(req.body, required);
    data.user_id = req.params.user_id;
    return models.UserFavorite.create(data);
  },

  /**
   * Gets all the items the user liked
   *
   * @param context
   * @param req
   * @param res
   */
  getLikes: function (context, req, res) {
    return models.Like.findMany({
      where: {
        user_id: req.params.user_id
      }
    }, {require: false});
  },

  /**
   * Logs a transaction made by a user
   *
   * @param context
   * @param req
   * @returns {*}
   */
  logTransaction: function (context, req) {
    var data = {};
    var required = ['transaction_id', 'type', 'description', 'amount', 'status', 'message'];
    required.forEach(function (item) {
      if (!_.has(req.body, item)) {
        throw new errors.MissingParamError([item]);
      }

      data[item] = req.body[item];
    });

    data.user_id = req.params.user_id;

    return models.Transaction.create(data);
  },

  /**
   * Gets all user billing transactions
   *
   * @param context
   * @param req
   */
  getTransactions: function (context, req) {
    return models.Transaction.findMany({
      where: {
        user_id: req.params.user_id
      }
    });
  },

  /**
   * Endpoint to fund a user account
   *
   * @param context
   * @param req
   */
  fundAccount: function (context, req) {
    if (req.body.amount == undefined) {
      throw new errors.MissingParamError(['amount']);
    }

    models.User.findById(req.params.user_id).then(function (user) {
      return user.update({
        fund: parseInt(user.get('fund')) + parseInt(req.body.amount)
      });
    });
  },

  /**
   * Adds some amount to user debt
   *
   * @param context
   * @param req
   */
  incureDept: function (context, req) {
    if (req.body.type == undefined) {
      throw new errors.MissingParamError(['type']);
    }

    var charges = 0;
    switch (req.body.type) {
      case 'sms':
        charges = 5; // ie 5.0 NGN
        break;
    }

    models.User.findById(req.params.user_id).then(function (user) {
      return user.update({
        debt: parseInt(user.get('debt')) + charges
      });
    });
  },

  /**
   * Endpoint to remove from user dept...
   * Note: only use this endpoint if the debt is to be
   * resolved using the users account funds...
   *
   * @param context
   * @param req
   */
  resolveDept: function (context, req) {
    if (req.body.amount == undefined) {
      throw new errors.MissingParamError(['amount']);
    }

    var amount = parseInt(req.body.amount);
    models.User.findById(req.params.user_id).then(function (user) {

      if (parseInt(user.get('fund')) < amount) {
        throw new errors.ApiError('The amount specified exceeds the users funds.');
      }

      return user.update({
        debt: (parseInt(user.get('debt')) - amount),
        fund: (parseInt(user.get('fund')) - amount)
      });
    });
  },

  /**
   * Gets all user etest sessions
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  getEtestSessions: function (context, req, res) {
    return models.EtestSession.findMany({
      where: {user_id: req.params.user_id}
    }, {require: false});
  }
};
