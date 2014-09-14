/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var printJob = require('../controllers/printjob');

module.exports = function(app) {
  app.get('/print-jobs', app.apiHandler(printJob.getJobs));
  app.get('/print-jobs/:id', app.apiHandler(printJob.getJob));
  app.post('/print-jobs', app.apiHandler(printJob.createJob));
};
