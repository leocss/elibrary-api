/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  knex = require('knex'),
  Promise  = require('bluebird'),
  utils = require('../utils'),
  errors = require('../errors'),
  models = require('../models');

module.exports = {
  /**
   *
   * @param context
   * @param req
   * @param res
   */
  getPosts: function(context, req, res) {
    var model = new models.Post().query(function(query) {
      if (req.query.filter) {
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
   *
   * @param context
   * @param req
   * @param res
   */
  getPost: function(context, req, res) {
    var includes = context.parseIncludes(['author', 'likes', 'comments', 'comments.user']);

    return models.Post.findOne({
      id: req.params.id
    }, {
      withRelated: includes
    }, function(qb) {
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM likes WHERE object = "post" AND object_id = "' + req.params.id + '") AS likes_count'));
      qb.select(
        knex.raw('(SELECT COUNT(id) FROM views WHERE object = "post" AND object_id = "' + req.params.id + '") AS views_count'));
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
  getCategories: function(context, req, res) {
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
  createCategory: function(context, req, res) {
    var data = _.pick(req.body, ['title', 'description']);
    data.object = 'post';

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
  createPost: function(context, req, res) {
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
  updatePost: function(context, req, res) {
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

    return models.Post.update(req.params.id, data);
  },

  uploadFeaturedImage: function(context, req, res) {
    // TODO: implement
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
  deletePost: function(context, request, response) {
    return models.Post.destroy({id: request.params.id});
  },

  getPostLikes: function(context, req, res) {
    return models.Like.findMany({
      where: {
        object: 'post',
        object_id: req.params.id
      }
    }, {require: false});
  },

  addUserPostLike: function(context, req, res) {
    if (context.user === null) {
      // Ensure client access token cannot access this endpoint
      throw new errors.ApiError('Only access token gotten from a user can be used to access this endpoint.');
    }

    var data = {};
    data.user_id = context.user.get('id');
    data.object = 'post';
    data.object_id = req.params.id;

    // Try to retrieve the liked data, the orm 
    // throws an error if it doesn't find a result.
    // Only then, will we create the like;
    return models.Like.findOne({
      user_id: data.user_id,
      object_id: data.object_id
    }).catch(models.Like.NotFoundError, function(err) {
      return models.Like.create(data);
    });
  },

  removeUserPostLike: function(context, req, res) {
    if (context.user === null) {
      // Ensure client access token cannot access this endpoint
      throw new errors.ApiError('Only access token gotten from a user can be used to access this endpoint.');
    }

    return models.Like.destroy({
      user_id: context.user.get('id'),
      object_id: req.params.id,
      object: 'post'
    }).return({success: true});
  },

  getPostViews: function(context, req, res) {
    return models.View.findMany({
      where: {
        object: 'post',
        object_id: req.params.id
      }
    }, {require: false});
  },

  addPostUserView: function(context, req, res) {
    if (context.user === null) {
      // Ensure client access token cannot access this endpoint
      throw new errors.ApiError('Only access token gotten from a user can be used to access this endpoint.');
    }

    var data = {};
    data.user_id = context.user.get('id');
    data.object = 'post';
    data.object_id = req.params.id;

    // Try to retrieve the view data, the orm 
    // throws an error if it doesn't find a result.
    // Only then, will we create the like;
    return models.View.findOne({
      user_id: data.user_id,
      object_id: data.object_id
    }).catch(models.View.NotFoundError, function(err) {
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
  getComments: function(context, req, res) {
    var includes = context.parseIncludes(['user']);

    return models.Comment.findMany({
      where: {
        object: 'post',
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
  createComment: function(context, req, res) {
    var required = ['content', 'user_id', 'post_id'];
    var data = _.pick(req.body, required);
    
    required.forEach(function(item) {
      if (!_.has(data, item)) {
        throw new errors.MissingParamError([item]);
      }
    });

    data.object = 'post';
    data.object_id = data.post_id;
    delete data['post_id'];

    return models.Comment.create(data);
  }
};
