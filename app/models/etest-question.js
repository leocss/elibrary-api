/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */
var base = require('./base');

var proto = base.Model.prototype;

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

  toJSON: function (options) {
    var attrs = proto.toJSON.call(this, options);
    attrs.options = JSON.parse(this.get('options'));
    return attrs;
  },
});

var EtestQuestionCollection = base.Collection.extend({
  model: EtestQuestionModel
});

module.exports = {
  EtestQuestion: EtestQuestionModel,
  EtestQuestions: EtestQuestionCollection
};
