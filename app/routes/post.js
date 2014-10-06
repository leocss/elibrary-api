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

  // Post Item Comments
  app.get('/posts/:id/comments', app.apiHandler(post.getComments));
  app.post('/posts/:id/comments', app.apiHandler(post.createComment));
};
