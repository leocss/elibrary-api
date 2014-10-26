/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */
var base = require('./base');

var EtestQuestionModel = base.Model.extend({
  tableName: 'etest_questions',
  hasTimestamps: true,

  permitted: [
    'id',
    'course_id',
    'question',
    'type',
    'options',
    'answer',
    'created_at',
    'updated_at'
  ],

  virtuals: {
    options_parsed: function() {
      return JSON.parse(this.get('options'));
    }
  }
});

var EtestQuestionCollection = base.Collection.extend({
  model: EtestQuestionModel
});

module.exports = {
  EtestQuestion: EtestQuestionModel,
  EtestQuestions: EtestQuestionCollection
};
