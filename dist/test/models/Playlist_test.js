'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _chai = require('chai');

var _Playlist = require('../../models/Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

var _Song = require('../../models/Song');

var _Song2 = _interopRequireDefault(_Song);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Playlist', function () {
  var playlist = void 0;
  var user1 = void 0;
  var user2 = void 0;
  var song1 = void 0;
  var song2 = void 0;

  beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user1 = new _User2.default({});
            user2 = new _User2.default({});
            song1 = new _Song2.default({ youTubeUrl: 'https://www.youtube.com/watch?v=Kg8Rk5DDQlA' });
            song2 = new _Song2.default({ youTubeUrl: 'https://www.youtube.com/watch?v=Kg8Rk5DDQlA' });

            playlist = new _Playlist2.default({
              title: 'testPlaylist',
              forUser: user1,
              byUser: user2,
              songs: [song1, song2],
              lastSongPlayed: song1,
              lastUpdated: Date.now()
            });

            _context.prev = 5;
            _context.next = 8;
            return user1.save();

          case 8:
            _context.next = 10;
            return user2.save();

          case 10:
            _context.next = 12;
            return song1.save();

          case 12:
            _context.next = 14;
            return song2.save();

          case 14:
            _context.next = 16;
            return playlist.save();

          case 16:
            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context['catch'](5);

            console.log(_context.t0);

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[5, 18]]);
  })));

  it('creates a new playlist', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _Playlist2.default.find({});

          case 2:
            result = _context2.sent;

            (0, _chai.expect)(result.length).to.equal(1);
            (0, _chai.expect)(result[0]._id).to.eql(playlist._id);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('creates a playlist with a "title" property', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _Playlist2.default.findById(playlist._id);

          case 2:
            result = _context3.sent;

            (0, _chai.expect)(result).to.have.property('title');
            (0, _chai.expect)(result.title).to.equal('testPlaylist');

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('creates a playlist with a "dateAdded" property', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    var result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _Playlist2.default.findById(playlist._id);

          case 2:
            result = _context4.sent;

            (0, _chai.expect)(result).to.have.property('dateAdded');
            (0, _chai.expect)(result.dateAdded).to.be.a('date');

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('creates a playlist with a "forUser" property', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
    var result;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _Playlist2.default.findById(playlist._id).populate('forUser');

          case 2:
            result = _context5.sent;

            (0, _chai.expect)(result).to.have.property('forUser');
            (0, _chai.expect)(result.forUser._id).to.eql(user1._id);

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  it('creates a playlist with a "byUser" property', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
    var result;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _Playlist2.default.findById(playlist._id).populate('byUser');

          case 2:
            result = _context6.sent;

            (0, _chai.expect)(result).to.have.property('byUser');
            (0, _chai.expect)(result.byUser._id).to.eql(user2._id);

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  it('creates a playlist with a "lastSongPlayed" property', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
    var result;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _Playlist2.default.findById(playlist._id).populate('lastSongPlayed');

          case 2:
            result = _context7.sent;

            (0, _chai.expect)(result).to.have.property('lastSongPlayed');
            (0, _chai.expect)(result.lastSongPlayed._id).to.eql(song1._id);

          case 5:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  it('creates a playlist with a "lastUpdated" property', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
    var result;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return _Playlist2.default.findById(playlist._id);

          case 2:
            result = _context8.sent;

            (0, _chai.expect)(result).to.have.property('lastUpdated');
            (0, _chai.expect)(result.lastUpdated).to.be.a('date');

          case 5:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));
});