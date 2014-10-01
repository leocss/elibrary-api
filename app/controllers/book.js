/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */
var _ = require('lodash'),
  Promise = require('bluebird'),
  fse = Promise.promisifyAll(require('fs-extra')),
  errors = require('../errors'),
  models = require('../models');

var BOOK_IMG_DIR = __dirname + '/../../public/files/books/images';

module.exports = {
  /**
   * Endpoint to get a list of books in the library.
   * Usage:
   *  GET /books
   *
   * @param {Context} context
   * @param req
   * @param res
   */
  getBooks: function (context, req, res) {
    var model = new models.Book({}).query(function (query) {
      if (req.query.stat) {
        // ?stat=5_latest or ?stat=5_most_borrowed
        var parts = req.query.stat.split('_').reverse(),
          limit = parseInt(parts.pop()),
          type = parts.reverse().join('_');

        switch (type) {
          case 'most_borrowed':
            query.orderBy('borrow_count', 'desc');
            break;
          case 'latest':
            query.orderBy('id', 'desc');
            break;
          case 'most_viewed':
            query.orderBy('view_count', 'desc');
            break;
        }

        query.limit(limit);
      } else if (req.query.filter) {
        query.where('title', 'LIKE', '%' + req.query.filter.replace(' ', '%').replace('+', '%') + '%');
      }

      if (req.query.limit && !req.query.stat) {
        query.limit(req.query.limit);
      }

      if (req.query.offset && !req.query.stat) {
        query.skip(req.query.offset);
      }

      if (req.query.category) {
        query.where('category_id', '=', parseInt(req.query.category));
      }
    });

    return model.fetchAll({
      withRelated: ['category']
    });
  },

  /**
   * Gets book categories
   *
   * @param context
   * @param {Object} req
   * @param {Object} res
   * @returns {*}
   */
  getCategories: function (context, req, res) {
    var promises = [];
    return models.BookCategory.all({
      require: false
    }).then(function (result) {
      if (req.query['book.limit']) {
        result.forEach(function (category) {
          promises.push(category.related('books').query(function (qb) {
            qb.limit(parseInt(req.query['book.limit']));
          }).fetch());
        });
      }

      return Promise.all(promises).return(result);
    });
  },

  /**
   * Endpoint to get a random book
   * Usage:
   *  GET /books/random
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  getRandomBook: function (context, req, res) {
    return new models.Book({}).query(function (query) {
      query.orderByRaw('rand()');
      query.limit(1);
    }).fetch();
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
      'title', 'author', 'edition', 'overview',
      'has_hard_copy', 'has_soft_copy', 'copies', 'published_at'
    ]));
  },

  uploadBookPreview: function (context, req, res) {
    if (_.isUndefined(req.files.image)) {
      throw new errors.MissingParamError(['image']);
    }

    var savename = req.params.id + req.files.image.name;
    return fse.moveAsync(req.files.image.path, BOOK_IMG_DIR + '/' + savename).then(function () {
      // Delete temp file after moving to main location
      return fse.removeAsync(req.files.image.path);
    }).then(function () {
      return models.Book.update(req.params.id, {
        preview_image: savename
      });
    }).catch(function (error) {
      throw new errors.ApiError(error.message || error);
    });
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
    return models.Book.destroy({
      id: req.params.id
    }).then(function () {
      return {
        id: req.params.id
      };
    });
  },

  issueBook: function (context, req, res) {

  },

  retrieveBook: function (context, req, res) {

  },

  checkinBook: function (context, req, res) {

  },

  checkoutBook: function (context, req, res) {

  },

  uploadPreviewImage: function (context, req, res) {
    return {
      // TODO implement
    };
  }
};
