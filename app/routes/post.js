/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var post = require('../controllers/post');

module.exports = function(app) {
  // Posts
  app.get('/posts', app.apiHandler(post.getPosts));
  app.post('/posts', app.apiHandler(post.createPost));

  // Post Categories
  app.get('/posts/categories', app.apiHandler(post.getCategories));
  app.post('/posts/categories', app.apiHandler(post.createCategory));

  // Post Item
  app.get('/posts/:id', app.apiHandler(post.getPost));
  app.post('/posts/:id', app.apiHandler(post.updatePost));
  app.post('/posts/:id/image', app.apiHandler(post.uploadFeaturedImage));
  app.delete('/posts/:id', app.apiHandler(post.deletePost));

  // Likes
  app.get('/posts/:id/likes', app.apiHandler(post.getPostLikes));
  app.post('/posts/:id/like', app.apiHandler(post.addUserPostLike));
  app.delete('/posts/:id/like', app.apiHandler(post.removeUserPostLike));

  // Views
  app.get('/posts/:id/views', app.apiHandler(post.getPostViews));
  app.post('/posts/:id/view', app.apiHandler(post.addPostUserView));

  // Post Item Comments
  app.get('/posts/:id/comments', app.apiHandler(post.getComments));
  app.post('/posts/:id/comments', app.apiHandler(post.createComment));
};
