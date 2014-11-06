/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var etest = require('../controllers/etest');

module.exports = function (app) {
  app.get('/etest/courses', app.apiHandler(etest.getCourses));
  app.post('/etest/courses', app.apiHandler(etest.createCourse));
  app.get('/etest/courses/:course_id', app.apiHandler(etest.getCourse));
  app.post('/etest/courses/:course_id', app.apiHandler(etest.updateCourse));
  app.delete('/etest/courses/:course_id', app.apiHandler(etest.deleteCourse));

  app.post('/etest/courses/:course_id/questions', app.apiHandler(etest.createQuestion));
  app.get('/etest/courses/:course_id/questions', app.apiHandler(etest.getQuestions));
  app.post('/etest/courses/:course_id/questions/:question_id', app.apiHandler(etest.updateQuestion));

  app.post('/etest/sessions', app.apiHandler(etest.createSession));
  app.get('/etest/sessions/:session_id', app.apiHandler(etest.getSession));
  app.post('/etest/sessions/:session_id/result', app.apiHandler(etest.submitSessionResult));
  app.delete('/etest/sessions/:session_id', app.apiHandler(etest.deleteSession));
};
