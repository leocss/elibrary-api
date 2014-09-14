/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var PrintJobDocumentModel = base.Model.extend({
  tableName: 'print_jobs_documents',
  hasTimestamps: true,

  permitted: [
    'id',
    'job_id',
    'file_name',
    'file_path',
    'file_size'
  ],

  virtuals: {
    url: function() {
      return '/files/printjobs/' + this.get('file_path');
    }
  }
});

var PrintJobDocumentCollection = base.Collection.extend({
  model: PrintJobDocumentModel
});

module.exports = {
  PrintJobDocument: PrintJobDocumentModel,
  PrintJobDocuments: PrintJobDocumentCollection
};
