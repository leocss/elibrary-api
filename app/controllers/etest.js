/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  Promise = require('bluebird'),
  models = require('../models'),
  errors = require('../errors');

module.exports = {
  /**
   * Gets all available courses
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  getCourses: function (context, req, res) {
    return models.EtestCourse.all();
  },

  /**
   *
   * @param context
   * @param req
   * @returns {*}
   */
  getCourse: function (context, req) {
    var includes = context.parseIncludes(['sessions']);
    return models.EtestCourse.findById(req.params.course_id, {
      withRelated: includes
    });
  },

  /**
   *
   * @param context
   * @param req
   * @returns {*}
   */
  getCourseQuestions: function (context, req) {
    return models.EtestQuestion.findMany({
      where: {
        course_id: req.params.course_id
      }
    });
  },

  /**
   *
   * @param context
   * @param req
   */
  createSession: function (context, req) {
    var session, questions;
    var required = ['user_id', 'course_id', 'question_limit'];
    required.forEach(function (item) {
      if (!_.has(req.body, item)) {
        throw new errors.MissingParamError([item]);
      }
    });

    // First create a session
    return models.EtestSession.create(_.pick(req.body, ['user_id', 'course_id'])).then(function (result) {
      session = result;

      // Then select random x questions
      return models.EtestQuestion.findMany(function (qb) {
        qb.where('course_id', '=', session.get('course_id'));
        qb.limit(parseInt(req.body.question_limit));
        qb.orderByRaw('rand()');
      }, {require: false})
    }).then(function (result) {
      var promises = [];
      // Link question & user & session
      result.models.forEach(function (question) {
        promises.push(models.EtestSessionQuestion.create({
          question_id: question.get('id'),
          session_id: session.get('id'),
          selected_answer: 0,
          correctly_answered: 0
        }));
      });

      return Promise.all(promises);
    }).then(function () {
      return session;
    });
  },

  /**
   * Gets a session and its questions
   *
   * @param context
   * @param req
   * @returns {*}
   */
  getSession: function (context, req) {
    var includes = context.parseIncludes(['questions'])
    return models.EtestSession.findById(req.params.session_id, {
      withRelated: includes
    });
  },

  /**
   * Endpoint that recieves and processes a session answers/result
   *
   * @param context
   * @param req
   * @returns {*}
   */
  submitSessionResult: function (context, req) {
    var session;
    return models.EtestSession.findById(req.params.session_id, {
      withRelated: ['questions']
    }).then(function (result) {
      session = result;
    });
  }
};
