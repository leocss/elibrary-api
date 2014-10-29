/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var UserFavouriteModel = base.Model.extend({
  tableName: 'users_favourites',
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

var UserFavouriteCollection = base.Collection.extend({
  model: UserFavouriteModel
});

module.exports = {
  UserFavourite: UserFavouriteModel,
  UserFavourites: UserFavouriteCollection
};
