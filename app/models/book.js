/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var BookModel = base.Model.extend({
  tableName: 'books',
  hasTimestamps: true,

  permitted: [
    'id',
    'name',
    'published_at', // Holds the time the book was published (Month & Year)
    'created_at' // This holds the time the book was added to the library
  ]
});

var BookCollection = base.Collection.extend({
  model: BookModel
});

module.exports = {
  Book: BookModel,
  Books: BookCollection
};
