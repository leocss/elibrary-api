/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var user = require('../controllers/user');

module.exports = function(app) {
  app.post('/users', app.apiHandler(user.createUser));
  app.delete('/users/:id', app.apiHandler(user.deleteUser));
  app.get('/users/:id', app.apiHandler(user.getUser));
  app.put('/users/:id/photo', app.apiHandler(user.uploadPhoto));
  app.get('/users/:id/favourite_books', app.apiHandler(user.getFavouriteBooks));
  app.get('/users/:id/printjobs', app.apiHandler(user.getPrintJobs));
};
