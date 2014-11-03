/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var path = require('path'),
  _ = require('lodash'),
  knex = require('knex'),
  gm = require('gm'),
  fse = require('fs-extra'),
  Promise = require('bluebird'),
  utils = require('../utils'),
  errors = require('../errors'),
  models = require('../models');

var POST_IMG_DIR = __dirname + '/../../public/files/posts';

module.exports = {
  /**
   *
   * @param context
   * @param req
   * @param res
   */
  getPosts: function (context, req, res) {
    var model = new models.Post().query(function (qb) {
      if (req.query.filter) {
        qb.where('title', 'LIKE', '%' + req.query.filter.replace(' ', '%').replace('+', '%') + '%');
      }

      if (req.query.limit && !req.query.stat) {
        qb.limit(parseInt(req.query.limit));
      }

      if (req.query.offset && !req.query.stat) {
        qb.skip(parseInt(req.query.offset));
      }

      if (req.query.category) {
        qb.where('category_id', '=', parseInt(req.query.category));
      }

      qb.select(
        knex.raw('(SELECT COUNT(id) FROM likes WHERE object_type = "posts" AND object_id = posts.id) AS likes_count'));
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM views WHERE object_type = "posts" AND object_id = posts.id) AS views_count'));
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM comments WHERE object_type = "posts" AND object_id = posts.id) AS comments_count'));

      if (context.user) {
        qb.select(
          knex.raw('(' +
          'SELECT COUNT(likes.id) FROM likes ' +
          'WHERE object_type = "posts" AND object_id = posts.id AND user_id = "' + context.user.get('id') + '"' +
          ') AS context_user_liked')
        );

        qb.select(
          knex.raw('(' +
          'SELECT COUNT(views.id) FROM views ' +
          'WHERE object_type = "posts" AND object_id = views.id AND user_id = "' + context.user.get('id') + '"' +
          ') AS context_user_viewed')
        );
      }

      qb.orderBy('id', 'DESC');
    });

    return model.fetchAll({
      withRelated: ['category']
    });
  },

  /**
   *
   * @param context
   * @param req
   * @param res
   */
  getPost: function (context, req, res) {
    var includes = context.parseIncludes(['author', 'likes', 'comments', 'comments.user']);

    return models.Post.findOne({
      id: req.params.id
    }, {
      withRelated: includes
    }, function (qb) {
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM comments WHERE object_type = "posts" AND object_id = "' + req.params.id + '") AS comments_count'));
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM likes WHERE object_type = "posts" AND object_id = "' + req.params.id + '") AS likes_count'));
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM views WHERE object_type = "posts" AND object_id = "' + req.params.id + '") AS views_count'));

      if (context.user) {
        qb.select(
          knex.raw('(' +
          'SELECT COUNT(likes.id) FROM likes ' +
          'WHERE object_type = "posts" AND object_id = "' + req.params.id + '" AND user_id = "' + context.user.get('id') + '"' +
          ') AS context_user_liked')
        );

        qb.select(
          knex.raw('(' +
          'SELECT COUNT(views.id) FROM views ' +
          'WHERE object_type = "posts" AND object_id = "' + req.params.id + '" AND user_id = "' + context.user.get('id') + '"' +
          ') AS context_user_viewed')
        );
      }
    });
  },

  /**
   *
   * @param context
   * @param req
   * @param res
   * @returns {*}
   */
  uploadFeaturedImage: function (context, req, res) {
    if (!req.files.image) {
      throw new errors.MissingParamError(['image']);
    }

    var gmi = gm(req.files.image.path);
    gmi.write = Promise.promisify(gmi.write);
    gmi.resize(640, 320);


    var name = req.body.name || req.files.image.name;
    var savename = utils.safeString(path.basename(name)) + path.extname(name);

    return gmi.write(req.files.image.path)
      .then(function () {
        // Move tmp file to final destination.
        return fse.moveAsync(req.files.image.path, POST_IMG_DIR + '/' + savename);
      })
      .then(function () {
        // Delete temp file after moving to main location
        return fse.removeAsync(req.files.image.path);
      }).then(function () {
        return models.Post.update(req.params.post_id, {
          image: savename
        });
      }).catch(function (error) {
        throw new errors.ApiError(error.message || error);
      });
  },

  /**
   * Gets all posts categories
   *
   * @param  {Context} context Request Context
   * @param  {Object} req Http Server Request
   * @param  {Object} res Http Server Response
   * @return {Promise}
   */
  getCategories: function (context, req, res) {
    var promises = [],
      includes = context.parseIncludes(['posts', 'posts.author']);

    return models.Category.forPosts({withRelated: includes}).then(function (result) {
      if (includes.indexOf('posts') != -1) { // Post resource is embedded.
        result.forEach(function (category) {
          promises.push(category.related('posts').query(function (qb) {
            qb.limit(parseInt(req.query.post_limit || 5));
          }).fetch());
        });
      }

      return Promise.all(promises).return(result);
    });
  },

  /**
   * Creates a new post category.
   *
   * @param  {Context} context Request Context
   * @param  {Object} req Http Server Request
   * @param  {Object} res Http Server Response
   * @return {Promise}
   */
  createCategory: function (context, req, res) {
    var data = _.pick(req.body, ['title', 'description']);
    data.object_type = 'posts';

    return models.Category.create(data);
  },

  /**
   * Creates a new post / article
   *
   * @param  {Context} context Request Context
   * @param  {Object} req Http Server Request
   * @param  {Object} res Http Server Response
   * @return {Promise}
   */
  createPost: function (context, req, res) {
    var data = _.pick(req.body, [
      'title', 'category_id', 'content', 'author_id', 'format'
    ]);

    data.slug = utils.safeString(data.title);

    // TODO: parse and filter content 
    data.content_html = data.content;

    return models.Post.create(data);
  },

  /**
   * Updates a post details
   * Usage:
   *  POST /posts/336464
   *  {
   *
   *  }
   *
   * @param context
   * @param req
   * @param res
   */
  updatePost: function (context, req, res) {
    var data = _.pick(req.body, [
      'title', 'category_id', 'content', 'image', 'is_featured'
    ]);

    if (_.has(data, 'title')) {
      data.slug = utils.safeString(data.title);
    }

    if (_.has(data, 'content')) {
      // TODO: parse and format data.content.
      data.content_html = data.content;
    }

    return models.Post.update(req.params.post_id, data);
  },

  /**
   * Deletes a post
   * Usage:
   *  DELETE /posts/23535
   *
   * @param context
   * @param request
   * @param response
   */
  deletePost: function (context, request, response) {
    return models.Post.destroy({id: request.params.id});
  },

  getPostLikes: function (context, req, res) {
    return models.Like.findMany({
      where: {
        object_type: 'posts',
        object_id: req.params.id
      }
    }, {require: false});
  },

  addUserPostLike: function (context, req, res) {
    if (context.user === null) {
      // Ensure client access token cannot access this endpoint
      throw new errors.ApiError('Only access token gotten from a user can be used to access this endpoint.');
    }

    var data = {};
    data.user_id = context.user.get('id');
    data.object_type = 'posts';
    data.object_id = req.params.id;

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

  removeUserPostLike: function (context, req, res) {
    if (context.user === null) {
      // Ensure client access token cannot access this endpoint
      throw new errors.ApiError('Only access token gotten from a user can be used to access this endpoint.');
    }

    return models.Like.destroy({
      user_id: context.user.get('id'),
      object_id: req.params.id,
      object_type: 'posts'
    }).return({success: true});
  },

  getPostViews: function (context, req, res) {
    return models.View.findMany({
      where: {
        object_type: 'posts',
        object_id: req.params.id
      }
    }, {require: false});
  },

  addPostUserView: function (context, req, res) {
    if (context.user === null) {
      // Ensure client access token cannot access this endpoint
      throw new errors.ApiError('Only access token gotten from a user can be used to access this endpoint.');
    }

    var data = {};
    data.user_id = context.user.get('id');
    data.object_type = 'posts';
    data.object_id = req.params.id;

    // Try to retrieve the view data, the orm 
    // throws an error if it doesn't find a result.
    // Only then, will we create the like;
    return models.View.findOne({
      user_id: data.user_id,
      object_id: data.object_id
    }).catch(models.View.NotFoundError, function (err) {
      return models.View.create(data);
    });
  },

  /**
   * Creates a new post / article
   *
   * @param  {Context} context Request Context
   * @param  {Object} req Http Server Request
   * @param  {Object} res Http Server Response
   * @return {Promise}
   */
  getComments: function (context, req, res) {
    var includes = context.parseIncludes(['user']);

    return models.Comment.findMany({
      where: {
        object_type: 'posts',
        object_id: req.params.id // Post ID
      }
    }, {
      require: false,
      withRelated: includes
    })
  },

  /**
   * Creates a new post / article
   *
   * @param  {Context} context Request Context
   * @param  {Object} req Http Server Request
   * @param  {Object} res Http Server Response
   * @return {Promise}
   */
  createComment: function (context, req, res) {
    var required = ['content', 'user_id', 'post_id'];
    var data = _.pick(req.body, required);

    required.forEach(function (item) {
      if (!_.has(data, item)) {
        throw new errors.MissingParamError([item]);
      }
    });

    data.object_type = 'posts';
    data.object_id = data.post_id;
    delete data['post_id'];

    return models.Comment.create(data);
  }
};
