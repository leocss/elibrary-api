/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */
var _ = require('lodash'),
  utils = require('../utils'),
  models = require('../models');

module.exports = {
  /**
   * Endpoint to get a list of books in the library.
   * Usage:
   *  GET /books
   * TODO GET /books?only=23,44,56 to get only books with id 23,44 and 56
   *
   * @param {Context} context
   * @param req
   * @param res
   */
  getBooks: function (context, req, res) {
    return models.Book.all({
      withRelated: ['category']
    });
  },

  /**
   * Endpoint to get a a specific book in the library using its unique id.
   * Usage:
   *  GET /books/413243
   *
   * @param {Context} context
   * @param req
   * @param res
   */
  getBook: function (context, req, res) {
    return models.Book.findById(req.params.id, {
      withRelated: ['category']
    })
  },

  /**
   * Adds a new book
   * Usage:
   *  POST /books [Headers Content-type: application/json]
   *  {
   *    "title": "Learning Javascript",
   *    "author": "John Doe",
   *    "edition": "1",
   *    "has_hard_copy": true,
   *    "has_soft_copy": true,
   *    "copies": 5,
   *    "published_at": "2014-06"
   *  }
   *
   *
   * @param context
   * @param req
   * @param res
   */
  addBook: function (context, req, res) {
    return models.Book.create(_.pick(req.body, [
      'title', 'author', 'edition', 'overview', 'has_hard_copy', 'has_soft_copy', 'copies', 'published_at'
    ]));
  },

  /**
   * Updates a book
   * Usage:
   *  POST /books/53545
   *  {
   *    "title": "New title"
   *  }
   *
   * @param context
   * @param req
   * @param res
   */
  updateBook: function (context, req, res) {
    return models.Book.update(req.params.id, _.pick(req.body, [
      'title', 'author', 'edition', 'overview', 'has_hard_copy', 'has_soft_copy', 'copies', 'published_at'
    ]));
  },

  /**
   * Deletes a book record from the library
   * Note: This doesn't actually remove the book from the library physically.. (^_^ )!!
   *  Usage:
   *    DELETE /books/23423
   *
   * @param context
   * @param req
   * @param res
   */
  deleteBook: function (context, req, res) {
    return models.Book.destroy({id: req.params.id}).then(function () {
      return {id: req.params.id};
    });
  },

  uploadPreviewImage: function (context, req, res) {
    return {
      // TODO implement
    };
  }
};
