'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _validate_playlist = require('../../helpers/validate_playlist');

var _validate_playlist2 = _interopRequireDefault(_validate_playlist);

var _chai = require('chai');

var _Playlist = require('../../models/Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('validatePlaylist', function () {
  var playlist = void 0;
  var user1 = void 0,
      user2 = void 0;

  beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user1 = new _User2.default({
              firstName: 'Test',
              lastName: 'User',
              displayName: 'Test User1'
            });

            user2 = new _User2.default({
              firstName: 'Test',
              lastName: 'User',
              displayName: 'Test User2'
            });

            playlist = new _Playlist2.default({
              title: 'Test Playlist',
              forUser: user1,
              byUser: user2
            });

            _context.next = 5;
            return user1.save();

          case 5:
            _context.next = 7;
            return user2.save();

          case 7:
            _context.next = 9;
            return playlist.save();

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('returns an object containing status and error props if an invalid playlistId is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _validate_playlist2.default)('12345', user1, 'access');

          case 2:
            result = _context2.sent;


            (0, _chai.expect)(result.status).to.exist;
            (0, _chai.expect)(result.error).to.exist;
            (0, _chai.expect)(result.status).to.equal(422);
            (0, _chai.expect)(result.error).to.equal('The playlist ID provided is invalid.');

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('returns an object containing status and error props if the playlistId provided does not exist', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var playlist2, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            playlist2 = new _Playlist2.default({});
            _context3.next = 3;
            return (0, _validate_playlist2.default)(playlist2._id, user1, 'access');

          case 3:
            result = _context3.sent;


            (0, _chai.expect)(result.status).to.exist;
            (0, _chai.expect)(result.error).to.exist;
            (0, _chai.expect)(result.status).to.equal(422);
            (0, _chai.expect)(result.error).to.equal('The playlist specified does not exist.');

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('returns an object containing status and error props if the user provided is not the forUser or byUser', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    var user3, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            user3 = new _User2.default({});
            _context4.next = 3;
            return (0, _validate_playlist2.default)(playlist._id, user3, 'access');

          case 3:
            result = _context4.sent;


            (0, _chai.expect)(result.status).to.exist;
            (0, _chai.expect)(result.error).to.exist;
            (0, _chai.expect)(result.status).to.equal(401);
            (0, _chai.expect)(result.error).to.equal("You don't have permission to access this playlist.");

          case 8:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('returns a Playlist object', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
    var result;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _validate_playlist2.default)(playlist._id, user1, 'access');

          case 2:
            result = _context5.sent;


            (0, _chai.expect)(result.title).to.equal('Test Playlist');
            (0, _chai.expect)(result._id.equals(playlist._id)).to.equal(true);
            (0, _chai.expect)(result.forUser.equals(user1._id)).to.equal(true);
            (0, _chai.expect)(result.byUser.equals(user2._id)).to.equal(true);

          case 7:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));
});