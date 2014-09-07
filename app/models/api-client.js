/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var ApiClientModel = base.Model.extend({
  tableName: 'api_clients',
  hasTimestamps: true,

  permitted: [
    'id',
    'client_id',
    'client_secret',
    'name',
    'type',
    'created_at',
    'updated_at'
  ]
});


var ApiClientCollection = base.Collection.extend({
  model: ApiClientModel
});

module.exports = {
  ApiClient: ApiClientModel,
  ApiClients: ApiClientCollection
};
