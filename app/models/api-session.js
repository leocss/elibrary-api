/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

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
  ]
});


var ApiSessionCollection = base.Collection.extend({
  model: ApiSessionModel
});

module.exports = {
  ApiSession: ApiSessionModel,
  ApiSessions: ApiSessionCollection
};
