/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var express = require('express'),
  methodOverride = require('method-override'),
  config = require('../config');

var app = express();

app.use(methodOverride());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./toolbox/handler')(app);
require('../routes')(app);

app.run = function() {
  return app.listen(config.server.port);
};
