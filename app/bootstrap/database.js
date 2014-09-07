/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var knex = require('knex'),
  bookshelf = require('bookshelf'),
  config = require('../config');

/**
 * Init mysql connection
 * @type {*|exports}
 */
var bookshelfConnection = knex(config.database.main),
  bookshelfInstance = bookshelf(bookshelfConnection);
bookshelfInstance.plugin('visibility');
bookshelfInstance.plugin('virtuals');

module.exports = {
  bookshelf: bookshelfInstance
};
