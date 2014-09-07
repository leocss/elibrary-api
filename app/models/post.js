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
    'author_id',
    'content_text',
    'content_parsed',
    'updated_by',
    'created_at',
    'updated_at'
  ]
});

var PostCollection = base.Collection.extend({
  model: PostModel
});

module.exports = {
  Post: PostModel,
  Posts: PostCollection
};
