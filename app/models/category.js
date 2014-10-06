/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  base = require('./base');

var CategoryModel = base.Model.extend({
  tableName: 'categories',
  hasTimestamps: true,

  permitted: [
    'id',
    'title',
    'object',
    'description',
    'created_at',
    'updated_at'
  ],

  books: function() {
    return this.hasMany(require('./book').Books, 'category_id');
  },

  posts: function() {
    return this.hasMany(require('./post').Post, 'category_id');
  }
}, {
  forBooks: function(options) {
    return this.findMany({where: {object: 'book'}}, _.extend({require: false}, options));
  },

  forPosts: function(options) {
    return this.findMany({where: {object: 'post'}}, _.extend({require: false}, options));
  }
});

var CategoryCollection = base.Collection.extend({
  model: CategoryModel
});

module.exports = {
  Category: CategoryModel,
  Categories: CategoryCollection
};
