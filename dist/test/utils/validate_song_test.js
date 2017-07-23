'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _validate_song = require('../../utils/validate_song');

var _validate_song2 = _interopRequireDefault(_validate_song);

var _chai = require('chai');

var _Song = require('../../models/Song');

var _Song2 = _interopRequireDefault(_Song);

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('validateSong', function () {
  var user = void 0;
  var song = void 0;

  beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = new _User2.default({
              firstName: 'Test',
              lastName: 'User',
              displayName: 'Test User1'
            });

            song = new _Song2.default({ youTubeUrl: 'https://www.youtube.com/watch?v=RUJMqVkSMh4' });

            _context.next = 4;
            return user.save();

          case 4:
            _context.next = 6;
            return song.save();

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('returns an object containing status and error props if an invalid songId is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _validate_song2.default)('12345', user);

          case 2:
            result = _context2.sent;


            (0, _chai.expect)(result.status).to.exist;
            (0, _chai.expect)(result.error).to.exist;
            (0, _chai.expect)(result.status).to.equal(422);
            (0, _chai.expect)(result.error).to.equal('The song ID provided is invalid.');

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('returns an object containing status and error props if the songId provided does not exist', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var song2, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            song2 = new _Song2.default({});
            _context3.next = 3;
            return (0, _validate_song2.default)(song2._id, user);

          case 3:
            result = _context3.sent;


            (0, _chai.expect)(result.status).to.exist;
            (0, _chai.expect)(result.error).to.exist;
            (0, _chai.expect)(result.status).to.equal(422);
            (0, _chai.expect)(result.error).to.equal('The song specified does not exist.');

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('returns a Song object', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    var result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _validate_song2.default)(song._id, user);

          case 2:
            result = _context4.sent;


            (0, _chai.expect)(result.youTubeUrl).to.equal('https://www.youtube.com/watch?v=RUJMqVkSMh4');
            (0, _chai.expect)(result._id.equals(song._id)).to.equal(true);

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});