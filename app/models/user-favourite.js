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
    'object',
    'object_id',
    'created_at'
  ],

  book: function () {
    return this.belongsTo(require('./book').Book, 'object_id');
  },

  post: function () {
    return this.belongsTo(require('./post').Article, 'object_id');
  }
});

var UserFavouriteCollection = base.Collection.extend({
  model: UserFavouriteModel
});

module.exports = {
  UserFavourite: UserFavouriteModel,
  UserFavourites: UserFavouriteCollection
};
