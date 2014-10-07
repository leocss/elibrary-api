/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var PrintJobModel = base.Model.extend({
  tableName: 'print_jobs',
  hasTimestamps: true,

  permitted: [
    'id',
    'user_id',
    'name'
  ],

  user: function () {
    return this.belongsTo(require('./user').User, 'user_id');
  },

  documents: function () {
    return this.hasMany(require('./print-document').PrintDocument, 'job_id');
  }
});

var PrintJobCollection = base.Collection.extend({
  model: PrintJobModel
});

module.exports = {
  PrintJob: PrintJobModel,
  PrintJobs: PrintJobCollection
};
