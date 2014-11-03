/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var UserFavoriteModel = base.Model.extend({
  tableName: 'users_favorites',
  hasTimestamps: ['created_at'],

  permitted: [
    'id',
    'user_id',
    'object_type',
    'object_id',
    'created_at'
  ],

  object: function () {
    return this.morphTo('object', require('./book').Book, require('./post').Post);
  }
});

var UserFavoriteCollection = base.Collection.extend({
  model: UserFavoriteModel
});

module.exports = {
  UserFavorite: UserFavoriteModel,
  UserFavorites: UserFavoriteCollection
};
