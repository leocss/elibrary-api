/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var moment = require('moment');
var models = require('../models');
var services = require('../services');

// Run Once daily
setInterval(function() {
  // Find all expired borrowed books that have not yet being returned.
  // And send appropriate reminders to a selected few :)
  models.BookIssue.findMany(function(qb) {
    qb.where('return_due_at', '<', models.Knex.raw('NOW()'));
    qb.where(function() {
      this.where('returned_at', '=', '0000-00-00 00:00:00');
      this.orWhereRaw('returned_at IS NULL');
    });
  }, {
    require: false,
    withRelated: ['user']
  }).then(function(issues) {
    var diff;
    var user;
    var debt;

    issues.forEach(function(issue) {
      user = issue.related('user');
      diff = moment(issue.get('return_due_at')).diff(moment(), 'days');

      if (diff == -2) {
        // Send a message to the user after 2 days
        services.sms.send(user.get('phone'));
        debt += 5; // increment debt for sending sms
      }

      if (diff == -7) {
        // If the user has not returned the book after 7 days
        if (user.isStudent()) {
          // Send sms to user and HOD if the user is a student.
          // TODO: how the hell do i get HOD details...
          // This system is getting too wide...
          debt += 10;
        }
      }

      if (diff == -12) {
        // Ol boy! This user has stolen our book..
        // Send an sms to INTERPOL and the SWAT team.
      }
    });
  });
}, 120040);

setInterval(function() {
  // Find and delete all expired reserved books
  models.BookReserve.findMany(function(qb) {
    qb.where('expire_at', '<', moment().format('YYYY-MM-DD HH:mm:ss'));
  }, {
    require: false
  }).then(function(reserves) {
    reserves.models.forEach(function(reserve) {

    });
  });
}, 2000);
