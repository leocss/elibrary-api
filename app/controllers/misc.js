/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  Promise = require('bluebird'),
  bookshelf = require('../bootstrap/database').bookshelf,
  models = require('../models'),
  errors = require('../errors');

var knex = bookshelf.knex;

module.exports = {

  getStats: function (context, req, res) {

    var stats = [
      knex.table('users').select(knex.raw('COUNT("id") AS total_users')),
      knex.table('likes').select(knex.raw('COUNT("id") AS total_likes')),
      knex.table('views').select(knex.raw('COUNT("id") AS total_views')),
      knex.table('books').select(knex.raw('COUNT("id") AS total_books')),
      knex.table('books_copies').select(knex.raw('COUNT("id") AS total_books_copies')),
      knex.table('books_reserved').select(knex.raw('COUNT("id") AS total_reserved_books'))
    ];

    return Promise.all(stats).then(function (results) {
      return {
        total_users: results[0][0]['total_users'],
        total_likes: results[1][0]['total_likes'],
        total_views: results[2][0]['total_views'],
        total_books: results[3][0]['total_books'],
        total_books_copies: results[4][0]['total_books_copies'],
        total_reserved_books: results[5][0]['total_reserved_books']
      };
    });
  }
};
