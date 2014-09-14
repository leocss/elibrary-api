/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var user = require('../controllers/user');

module.exports = function (app) {
  app.post('/users', app.apiHandler(user.createUser));
  app.delete('/users/:id', app.apiHandler(user.deleteUser));
  app.get('/users/:id', app.apiHandler(user.getUser));
  app.put('/users/:id/photo', app.apiHandler(user.uploadPhoto));
  app.get('/users/:id/favourite-books', app.apiHandler(user.getFavouriteBooks));

  app.get('/users/:user_id/print-jobs/:job_id/documents', app.apiHandler(user.getPrintJobDocuments));
  app.post('/users/:user_id/print-jobs/:job_id/documents', app.apiHandler(user.uploadPrintJobDocument));
  app.delete('/users/:user_id/print-jobs/:job_id/documents/:document_id', app.apiHandler(user.deletePrintJobDocument));
  app.get('/users/:user_id/print-jobs', app.apiHandler(user.getPrintJobs));
  app.get('/users/:user_id/print-jobs/:job_id', app.apiHandler(user.getPrintJob));
  app.post('/users/:user_id/print-jobs', app.apiHandler(user.createPrintJob));
  app.delete('/users/:user_id/print-jobs/:jobId', app.apiHandler(user.deletePrintJob));
};
