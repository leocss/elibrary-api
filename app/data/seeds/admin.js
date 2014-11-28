/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var crypto = require('crypto');
var _ = require('lodash');
var Promise = require('bluebird');
var models = require('../../models');

module.exports = function () {

  var admin = {
    rfid: '',
    unique_id: 'superadmin',
    first_name: 'Librarian',
    last_name: 'Admin',
    password: 'superadmin',
    address: 'SICT Library',
    gender: 'M',
    photo: null,
    email: 'sictlibrary@futminna.edu.ng',
    phone: '0123456789',
    type: 'admin'
  };

  return models.User.create(admin)
    .then(function () {
      console.log([
        'Created Admin',
        '=========================',
        'login ID: ' + admin.unique_id,
        'login Password: ' + admin.password
      ].join('\n'));

      process.exit(0);
    });
}();
