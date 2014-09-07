/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var express = require('express'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  config = require('../config');

var app = express();
app.config = config;

app.use(methodOverride());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('../library/handler')(app);
require('../routes')(app);

app.run = function() {
  return app.listen(config.server.port);
};

module.exports = app;