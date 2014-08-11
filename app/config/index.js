/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var _ = require('lodash'),
  production = require('./env-prod'),
  development = require('./env-dev');

var configs = _.extend({}, production);

configs.ENV_PRODUCTION = 'production';
configs.ENV_DEVELOPMENT = 'development';
configs.ENV_STAGING = 'staging';
configs.ENV_TESTS = 'tests';

if (typeof process.env.NODE_ENV == 'undefined') {
  process.env.NODE_ENV = configs.ENV_DEVELOPMENT;
}

switch (process.env.NODE_ENV) {
  case configs.ENV_PRODUCTION:
  case configs.ENV_STAGING:
    configs = _.merge(configs, {});
    break;
  case configs.ENV_DEVELOPMENT:
  case configs.ENV_TESTS:
    configs = _.merge(configs, development);
    break;
}

configs.environment = process.env.NODE_ENV;
module.exports = configs;
