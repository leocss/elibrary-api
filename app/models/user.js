/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var bcrypt = require('bcryptjs'),
  base = require('./base');

var UserModel = base.Model.extend({
  tableName: 'users',
  hasTimestamps: true,

  permitted: [
    'id',
    'first_name',
    'last_name',
    'address',
    'gender',
    'matric_number',
    'school',
    'course',
    'created_at',
    'updated_at'
  ],

  /**
   * Validates a password
   * @param {String} password
   * @returns {*}
   */
  checkPassword: function(password) {
    return bcrypt.compareSync(password, this.get('password'));
  },

  printJobs: function() {
    return this.hasMany(require('./print-job').PrintJobs, 'user_id');
  },

  favourites: function() {
    return this.hasMany(require('./user-favourite').Favourites, 'user_id');
  }
}, {
  checkPassword: function(password) {

  }
});

var UserCollection = base.Collection.extend({
  model: UserModel
});

module.exports = {
  User: UserModel,
  Users: UserCollection
};
