/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var book = require('../controllers/book');

module.exports = function(app) {
  app.get('/books', app.apiHandler(book.getBooks));
  app.get('/books/:id', app.apiHandler(book.getBook));
  app.post('/books/:id', app.apiHandler(book.updateBook));
  app.delete('/books/:id', app.apiHandler(book.deleteBook));
};