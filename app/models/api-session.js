/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var moment = require('moment'),
  base = require('./base');

var ApiSessionModel = base.Model.extend({
  tableName: 'api_sessions',
  hasTimestamps: true,

  permitted: [
    'id',
    'client_id',
    'user_id',
    'owner',
    'token',
    'life_time',
    'created_at',
    'updated_at'
  ],

  expireTime: function () {
    return moment(this.get('created_at')).add(this.get('life_time'), 'seconds');
  },

  /**
   * Helper to check if a session has expired.
   * @returns {*}
   */
  isExpired: function () {
    return moment().isAfter(this.expireTime());
  }
});


var ApiSessionCollection = base.Collection.extend({
  model: ApiSessionModel
});

module.exports = {
  ApiSession: ApiSessionModel,
  ApiSessions: ApiSessionCollection
};
