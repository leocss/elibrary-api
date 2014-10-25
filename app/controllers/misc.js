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
      knex.table('views').select(knex.raw('COUNT("id") AS total_views'))
    ];

    return Promise.all(stats).then(function (results) {
      console.log(results[1]);
      return {
        total_users: results[0][0]['total_users'],
        total_likes: results[1][0]['total_likes'],
        total_views: results[2][0]['total_views']
      }
    });
  }
};
