/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var printjob = require('../controllers/printjob');

module.exports = function(app) {
  app.get('/printjobs', app.apiHandler(printjob.getJobs));
};
