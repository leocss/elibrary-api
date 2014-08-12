/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var UserModel = base.Model.extend({
  tableName: 'users',
  hasTimestamps: true,

  permitted: [
    'id',
    'first_name',
    'last_name',
    'created_at',
    'updated_at'
  ]
});

var UserCollection = base.Collection.extend({
  model: UserModel
});

module.exports = {
  User: UserModel,
  Users: UserCollection
};
