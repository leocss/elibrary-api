/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var moment = require('moment'),
  base = require('./base'),
  config = require('../config');

var BookIssueModel = base.Model.extend({
  tableName: 'books_issues',
  hasTimestamps: ['created_at'],

  permitted: [
    'book_id',
    'user_id',
    'borrowed_at',
    'return_due_at',
    'returned_at'
  ],

  user: function () {
    return this.belongsTo(require('./user').User, 'user_id');
  },

  book: function () {
    return this.belongsTo(require('./book').Book, 'book_id');
  }
});

var BookIssueCollection = base.Collection.extend({
  model: BookIssueModel
});

module.exports = {
  BookIssue: BookIssueModel,
  BookIssues: BookIssueCollection
};
