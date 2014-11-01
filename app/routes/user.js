/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var user = require('../controllers/user');

module.exports = function (app) {
  app.get('/users', app.apiHandler(user.getUsers));
  app.post('/users', app.apiHandler(user.createUser));
  app.get('/users/check', app.apiHandler(user.checkUserExists));
  app.delete('/users/:id', app.apiHandler(user.deleteUser));
  app.get('/users/:id', app.apiHandler(user.getUser));
  app.post('/users/:user_id', app.apiHandler(user.updateUser));
  app.post('/users/:user_id/photo', app.apiHandler(user.uploadPhoto));

  // Favorites
  app.get('/users/:user_id/favorites', app.apiHandler(user.getFavorites));
  app.delete('/users/:user_id/favorites/:favorite_id', app.apiHandler(user.deleteFavorite));
  app.post('/users/:user_id/favorites', app.apiHandler(user.addFavorite));
  app.get('/users/:user_id/favorite-books', app.apiHandler(user.getFavoriteBooks));

  // Print Jobs
  app.get('/users/:user_id/print-jobs/:job_id/documents', app.apiHandler(user.getPrintJobDocuments));
  app.post('/users/:user_id/print-jobs/:job_id/documents', app.apiHandler(user.uploadPrintJobDocument));
  app.delete('/users/:user_id/print-jobs/:job_id/documents/:document_id', app.apiHandler(user.deletePrintJobDocument));
  app.get('/users/:user_id/print-jobs', app.apiHandler(user.getPrintJobs));
  app.get('/users/:user_id/print-jobs/:job_id', app.apiHandler(user.getPrintJob));
  app.post('/users/:user_id/print-jobs', app.apiHandler(user.createPrintJob));
  app.delete('/users/:user_id/print-jobs/:jobId', app.apiHandler(user.deletePrintJob));

  // Likes
  app.get('/users/:user_id/likes', app.apiHandler(user.getLikes));

  // Billing
  app.get('/users/:user_id/transactions', app.apiHandler(user.getTransactions));
  app.post('/users/:user_id/transactions', app.apiHandler(user.logTransaction));
  app.post('/users/:user_id/fund', app.apiHandler(user.fundAccount));
  app.post('/users/:user_id/debt', app.apiHandler(user.incureDept));
  app.delete('/users/:user_id/debt', app.apiHandler(user.resolveDept));

  // Etest
  app.get('/users/:user_id/etest/sessions', app.apiHandler(user.getEtestSessions));
};
