/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

var path = require('path'),
  morgan = require('morgan'),
  express = require('express'),
  multer = require('multer'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  config = require('../config');

var app = express();
app.config = config;

app.use(methodOverride());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../../public')));

app.use(multer({
  dest: __dirname + '/../storage/tmp'
}));

app.use(morgan({
  immediate: false,
  format: function(tokens, req, res) {

    var statusColor = 32; // green
    var status = res.statusCode;

    if (status >= 500) statusColor = 31; // red
    else if (status >= 400) statusColor = 33; // yellow
    else if (status >= 300) statusColor = 36; // cyan
    return [
      '==> \x1b[90m' + req.method,
      req.originalUrl + '',
      '\x1b[' + statusColor + 'm' + status,
      '\x1b[90m:' + tokens['response-time'](req, res) + ' ms',
      '- ' + tokens['res'](req, res, 'content-length') + ' bytes',
      '\x1b[0m',
      "\n",
      '  req_body: ' + JSON.stringify(req.body),
      "\n",
      '  req_query: ' + JSON.stringify(req.query)
    ].join(' ');
  }
}));

require('../library/handler')(app);
require('../routes')(app);

app.run = function() {
  return app.listen(config.server.port);
};


module.exports = app;
