/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var ViewModel = base.Model.extend({
  tableName: 'views',
  hasTimestamps: ['created_at'],

  permitted: [
    'id',
    'user_id',
    'object_type',
    'object_id',
    'created_at'
  ]
});

var ViewCollection = base.Collection.extend({
  model: ViewModel
});

module.exports = {
  View: ViewModel,
  Views: ViewCollection
};
