/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var book = require('../controllers/book');

module.exports = function (app) {
  // Books
  app.get('/books', app.apiHandler(book.getBooks));
  app.post('/books', app.apiHandler(book.addBook));

  // Book Categories
  app.get('/books/categories', app.apiHandler(book.getCategories));
  app.get('/books/categories/:category_id', app.apiHandler(book.getCategory));

  // Book Item
  app.get('/books/random', app.apiHandler(book.getRandomBook));
  app.get('/books/:book_id', app.apiHandler(book.getBook));
  app.post('/books/:id', app.apiHandler(book.updateBook));
  app.post('/books/:book_id/image', app.apiHandler(book.uploadBookImage));
  app.post('/books/:book_id/book', app.apiHandler(book.uploadBookFile));
  app.delete('/books/:id', app.apiHandler(book.deleteBook));
  app.post('/books/:book_id/reserve', app.apiHandler(book.reserveBook));

  // Book Likes
  app.get('/books/:book_id/likes', app.apiHandler(book.getBookLikes));
  app.post('/books/:book_id/like', app.apiHandler(book.addBookUserLike));
  app.delete('/books/:book_id/like', app.apiHandler(book.removeBookUserLike));

  // Book Views
  app.get('/books/:book_id/views', app.apiHandler(book.getBookViews));
  app.post('/books/:book_id/view', app.apiHandler(book.addBookUserView));
};
