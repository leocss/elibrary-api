/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */
var _ = require('lodash'),
  moment = require('moment'),
  Promise = require('bluebird'),
  knex = require('knex'),
  fse = Promise.promisifyAll(require('fs-extra')),
  gm = require('gm'),
  bookshelf = require('../bootstrap/database').bookshelf,
  errors = require('../errors'),
  models = require('../models');

var knex = bookshelf.knex;

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
        knex.raw('(SELECT COUNT(id) FROM likes WHERE object_type = "books" AND object_id = books.id) AS likes_count'));
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM views WHERE object_type = "books" AND object_id = books.id) AS views_count'));

      if (context.user) {
        qb.select(
          knex.raw('(' +
          'SELECT COUNT(likes.id) FROM likes ' +
          'WHERE object_type = "books" AND object_id = books.id AND user_id = "' + context.user.get('id') + '"' +
          ') AS context_user_liked')
        );

        qb.select(
          knex.raw('(' +
          'SELECT COUNT(views.id) FROM views ' +
          'WHERE object_type = "books" AND object_id = views.id AND user_id = "' + context.user.get('id') + '"' +
          ') AS context_user_viewed')
        );
      }
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
    var includes = context.parseIncludes(['category', 'copies']);

    return models.Book.findOne({id: req.params.book_id}, {
      withRelated: includes
    }, function (qb) {

      qb.select(
        knex.raw('(SELECT COUNT(id) FROM likes WHERE object_type = "books" AND object_id = "' + req.params.book_id + '") AS likes_count'));
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM views WHERE object_type = "books" AND object_id = "' + req.params.book_id + '") AS views_count'));

      qb.select(
        knex.raw('(SELECT COUNT(id) FROM books_copies WHERE book_id = "' + req.params.book_id + '") AS hard_copies_count'));

      if (context.user) {
        qb.select(
          knex.raw('(' +
          'SELECT COUNT(likes.id) FROM likes ' +
          'WHERE object_type = "books" AND object_id = "' + req.params.book_id + '" AND user_id = "' + context.user.get('id') + '"' +
          ') AS context_user_liked')
        );

        qb.select(
          knex.raw('(' +
          'SELECT COUNT(views.id) FROM views ' +
          'WHERE object_type = "books" AND object_id = "' + req.params.book_iid + '" AND user_id = "' + context.user.get('id') + '"' +
          ') AS context_user_viewed')
        );
      }
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
            qb.select('*');
            qb.select(
              knex.raw('(SELECT COUNT(id) FROM likes WHERE object_type = "books" AND object_id = books.id) AS likes_count'));
            qb.select(
              knex.raw('(SELECT COUNT(id) FROM views WHERE object_type = "books" AND object_id = books.id) AS views_count'));

            if (context.user) {
              qb.select(
                knex.raw('(' +
                'SELECT COUNT(likes.id) FROM likes ' +
                'WHERE object_type = "books" AND object_id = books.id AND user_id = "' + context.user.get('id') + '"' +
                ') AS context_user_liked')
              );
            }

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
        knex.raw('(SELECT COUNT(id) FROM likes WHERE object_type = "books" AND object_id = books.id) AS likes_count'));
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM views WHERE object_type = "books" AND object_id = books.id) AS views_count'));
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
   *
   * @param context
   * @param req
   */
  registerBookHardCopy: function (context, req) {
    var required = ['rfid', 'isbn'];
    var data = [];
    required.forEach(function (item) {
      if (!_.has(req.body, item)) {
        throw new errors.MissingParamError([item]);
      }

      data[item] = req.body[item];
    });

    data.book_id = req.params.book_id;

    return models.BookCopy.create(data);
  },

  /**
   *
   * @param context
   * @param req
   * @returns {*}
   */
  getBookHardCopies: function (context, req) {
    var includes = context.parseIncludes(['book']);
    return models.BookCopy.findMany({
      where: {book_id: req.params.book_id}
    }, {withRelated: includes});
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

    var gmi = gm(req.files.image.path);
    gmi.write = Promise.promisify(gmi.write);
    gmi.resize(240, 320);

    var name = req.body.name || req.files.image.name;
    var savename = utils.safeString(path.basename(name)) + path.extname(name);

    return gmi.write(req.files.image.path)
      .then(function () {
        // Move tmp file to final destination.
        return fse.moveAsync(req.files.image.path, BOOK_IMG_DIR + '/' + req.files.image.name);
      })
      .then(function () {
        // Delete temp file after moving to main location
        return fse.removeAsync(req.files.image.path);
      }).then(function () {
        return models.Book.update(req.params.book_id, {
          preview_image: savename
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

    var name = req.body.name || req.files.book.name;
    var savename = utils.safeString(path.basename(name)) + path.extname(name);

    return fse
      .moveAsync(req.files.book.path, [BOOK_FILE_DIR, '/', req.files.book.name].join(''))
      .then(function () {
        // Delete temp file after moving to main location
        return fse.removeAsync(req.files.book.path);
      }).then(function () {
        return models.Book.update(req.params.book_id, {
          file_name: savename
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

  /**
   *
   * @param context
   * @param req
   * @returns {*}
   */
  getReservedBooks: function (context, req) {
    var includes = context.parseIncludes(['book', 'user']);
    return models.BookReserve.findMany(function (qb) {
      if (req.query.limit) {
        qb.limit(parseInt(req.query.limit));
      }
    }, {withRelated: includes, require: false});
  },

  /**
   * Endpoint for reserving books.
   *
   * POST /books/43/reserve
   * {"duration": 30}
   *
   * @param context
   * @param req
   */
  reserveBook: function (context, req) {
    if (context.user === null) {
      // Ensure client access token cannot access this endpoint
      throw new errors.ApiError('Only access token gotten from a user can be used to access this endpoint.');
    }

    // Duration in 'days'. if none is specified to the api...
    // The api uses the default => 7 days (1 week)
    var duration = req.body.duration || 7;
    var book_id = req.params.book_id;

    return models.Book.findById(book_id, {withRelated: ['copies']})
      // Ensure that this user has not already reserved this book
      .tap(function (book) {
        return models.BookReserve.findOne({
          user_id: context.user.get('id'),
          book_id: book_id
        }, {require: false}).then(function (reserve) {
          if (reserve) {
            throw new errors.ApiError('This user has already reserved this book.');
          }
        });
      })
      // Check the total hard copies of the book are available by
      // also filtering the already reserved ones out.
      .tap(function (book) {
        return knex('books_copies').select(knex.raw('COUNT(books_copies.id) AS total_available')).where(function () {
          this.whereRaw('books_copies.id NOT IN (SELECT books_reserves.id FROM books_reserves)');
        }).first().then(function (row) {
          if (row.total_available == 0) {
            throw new errors.ApiError('There are no more hard copies of this books available at the moment. Check back later.');
          }
        });
      })
      // All seems well.
      // We create the book reserve and return the result.
      .then(function (book) {
        return models.BookReserve.create({
          book_id: book_id,
          user_id: context.user.get('id'),
          expires_at: moment().add(duration, 'days')
        })
      });
  },

  /**
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  getBookLikes: function (context, req, res) {
    return models.Like.findMany({
      where: {
        object_type: 'books',
        object_id: req.params.id
      }
    }, {require: false});
  },

  /**
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  addBookUserLike: function (context, req, res) {
    if (context.user === null) {
      // Ensure client access token cannot access this endpoint
      throw new errors.ApiError('Only access token gotten from a user can be used to access this endpoint.');
    }

    var data = {};
    data.user_id = context.user.get('id');
    data.object_type = 'books';
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
      object_type: 'books'
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
        object_type: 'books',
        object_id: req.params.book_id
      }
    }, {require: false});
  },

  /**
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  addBookUserView: function (context, req, res) {
    if (context.user === null) {
      // Ensure client access token cannot access this endpoint
      throw new errors.ApiError('Only access token gotten from a user can be used to access this endpoint.');
    }

    var data = {};
    data.user_id = context.user.get('id');
    data.object_type = 'books';
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
