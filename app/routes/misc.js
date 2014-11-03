/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var misc = require('../controllers/misc')

module.exports = function (app) {
  app.get('/stats', app.apiHandler(misc.getStats));
};
