/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base'),
  config = require('../config');

var PrintDocumentModel = base.Model.extend({
  tableName: 'print_documents',
  hasTimestamps: true,

  permitted: [
    'id',
    'job_id',
    'file_name',
    'file_path',
    'file_type',
    'file_size'
  ],

  virtuals: {
    url: function() {
      return config.server.url() + '/files/print-jobs/' + this.get('file_path');
    }
  }
});

var PrintDocumentCollection = base.Collection.extend({
  model: PrintDocumentModel
});

module.exports = {
  PrintDocument: PrintDocumentModel,
  PrintDocuments: PrintDocumentCollection
};
