/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var etest = require('../controllers/etest');

module.exports = function(app) {
  app.get('/etest/courses', app.apiHandler(etest.getCourses));
  app.post('/etest/courses', app.apiHandler(etest.createCourse));
  app.get('/etest/courses/:course_id', app.apiHandler(etest.getCourse));

  app.post('/etest/courses/:course_id/questions', app.apiHandler(etest.createQuestion));
  app.get('/etest/courses/:course_id/questions', app.apiHandler(etest.getQuestions));

  app.post('/etest/sessions', app.apiHandler(etest.createSession));
  app.get('/etest/sessions/:session_id', app.apiHandler(etest.getSession));
  app.post('/etest/sessions/:session_id/result', app.apiHandler(etest.submitSessionResult));
  app.delete('/etest/sessions/:session_id', app.apiHandler(etest.deleteSession));
};
