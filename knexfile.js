var config = require('./app/config');

module.exports = {
  development: config.database.main,
  production: config.database.main
};