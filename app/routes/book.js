/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var book = require('../controllers/book');

module.exports = function(app) {
  app.get('/books', app.apiHandler(book.getBooks));
  app.get('/books/random', app.apiHandler(book.getRandomBook));
  app.get('/books/categories', app.apiHandler(book.getCategories));
  app.get('/books/:id', app.apiHandler(book.getBook));
  app.get('/books/categories/:category_id', app.apiHandler(book.getCategoryBooks));
  app.post('/books', app.apiHandler(book.addBook));
  app.post('/books/:id', app.apiHandler(book.updateBook));
  app.post('/books/:id/preview-image', app.apiHandler(book.uploadPreviewImage));
  app.delete('/books/:id', app.apiHandler(book.deleteBook));
};
