/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var LikeModel = base.Model.extend({
  tableName: 'likes',
  hasTimestamps: ['created_at'],

  permitted: [
    'id',
    'user_id',
    'object',
    'object_id',
    'created_at'
  ]
});

var LikeCollection = base.Collection.extend({
  model: LikeModel
});

module.exports = {
  Like: LikeModel,
  Likes: LikeCollection
};
