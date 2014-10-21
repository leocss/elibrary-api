/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

module.exports = function (app) {
  require('./auth')(app);
  require('./user')(app);
  require('./book')(app);
  require('./post')(app);
  reqiure('./billing')(app);
  require('./printjob')(app);
};
