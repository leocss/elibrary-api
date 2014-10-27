/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var moment = require('moment'),
  base = require('./base'),
  config = require('../config');

var BookReserveModel = base.Model.extend({
  tableName: 'books_reserves',
  hasTimestamps: ['created_at'],

  permitted: [
    'id',
    'user_id',
    'book_id',
    'expire_at',
    'created_at'
  ]
});

var BookReserveCollection = base.Collection.extend({
  model: BookReserveModel
});

module.exports = {
  BookReserve: BookReserveModel,
  BookReserves: BookReserveCollection
};
