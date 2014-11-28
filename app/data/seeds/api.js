/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var knex = require('knex');
var crypto = require('crypto');
var _ = require('lodash');
var Promise = require('bluebird');
var models = require('../../models');

module.exports = function () {
  var client = {
    client_id: crypto.createHash('md5').update('dummy_client').digest('hex'),
    client_secret: crypto.createHash('md5').update('dummy_secret').digest('hex'),
    name: 'SICT Library',
    type: 'internal'
  };

  return models.ApiClient.create(client)
    .then(function () {
      console.log([
        'Created ApiClient',
        '=========================',
        'client_id: ' + client.client_id,
        'client_secret: ' + client.client_secret
      ].join('\n'));

      process.exit(0);
    });
}();
