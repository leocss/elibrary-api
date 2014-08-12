/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var PrintJobModel = base.Model.extend({
  tableName: 'print_jobs',
  hasTimestamps: true,

  permitted: [
    'id'
  ]
});

var PrintJobCollection = base.Collection.extend({
  model: PrintJobModel
});

module.exports = {
  PrintJob: PrintJobModel,
  PrintJobs: PrintJobCollection
};
