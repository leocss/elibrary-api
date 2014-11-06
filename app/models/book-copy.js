/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var BookCopyModel = base.Model.extend({
  tableName: 'books_copies',
  hasTimestamps: false,

  permitted: [
    'id',
    'book_id',
    'rfid',
    'isbn'
  ],

  book: function () {
    return this.belongsTo(require('./book').Book, 'book_id');
  }
});

var BookCopyCollection = base.Collection.extend({
  model: BookCopyModel
});

module.exports = {
  BookCopy: BookCopyModel,
  BookCopies: BookCopyCollection
};
