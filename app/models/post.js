/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var PostModel = base.Model.extend({
  tableName: 'posts',
  hasTimestamps: true,

  permitted: [
    'id',
    'title',
    'slug',
    'category_id',
    'author_id',
    'content',
    'content_html',
    'image',
    'format',
    'is_featured',
    'likes_count',
    'views_count',
    'updated_by',
    'created_at',
    'updated_at'
  ],

  category: function() {
    return this.belongsTo(require('./category').Category, 'category_id').query({where: {object_type: 'posts'}});
  },

  author: function() {
    return this.belongsTo(require('./user').User, 'author_id');
  },

  comments: function() {
    return this.hasMany(require('./comment').Comments, 'object_id').query({where: {object_type: 'posts'}});
  },

  likes: function() {
    return this.hasMany(require('./like').Like, 'object_id').query({where: {object_type: 'posts'}});
  },

  views: function() {
    return this.hasMany(require('./view').View, 'object_id').query({where: {object_type: 'posts'}});
  }
});

var PostCollection = base.Collection.extend({
  model: PostModel
});

module.exports = {
  Post: PostModel,
  Posts: PostCollection
};
