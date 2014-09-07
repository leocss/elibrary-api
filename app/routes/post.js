/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var post = require('../controllers/post');

module.exports = function(app) {
  app.get('/posts', app.apiHandler(post.getPosts));
  app.get('/posts/:id', app.apiHandler(post.getPost));
  app.get('/posts/:id/tags', app.apiHandler(post.getPostTags));
  app.post('/posts', app.apiHandler(post.createPost));
  app.post('/posts/:id', app.apiHandler(post.updatePost));
  app.delete('/posts/:id', app.apiHandler(post.deletePost));
  app.get('/tags', app.apiHandler(post.getTags));
};
