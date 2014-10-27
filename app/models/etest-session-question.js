/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */
var base = require('./base');

var EtestSessionQuestionModel = base.Model.extend({
  tableName: 'etest_sessions_questions',
  hasTimestamps: false,

  permitted: [
    'question_id',
    'session_id',
    'selected_answer',
    'correctly_answered',
  ]
});

var EtestSessionQuestionCollection = base.Collection.extend({
  model: EtestSessionQuestionModel
});

module.exports = {
  EtestSessionQuestion: EtestSessionQuestionModel,
  EtestSessionQuestions: EtestSessionQuestionCollection
};
