/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var moment = require('moment'),
  base = require('./base'),
  config = require('../config');

var BookModel = base.Model.extend({
  tableName: 'books',
  hasTimestamps: true,

  permitted: [
    'id',
    'title',
    'category_id',
    'author',
    'edition',
    'overview',
    'isbn',
    'preview_image',
    'published_at', // Holds the time the book was published (Month & Year)
    'created_at', // This holds the time the book was added to the library,
    'updated_at'
  ],

  virtuals: {
    preview_image_url: function () {
      if (this.get('preview_image') !== null) {
        //return config.server.url() + '/files/books/images/' + this.get('preview_image');
        return 'http://127.0.0.1/elibrary-api/public/files/books/images/' + this.get('preview_image');

      }
    },

    book_file_url: function () {
      if (this.get('file_name')) {
        //return config.server.url() + '/files/books/files/' + this.get('file_name');
        return 'http://127.0.0.1/elibrary-api/public/files/books/files/' + this.get('file_name');
      }
    }
  },

  saving: function () {
    if (this.hasChanged('published_at') && this.get('published_at').split('-').length === 2) {
      this.set('published_at', moment(this.get('published_at'), 'YYYY-MM').format('YYYY-MM-DD HH:mm:ss'));
    }
  },

  category: function () {
    return this.belongsTo(require('./category').Category, 'category_id').where('object_type', '=', 'books');
  },

  copies: function () {
    return this.hasMany(require('./book-copy').BookCopy, 'book_id');
  }
});

var BookCollection = base.Collection.extend({
  model: BookModel
});

module.exports = {
  Book: BookModel,
  Books: BookCollection
};
