/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

module.exports = {
  // Book
  Book: require('./book').Book,
  BookCopy: require('./book-copy').BookCopy,
  BookReserve: require('./book-reserve').BookReserve,
  BookIssue: require('./book-issue').BookIssue,

  // Posts / Article
  Post: require('./post').Post,

  // General
  Category: require('./category').Category,
  Like: require('./like').Like,
  View: require('./view').View,
  Comment: require('./comment').Comment,

  // User
  User: require('./user').User,
  UserFavorite: require('./user-favorite').UserFavorite,

  // Api
  ApiClient: require('./api-client').ApiClient,
  ApiSession: require('./api-session').ApiSession,

  // Billing
  Transaction: require('./transaction').Transaction,

  // PrintService
  PrintJob: require('./print-job').PrintJob,
  PrintDocument: require('./print-document').PrintDocument,

  // Etest
  EtestCourse: require('./etest-course').EtestCourse,
  EtestQuestion: require('./etest-question').EtestQuestion,
  EtestSession: require('./etest-session').EtestSession,
  EtestSessionQuestion: require('./etest-session-question').EtestSessionQuestion,

  Model: require('./base').Model,
  Collection: require('./base').Collection,
  Knex: require('./base').Knex
};
