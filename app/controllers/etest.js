/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  Promise = require('bluebird'),
  models = require('../models'),
  errors = require('../errors');

module.exports = {
  /**
   *
   * @param context
   * @param req
   */
  createCourse: function (context, req) {
    var required = ['name', 'description', 'time_length'];
    required.forEach(function (item) {
      if (!_.has(req.body, item)) {
        throw new errors.MissingParamError([item]);
      }
    });

    return models.EtestCourse.create(_.pick(req.body, required));
  },

  /**
   *
   * @param context
   * @param req
   * @returns {*|IDBRequest|void}
   */
  updateCourse: function (context, req) {
    var required = ['name', 'description', 'time_length'];

    return models.EtestCourse.update(req.params.course_id, _.pick(req.body, required));
  },

  /**
   * Gets all available courses
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  getCourses: function (context, req, res) {
    return models.EtestCourse.findMany(function (qb) {
      if (req.query.order) {
        switch (req.query.order) {
          case 'latest':
            qb.orderBy('id', 'DESC');
            break;
        }
      }

      if (req.query.limit) {
        qb.limit(parseInt(req.query.limit));
      }
    }, {require: false});
  },

  /**
   *
   * @param context
   * @param req
   * @returns {*}
   */
  getCourse: function (context, req) {
    var includes = context.parseIncludes(['sessions', 'questions']);
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
  getQuestions: function (context, req) {
    return models.EtestQuestion.findMany({
      where: {
        course_id: req.params.course_id
      }
    }, {require: false});
  },

  /**
   *
   * @param context
   * @param req
   */
  createQuestion: function (context, req) {
    var required = ['question', 'type', 'options', 'answer'];
    var data = {};
    required.forEach(function (item) {
      if (!_.has(req.body, item)) {
        throw new errors.MissingParamError([item]);
      }

      if (item == 'options') {
        data[item] = JSON.stringify(req.body[item]);
      } else {
        data[item] = req.body[item];
      }
    });

    data.course_id = req.params.course_id;

    return models.EtestQuestion.create(data);
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
    var required = ['answers'];

    return models.EtestSession.findById(req.params.session_id, {
      withRelated: ['questions']
    }).then(function (session) {
      var promises = [], selected_answer,
        questions = session.related('questions').models;

      questions.forEach(function (question) {
        selected_answer = _.find(req.body.answers, {'id': '' + question.get('id')})['answer'];

        promises.push(models.EtestSessionQuestion.updateWhere({
          session_id: session.get('id'),
          question_id: question.get('id')
        }, {
          selected_answer: selected_answer,
          correctly_answered: parseInt(selected_answer) == parseInt(question.get('answer'))
        }));
      });

      promises.push(models.EtestSession.update(session.get('id'), {
        status: 'completed'
      }));

      return Promise.all(promises);
    }).then(function (results) {
      return {success: true};
    });
  },

  /**
   *
   * @param context
   * @param req
   * @returns {*}
   */
  deleteSession: function (context, req) {
    return models.EtestSession.findById(req.params.session_id).then(function () {
      return {success: true};
    });
  }
};
