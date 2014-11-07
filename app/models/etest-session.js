/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */
var base = require('./base');

var EtestSessionModel = base.Model.extend({
  tableName: 'etest_sessions',
  hasTimestamps: ['created_at'],

  permitted: [
    'id',
    'user_id',
    'course_id',
    'status',
    'created_at',
    'ended_at'
  ],

  questions: function () {
    return this.belongsToMany(
      require('./etest-question').EtestQuestions,
      'etest_sessions_questions',
      'session_id',
      'question_id'
    ).withPivot(['selected_answer', 'correctly_answered']);
  }
});

var EtestSessionCollection = base.Collection.extend({
  model: EtestSessionModel
});

module.exports = {
  EtestSession: EtestSessionModel,
  EtestSessions: EtestSessionCollection
};
