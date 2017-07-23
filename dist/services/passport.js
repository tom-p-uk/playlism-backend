'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require('passport-facebook');

var _passportFacebook2 = _interopRequireDefault(_passportFacebook);

var _passportGoogleOauth = require('passport-google-oauth20');

var _passportGoogleOauth2 = _interopRequireDefault(_passportGoogleOauth);

var _passportJwt = require('passport-jwt');

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var facebookOptions = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'https://playlism.herokuapp.com/api/auth/facebook/callback',
  profileFields: ['id', 'name', 'picture.type(large)']
};

var googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://playlism.herokuapp.com/api/auth/google/callback'
};

var jwtOptions = {
  jwtFromRequest: _passportJwt.ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET
};

var facebookLogin = new _passportFacebook2.default(facebookOptions, function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(accessToken, refreshToken, profile, done) {
    var _profile$_json, id, first_name, last_name, picture, user;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _profile$_json = profile._json, id = _profile$_json.id, first_name = _profile$_json.first_name, last_name = _profile$_json.last_name, picture = _profile$_json.picture;
            _context.next = 4;
            return _User2.default.findOrCreate({ 'facebookId': id }, {
              displayName: first_name + ' ' + last_name,
              facebookId: id,
              firstName: first_name,
              lastName: last_name,
              profileImg: encodeURIComponent(profile.photos[0].value)
            });

          case 4:
            user = _context.sent;


            done(null, user.result);
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](0);

            done(_context.t0);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 8]]);
  }));

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}());

var googleLogin = new _passportGoogleOauth2.default(googleOptions, function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(accessToken, refreshToken, profile, done) {
    var _profile$_json2, id, name, displayName, image, user;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _profile$_json2 = profile._json, id = _profile$_json2.id, name = _profile$_json2.name, displayName = _profile$_json2.displayName, image = _profile$_json2.image;
            _context2.next = 4;
            return _User2.default.findOrCreate({ 'googleId': id }, {
              displayName: displayName,
              googleId: id,
              firstName: name.givenName,
              lastName: name.familyName,
              profileImg: encodeURIComponent(image.url)
            });

          case 4:
            user = _context2.sent;


            done(null, user.result);
            _context2.next = 11;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](0);

            done(_context2.t0);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 8]]);
  }));

  return function (_x5, _x6, _x7, _x8) {
    return _ref2.apply(this, arguments);
  };
}());

var jwtLogin = new _passportJwt.Strategy(jwtOptions, function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(jwt_payload, done) {
    var user;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _User2.default.findById(jwt_payload.sub);

          case 3:
            user = _context3.sent;


            if (user) {
              done(null, user);
            } else {
              done(null, false);
            }
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3['catch'](0);

            done(_context3.t0, false);

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 7]]);
  }));

  return function (_x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}());

_passport2.default.serializeUser(function (user, done) {
  return done(null, user);
});
_passport2.default.deserializeUser(function (user, done) {
  return done(null, user);
});

_passport2.default.use(facebookLogin);
_passport2.default.use(googleLogin);
_passport2.default.use(jwtLogin);