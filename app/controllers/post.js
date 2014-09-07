/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  models = require('../models');

module.export = {
  /**
   *
   * @param context
   * @param request
   * @param response
   */
  getPosts: function(context, request, response) {
    return models.Post.all();
  },

  /**
   *
   * @param context
   * @param request
   * @param response
   */
  getPost: function(context, request, response) {
    return models.Post.findById(request.params.id);
  },

  createPost: function(context, params, response) {
    return models.Post.create(_.pick(request.body, [
      'title', 'content_text', 'author_id'
    ]));
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
   * @param request
   * @param response
   */
  updatePost: function(context, request, response) {
    return models.Post.update(_.pick(request.body, [
      'title', 'content_text'
    ]))
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
  }
};
