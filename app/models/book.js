/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var moment = require('moment'),
  base = require('./base');

var BookModel = base.Model.extend({
  tableName: 'books',
  hasTimestamps: true,

  virtuals: {},

  permitted: [
    'id',
    'title',
    'category_id',
    'author',
    'edition',
    'overview',
    'preview_image',
    'has_hard_copy',
    'has_soft_copy',
    'copies',
    'borrow_count',
    'view_count',
    'published_at', // Holds the time the book was published (Month & Year)
    'created_at', // This holds the time the book was added to the library,
    'updated_at'
  ],

  virtuals: {
    preview_image_url: function () {
      if (this.get('preview_image') != null) {
        return '/files/books/images/' + this.get('preview_image');
      }
    }
  },

  saving: function (model, attributes, options) {
    if (this.hasChanged('published_at') && this.get('published_at').split('-').length == 2) {
      this.set('published_at', moment(this.get('published_at'), 'YYYY-MM').format('YYYY-MM-DD HH:mm:ss'));
    }
  },

  category: function () {
    return this.belongsTo(require('./book-category').BookCategory, 'category_id');
  }
});

var BookCollection = base.Collection.extend({
  model: BookModel
});

module.exports = {
  Book: BookModel,
  Books: BookCollection
};
