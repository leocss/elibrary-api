/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var user = require('../controllers/user');

module.exports = function (app) {
  app.get('/users', app.apiHandler(user.getUsers));
  app.post('/users', app.apiHandler(user.createUser));
  app.delete('/users/:id', app.apiHandler(user.deleteUser));
  app.get('/users/:id', app.apiHandler(user.getUser));
  app.post('/users/:user_id/photo', app.apiHandler(user.uploadPhoto));

  // Favourites
  app.get('/users/:user_id/favourites', app.apiHandler(user.getFavourites));
  app.delete('/users/:user_id/favourites/:favourite_id', app.apiHandler(user.deleteFavourite));
  app.post('/users/:user_id/favourites', app.apiHandler(user.addFavourite));
  app.get('/users/:user_id/favourite-books', app.apiHandler(user.getFavouriteBooks));

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
  app.post('/users/:user_id/fund', app.apiHandler(user.fundAccount));
  app.post('/users/:user_id/debt', app.apiHandler(user.incureDept));
  app.delete('/users/:user_id/debt', app.apiHandler(user.resolveDept));

  // Etest
  app.get('/users/:user_id/etest/sessions', app.apiHandler(user.getEtestSessions));
};
