'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _passport3 = require('passport');

var _passport4 = _interopRequireDefault(_passport3);

var _require_auth = require('../utils/require_auth');

var _require_auth2 = _interopRequireDefault(_require_auth);

var _token = require('../utils/token');

var _token2 = _interopRequireDefault(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
  // app.use('/api/auth', authRoutes);

  var redirectUrl = void 0; // Url to redirect back to mobile app

  // Facebook auth routes
  app.get('/api/auth/facebook', function (req, res) {
    redirectUrl = req.query.linkingUri;
    _passport4.default.authenticate('facebook')(req, res);
  });

  app.get('/api/auth/facebook/callback', _passport4.default.authenticate('facebook', { failureRedirect: '/api/auth/facebook' }), function (req, res) {
    return res.redirect(redirectUrl + '?user=' + (0, _stringify2.default)(req.user) + '&token=' + (0, _token2.default)(req.user));
  });

  // Google auth routes
  app.get('/api/auth/google', function (req, res) {
    redirectUrl = req.query.linkingUri;
    _passport4.default.authenticate('google', { scope: ['profile'] })(req, res);
  });

  app.get('/api/auth/google/callback', _passport4.default.authenticate('google', { failureRedirect: '/api/auth/google' }), function (req, res) {
    return res.redirect(redirectUrl + '?user=' + (0, _stringify2.default)(req.user) + '&token=' + (0, _token2.default)(req.user));
  });
  app.use('/api/user', _user_routes2.default);
  app.use('/api/playlist', _playlist_routes2.default);
  app.use('/api/song', _song_routes2.default);
};