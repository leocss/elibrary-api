/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var bcrypt = require('bcryptjs'),
  utils = require('../utils'),
  base = require('./base');

var UserModel = base.Model.extend({
  tableName: 'users',
  hasTimestamps: true,

  permitted: [
    'id',
    'rfid',
    'unique_id',
    'first_name',
    'last_name',
    'password',
    'address',
    'gender',
    'type',
    'created_at',
    'updated_at'
  ],

  hidden: [
    'password'
  ],

  virtuals: {
    full_name: function () {
      return [this.get('first_name'), this.get('last_name')].join(' ');
    }
  },

  creating: function (model, attribute, options) {
    model.set('password', bcrypt.hashSync(model.get('password'), 8));
  },

  /**
   * Validates a password
   * @param {String} password
   * @returns {*}
   */
  checkPassword: function (password) {
    return bcrypt.compareSync(password, this.get('password'));
  },

  printJobs: function () {
    return this.hasMany(require('./print-job').PrintJobs, 'user_id');
  },

  favourites: function () {
    return this.hasMany(require('./user-favourite').Favourites, 'user_id');
  }
}, {
  checkPassword: function (password) {

  }
});

var UserCollection = base.Collection.extend({
  model: UserModel
});

module.exports = {
  User: UserModel,
  Users: UserCollection
};
