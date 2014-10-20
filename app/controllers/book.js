/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */
var _ = require('lodash'),
  Promise = require('bluebird'),
  knex = require('knex'),
  fse = Promise.promisifyAll(require('fs-extra')),
  errors = require('../errors'),
  models = require('../models');

var BOOK_IMG_DIR = __dirname + '/../../public/files/books/images';
var BOOK_FILE_DIR = __dirname + '/../../public/files/books/files'

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
    var model = new models.Book({}).query(function (qb) {
      if (req.query.stat) {
        // ?stat=5_latest or ?stat=5_most_borrowed
        var parts = req.query.stat.split('_').reverse(),
          limit = parseInt(parts.pop()),
          type = parts.reverse().join('_');

        switch (type) {
          case 'most_borrowed':
            qb.orderBy('borrow_count', 'desc');
            break;
          case 'latest':
            qb.orderBy('id', 'desc');
            break;
          case 'most_viewed':
            qb.orderBy('views_count', 'desc');
            break;
          case 'most_liked':
            qb.orderBy('likes_count', 'desc');
            break;
        }

        qb.limit(limit);
      } else if (req.query.filter) {
        qb.where('title', 'LIKE', '%' + req.query.filter.replace(' ', '%').replace('+', '%') + '%');
      }

      if (req.query.limit && !req.query.stat) {
        qb.limit(parseInt(req.query.limit));
      }

      if (req.query.offset && !req.query.stat) {
        qb.skip(req.query.offset);
      }

      if (req.query.category) {
        qb.where('category_id', '=', parseInt(req.query.category));
      }

      qb.select(
        knex.raw('(SELECT COUNT(id) FROM likes WHERE object = "book" AND object_id = books.id) AS likes_count'));
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM views WHERE object = "book" AND object_id = books.id) AS views_count'));
    });

    return model.fetchAll({
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
    var includes = context.parseIncludes(['category']);

    return models.Book.findOne({id: req.params.book_id}, {
      withRelated: includes
    }, function (qb) {
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM likes WHERE object = "book" AND object_id = "' + req.params.book_id + '") AS likes_count'));
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM views WHERE object = "book" AND object_id = "' + req.params.book_id + '") AS views_count'));
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
    var promises = [],
      includes = context.parseIncludes(['books']);

    return models.Category.forBooks().then(function (result) {
      if (includes.indexOf('books') != -1) {
        result.forEach(function (category) {
          promises.push(category.related('books').query(function (qb) {
            qb.limit(parseInt(req.query.books_limit || 5));
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
    var includes = context.parseIncludes(['category']);

    return new models.Book({}).query(function (qb) {
      qb.orderByRaw('rand()');
      qb.limit(1);
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM likes WHERE object = "book" AND object_id = books.id) AS likes_count'));
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM views WHERE object = "book" AND object_id = books.id) AS views_count'));
    }).fetch({withRelated: includes});
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

  /**
   * Upload a book preview image
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  uploadBookImage: function (context, req, res) {
    if (_.isUndefined(req.files.image)) {
      throw new errors.MissingParamError(['image']);
    }

    return fse.moveAsync(req.files.image.path, BOOK_IMG_DIR + '/' + req.files.image.name).then(function () {
      // Delete temp file after moving to main location
      return fse.removeAsync(req.files.image.path);
    }).then(function () {
      return models.Book.update(req.params.book_id, {
        preview_image: req.files.image.name
      });
    }).catch(function (error) {
      throw new errors.ApiError(error.message || error);
    });
  },

  /**
   * Upload a digital book file (pdf)
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  uploadBookFile: function (context, req, res) {
    if (_.isUndefined(req.files.book) || _.isNull(req.files.book)) {
      throw new errors.MissingParamError(['book']);
    }

    return fse
      .moveAsync(req.files.book.path, [BOOK_FILE_DIR, '/', req.files.book.name].join(''))
      .then(function () {
        // Delete temp file after moving to main location
        return fse.removeAsync(req.files.book.path);
      }).then(function () {
        return models.Book.update(req.params.book_id, {
          file_name: req.files.book.name
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

  getBookLikes: function (context, req, res) {
    return models.Like.findMany({
      where: {
        object: 'book',
        object_id: req.params.id
      }
    }, {require: false});
  },

  addBookUserLike: function (context, req, res) {
    if (context.user === null) {
      // Ensure client access token cannot access this endpoint
      throw new errors.ApiError('Only access token gotten from a user can be used to access this endpoint.');
    }

    var data = {};
    data.user_id = context.user.get('id');
    data.object = 'book';
    data.object_id = parseInt(req.params.book_id);

    // Try to retrieve the liked data, the orm 
    // throws an error if it doesn't find a result.
    // Only then, will we create the like;
    return models.Like.findOne({
      user_id: data.user_id,
      object_id: data.object_id
    }).catch(models.Like.NotFoundError, function (err) {
      return models.Like.create(data);
    });
  },

  /**
   * Removes a book's user like.
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  removeBookUserLike: function (context, req, res) {
    if (context.user === null) {
      // Ensure client access token cannot access this endpoint
      throw new errors.ApiError('Only access token gotten from a user can be used to access this endpoint.');
    }

    return models.Like.destroy({
      user_id: context.user.get('id'),
      object_id: req.params.book_id,
      object: 'book'
    }).return({success: true});
  },

  /**
   * Gets all users that viewed a particular book.
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  getBookViews: function (context, req, res) {
    return models.View.findMany({
      where: {
        object: 'book',
        object_id: req.params.book_id
      }
    }, {require: false});
  },

  addBookUserView: function (context, req, res) {
    if (context.user === null) {
      // Ensure client access token cannot access this endpoint
      throw new errors.ApiError('Only access token gotten from a user can be used to access this endpoint.');
    }

    var data = {};
    data.user_id = context.user.get('id');
    data.object = 'book';
    data.object_id = parseInt(req.params.book_id);

    return models.View.findOne({
      user_id: data.user_id,
      object_id: data.object_id
    }).catch(models.View.NotFoundError, function (err) {
      return models.View.create(data);
    });
  },

  borrowBook: function (context, req, res) {

  },

  returnBook: function (context, req, res) {

  },

  checkinBook: function (context, req, res) {

  },

  checkoutBook: function (context, req, res) {

  }
};
