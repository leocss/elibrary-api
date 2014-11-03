/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */
var base = require('./base');

var EtestCourseModel = base.Model.extend({
  tableName: 'etest_courses',
  hasTimestamps: ['created_at'],

  permitted: [
    'id',
    'name',
    'description',
    'created_at',
    'updated_at'
  ],

  sessions: function() {
    return this.hasMany(require('./etest-session').EtestSessions, 'course_id');
  },

  questions: function() {
    return this.hasMany(require('./etest-question').EtestQuestion, 'course_id');
  }
});

var EtestCourseCollection = base.Collection.extend({
  model: EtestCourseModel
});

module.exports = {
  EtestCourse: EtestCourseModel,
  EtestCourses: EtestCourseCollection
};
