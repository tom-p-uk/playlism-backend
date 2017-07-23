'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _chai = require('chai');

var _Song = require('../../models/Song');

var _Song2 = _interopRequireDefault(_Song);

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

var _Playlist = require('../../models/Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Song', function () {
  var song = void 0;
  var user1 = void 0;
  var user2 = void 0;
  var playlist = void 0;

  beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            song = new _Song2.default({ youTubeUrl: 'https://www.youtube.com/watch?v=Kg8Rk5DDQlA' });

            _context.prev = 1;
            _context.next = 4;
            return song.save();

          case 4:
            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context['catch'](1);

            console.log(_context.t0);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 6]]);
  })));

  it('creates a new song', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _Song2.default.find({});

          case 2:
            result = _context2.sent;

            (0, _chai.expect)(result.length).to.equal(1);
            (0, _chai.expect)(result[0]._id).to.eql(song._id);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('adds a date to the "dateAdded" field', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _Song2.default.findById(song._id);

          case 2:
            result = _context3.sent;


            (0, _chai.expect)(result).to.have.property('dateAdded');
            (0, _chai.expect)(result.dateAdded).to.be.a('date');

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('can add a user to the "likedByUsers" field', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    var result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            user1 = new _User2.default({ displayName: 'Test User' });
            song.likedByUsers.push(user1);
            _context4.next = 4;
            return user1.save();

          case 4:
            _context4.next = 6;
            return song.save();

          case 6:
            _context4.next = 8;
            return _Song2.default.findById(song._id).populate('likedByUsers');

          case 8:
            result = _context4.sent;

            (0, _chai.expect)(result.likedByUsers.length).to.equal(1);
            (0, _chai.expect)(result.likedByUsers[0]._id).to.eql(user1._id);

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('can add a playlist to the "inPlaylists" array', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
    var result;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            user1 = new _User2.default({ displayName: 'Test User1' });
            user2 = new _User2.default({ displayName: 'Test User2' });
            playlist = new _Playlist2.default({ title: 'Test Playlist', byUser: user1, forUser: user2 });
            song.inPlaylists.push(playlist);
            _context5.next = 6;
            return user1.save();

          case 6:
            _context5.next = 8;
            return user2.save();

          case 8:
            _context5.next = 10;
            return playlist.save();

          case 10:
            _context5.next = 12;
            return song.save();

          case 12:
            _context5.next = 14;
            return _Song2.default.findById(song._id);

          case 14:
            result = _context5.sent;

            (0, _chai.expect)(result.inPlaylists[0].equals(playlist._id)).to.equal(true);

          case 16:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));
});