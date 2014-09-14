/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var path = require('path'),
  express = require('express'),
  multer = require('multer'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  config = require('../config');

var app = express();
app.config = config;

app.use(methodOverride());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../../public')));

app.use(multer({
  dest: __dirname + '/../storage/tmp'
}));

require('../library/handler')(app);
require('../routes')(app);

app.run = function () {
  return app.listen(config.server.port);
};

module.exports = app;