/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var moment = require('moment'),
  base = require('./base');

var BookModel = base.Model.extend({
  tableName: 'books',
  hasTimestamps: true,

  permitted: [
    'id',
    'title',
    'author',
    'edition',
    'has_hard_copy',
    'has_soft_copy',
    'copies',
    'published_at', // Holds the time the book was published (Month & Year)
    'created_at', // This holds the time the book was added to the library,
    'updated_at'
  ],

  saving: function(model, attributes, options) {
    if (this.hasChanged('published_at') && this.get('published_at').split('-').length == 2) {
      this.set('published_at', moment(this.get('published_at'), 'YYYY-MM').format('YYYY-MM-DD HH:mm:ss'));
    }
  }
});

var BookCollection = base.Collection.extend({
  model: BookModel
});

module.exports = {
  Book: BookModel,
  Books: BookCollection
};
