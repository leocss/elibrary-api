/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

module.exports = {
  Book: require('./book').Book,
  Post: require('./post').Post,
  Category: require('./category').Category,
  Like: require('./like').Like,
  View: require('./view').View,
  Comment: require('./comment').Comment,
  User: require('./user').User,
  UserFavourite: require('./user-favourite').UserFavourite,
  ApiClient: require('./api-client').ApiClient,
  ApiSession: require('./api-session').ApiSession,
  Transaction: require('./transaction').Transaction,
  PrintJob: require('./print-job').PrintJob,
  PrintDocument: require('./print-document').PrintDocument,

  Model: require('./base').Model,
  Collection: require('./base').Collection
};
