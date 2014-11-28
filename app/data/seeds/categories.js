/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var knex = require('knex');
var crypto = require('crypto');
var _ = require('lodash');
var Promise = require('bluebird');
var models = require('../../models');

var categories = [{
  title: 'Signals',
  description: 'Signals'
}];

module.exports = function () {
  var pending = [];
  var titles = [];

  categories.forEach(function (category) {
    titles.push(category.title);
    pending.push(models.Category.create({
      title: category.title,
      description: category.description,
      object_type: 'books'
    }));
  });

  return Promise.all(pending)
    .then(function () {
      console.log([
        'Created categories',
        '=========================',
        titles.join('\n')
      ].join('\n'));

      process.exit(0);
    });
}();
