'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require('../services/passport');

var _passport2 = _interopRequireDefault(_passport);

var _auth_routes = require('./auth_routes');

var _auth_routes2 = _interopRequireDefault(_auth_routes);

var _user_routes = require('./user_routes');

var _user_routes2 = _interopRequireDefault(_user_routes);

var _playlist_routes = require('./playlist_routes');

var _playlist_routes2 = _interopRequireDefault(_playlist_routes);

var _song_routes = require('./song_routes');

var _song_routes2 = _interopRequireDefault(_song_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
  app.use('/api/auth', _auth_routes2.default);
  app.use('/api/user', _user_routes2.default);
  app.use('/api/playlist', _playlist_routes2.default);
  app.use('/api/song', _song_routes2.default);
};