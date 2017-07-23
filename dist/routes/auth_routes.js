'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _require_auth = require('../utils/require_auth');

var _require_auth2 = _interopRequireDefault(_require_auth);

var _token = require('../utils/token');

var _token2 = _interopRequireDefault(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var redirectUrl = void 0; // Url to redirect back to mobile app

// Facebook auth routes
router.get('/facebook', function (req, res) {
  redirectUrl = req.query.linkingUri;
  _passport2.default.authenticate('facebook')(req, res);
});

router.get('/facebook/callback', _passport2.default.authenticate('facebook', { failureRedirect: '/facebook' }), function (req, res) {
  return res.redirect(redirectUrl + '?user=' + (0, _stringify2.default)(req.user) + '&token=' + (0, _token2.default)(req.user));
});

// Google auth routes
router.get('/google', function (req, res) {
  redirectUrl = req.query.linkingUri;
  _passport2.default.authenticate('google', { scope: ['profile'] })(req, res);
});

router.get('/google/callback', _passport2.default.authenticate('google', { failureRedirect: '/google' }), function (req, res) {
  return res.redirect(redirectUrl + '?user=' + (0, _stringify2.default)(req.user) + '&token=' + (0, _token2.default)(req.user));
});

exports.default = router;