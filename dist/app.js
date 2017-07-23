'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

if (process.env.NODE_ENV !== 'test') {
  _mongoose2.default.connect(process.env.MONGO_URI);

  _mongoose2.default.connection.once('open', function () {
    return console.log('Connected to database');
  }).on('error', function (err) {
    return console.warn(err);
  });
}

app.use((0, _helmet2.default)());
app.use(_bodyParser2.default.json({ type: '*/*' }));
app.use(_bodyParser2.default.urlencoded({ type: '*/x-www-form-urlencoded', extended: true }));
app.use((0, _cors2.default)());
app.use((0, _morgan2.default)('combined'));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

(0, _routes2.default)(app);

var port = 3000 || process.env.PORT;
app.listen(port, function () {
  return console.log('Listening on port ' + port);
});

exports.default = app;