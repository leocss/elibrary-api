/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var PrintJobModel = base.Model.extend({
  tableName: 'print_jobs',
  hasTimestamps: true,

  permitted: [
    'id',
    'user_id'
  ],

  user: function() {
    return this.belongsTo(require('./user').User, 'user_id');
  }
});

var PrintJobCollection = base.Collection.extend({
  model: PrintJobModel
});

module.exports = {
  PrintJob: PrintJobModel,
  PrintJobs: PrintJobCollection
};
