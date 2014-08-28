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
    'type',
    'item_id',
    'created_at'
  ]
});

var UserFavouriteCollection = base.Collection.extend({
  model: UserFavouriteModel
});

module.exports = {
  UserFavourite: UserFavouriteModel,
  UserFavourites: UserFavouriteCollection
};
