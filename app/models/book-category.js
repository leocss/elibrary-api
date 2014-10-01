/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var BookCategoryModel = base.Model.extend({
  tableName: 'books_categories',
  hasTimestamps: ['created_at'],

  permitted: [
    'id',
    'title',
    'created_at'
  ],

  books: function() {
    return this.hasMany(require('./book').Books, 'category_id');
  }
});

var BookCategoryCollection = base.Collection.extend({
  model: BookCategoryModel
});

module.exports = {
  BookCategory: BookCategoryModel,
  BookCategories: BookCategoryCollection
};
