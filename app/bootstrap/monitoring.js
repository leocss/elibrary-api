/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var moment = require('moment');
var models = require('../models');
var services = require('../services')

setInterval(function () {
  // Find all expired borrowed books that have not yet being returned.
  // And send appropriate reminders to a selected few :)
  models.BookIssue.findMany(function (qb) {
    qb.where('return_due_at', '<', moment().format('YYYY-MM-DD HH:mm:ss'));
    qb.where(function () {
      this.where('returned_at', '=', '0000-00-00 00:00:00');
      this.orWhere('returned_at', '=', null);
    });
  }, {
    require: false,
    withRelated: ['user']
  }).then(function (issues) {
    // TODO: check if now is 1 week/2 weeks/3 weeks from due date,
    // and send multiple sms as required to get the user to return the book
    issues.forEach(function (issue) {
      var user = issue.related('user');
      // Send sms to user
      services.sms.send(user.get('phone'));

      // Increment the amount of debt of user
      user.update({debt: (parseInt(user.get('debt')) + 5)});
    });
  });


  // TODO: find and delete all expired reserved books
  models.BookReserve.findMany(function (qb) {
    qb.where('expire_at', '<', moment().format('YYYY-MM-DD HH:mm:ss'));
  }, {require: false}).then(function (reserves) {
    reserves.models.forEach(function (reserve) {

    });
  });
}, 5000);