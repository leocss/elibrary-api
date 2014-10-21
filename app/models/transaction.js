/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var base = require('./base');

var TransactionModel = base.Model.extend({
  tableName: 'transactions',
  hasTimestamps: ['created_at'],

  permitted: [
    'id',
    'user_id',
    'description',
    'amount',
    'type',
    'created_at'
  ],

  user: function () {
    return this.belongsTo(require('./user').User, 'user_id');
  }
});

var TransactionCollection = base.Collection.extend({
  model: TransactionModel
});

module.exports = {
  Transaction: TransactionModel,
  Transactions: TransactionCollection
}