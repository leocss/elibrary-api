/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var CommentModel = base.Model.extend({
  tableName: 'comments',
  hasTimestamps: true,

  permitted: [
    'id',
    'user_id',
    'object_type',
    'object_id',
    'created_at',
    'likes_count',
    'content',
    'updated_at'
  ],

  user: function() {
    return this.belongsTo(require('./user').User, 'user_id');
  }
});

var CommentCollection = base.Collection.extend({
  model: CommentModel
});

module.exports = {
  Comment: CommentModel,
  Comments: CommentCollection
};
