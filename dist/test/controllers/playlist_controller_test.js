'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _chai = require('chai');

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _Playlist = require('../../models/Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

var _Song = require('../../models/Song');

var _Song2 = _interopRequireDefault(_Song);

var _token = require('../../utils/token');

var _token2 = _interopRequireDefault(_token);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('playlistController', function () {
  var user1 = void 0,
      user1Token = void 0;
  var user2 = void 0,
      user2Token = void 0;

  beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user1 = new _User2.default({
              firstName: 'Test',
              lastName: 'User',
              displayName: 'Test User 1',
              profileImg: 'http://www.somesite.com/someimg.png'
            });

            user2 = new _User2.default({
              firstName: 'Test',
              lastName: 'User',
              displayName: 'Test User 2',
              profileImg: 'http://www.somesite.com/someimg.png'
            });

            user1Token = (0, _token2.default)(user1);
            user2Token = (0, _token2.default)(user2);
            _context.next = 6;
            return user1.save();

          case 6:
            _context.next = 8;
            return user2.save();

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  /*****************************************************************************
  ******************************* .createPlaylist ******************************
  *****************************************************************************/
  describe('.createPlaylist', function () {
    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      var res;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _supertest2.default)(_app2.default).post('/api/playlist');

            case 2:
              res = _context2.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    it('creates a new playlist following a successful POST request', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
      var res, createdPlaylist;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _supertest2.default)(_app2.default).post('/api/playlist').send({ title: 'Test Playlist', forUser: user2 }).set('authorization', user1Token);

            case 2:
              res = _context3.sent;
              _context3.next = 5;
              return _Playlist2.default.findOne({ title: 'Test Playlist' });

            case 5:
              createdPlaylist = _context3.sent;

              (0, _chai.expect)(res.status).to.equal(201);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(createdPlaylist).to.not.equal(undefined);

            case 9:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));

    it('throws an error if the title is not provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
      var res, foundPlaylist;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _supertest2.default)(_app2.default).post('/api/playlist').send({ forUser: user2 }).set('authorization', user1Token);

            case 2:
              res = _context4.sent;
              _context4.next = 5;
              return _Playlist2.default.findOne({ title: 'A' });

            case 5:
              foundPlaylist = _context4.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('Playlist title must be provided.');
              (0, _chai.expect)(foundPlaylist).to.equal(null);

            case 10:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));

    it('throws an error if the title provided is too short', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
      var res, foundPlaylist;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _supertest2.default)(_app2.default).post('/api/playlist').send({ title: 'A', forUser: user2 }).set('authorization', user1Token);

            case 2:
              res = _context5.sent;
              _context5.next = 5;
              return _Playlist2.default.findOne({ title: 'A' });

            case 5:
              foundPlaylist = _context5.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('Playlist title must be at least 4 characters long.');
              (0, _chai.expect)(foundPlaylist).to.equal(null);

            case 10:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));

    it('throws an error if the title provided is too long', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
      var res, foundPlaylist;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return (0, _supertest2.default)(_app2.default).post('/api/playlist').send({ title: '123456789012345678901234567890123456789012345678901', forUser: user2 }).set('authorization', user1Token);

            case 2:
              res = _context6.sent;
              _context6.next = 5;
              return _Playlist2.default.findOne({ title: '123456789012345678901234567890123456789012345678901' });

            case 5:
              foundPlaylist = _context6.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('Playlist title must be no more than 30 characters long.');
              (0, _chai.expect)(foundPlaylist).to.equal(null);

            case 10:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    })));

    it('throws an error if "forUser" data is not provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
      var res, foundPlaylist;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return (0, _supertest2.default)(_app2.default).post('/api/playlist').send({ title: 'Test Playlist' }).set('authorization', user1Token);

            case 2:
              res = _context7.sent;
              _context7.next = 5;
              return _Playlist2.default.findOne({ title: 'Test Playlist' });

            case 5:
              foundPlaylist = _context7.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('A recipient user must be provided.');
              (0, _chai.expect)(foundPlaylist).to.equal(null);

            case 10:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    })));
  });

  /*****************************************************************************
  ******************************* .deletePlaylist ******************************
  *****************************************************************************/
  describe('.deletePlaylist', function () {
    var playlist = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              playlist = new _Playlist2.default({
                title: 'Test Playlist',
                byUser: user1,
                forUser: user2
              });

              _context8.next = 3;
              return playlist.save();

            case 3:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, undefined);
    })));

    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {
      var res;
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return (0, _supertest2.default)(_app2.default).delete('/api/playlist/' + playlist._id);

            case 2:
              res = _context9.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, undefined);
    })));

    it('sends an error if an invalid playlist ID is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10() {
      var res;
      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return (0, _supertest2.default)(_app2.default).delete('/api/playlist/12345').set('authorization', user1Token);

            case 2:
              res = _context10.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The playlist ID provided is invalid.');

            case 6:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, undefined);
    })));

    it('sends an error if the playlist does not exist.', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11() {
      var playlist2, res;
      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              playlist2 = new _Playlist2.default({ title: 'Test Playlist2' });
              _context11.next = 3;
              return (0, _supertest2.default)(_app2.default).delete('/api/playlist/' + playlist2._id).set('authorization', user1Token);

            case 3:
              res = _context11.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The playlist specified does not exist.');

            case 7:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, undefined);
    })));

    it('sends an error message if a user tries to delete a playlist that is not theirs', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12() {
      var user3, user3Token, res;
      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              user3 = new _User2.default({
                firstName: 'Test',
                lastName: 'User',
                displayName: 'Test User3'
              });
              user3Token = (0, _token2.default)(user3);
              _context12.next = 4;
              return user3.save();

            case 4:
              _context12.next = 6;
              return (0, _supertest2.default)(_app2.default).delete('/api/playlist/' + playlist._id).set('authorization', user3Token);

            case 6:
              res = _context12.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal("You don't have permission to delete this playlist.");

            case 10:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, undefined);
    })));

    it('allows the "byUser" to delete a playlist', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13() {
      var res, deletedPlaylist;
      return _regenerator2.default.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return (0, _supertest2.default)(_app2.default).delete('/api/playlist/' + playlist._id).set('authorization', user1Token);

            case 2:
              res = _context13.sent;
              _context13.next = 5;
              return _Playlist2.default.findById(playlist._id);

            case 5:
              deletedPlaylist = _context13.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(res.body.success.playlist._id).to.equal(playlist._id.toString());
              (0, _chai.expect)(deletedPlaylist).to.equal(null);

            case 10:
            case 'end':
              return _context13.stop();
          }
        }
      }, _callee13, undefined);
    })));

    it('allows the "forUser" to delete a playlist', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14() {
      var res, deletedPlaylist;
      return _regenerator2.default.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return (0, _supertest2.default)(_app2.default).delete('/api/playlist/' + playlist._id).set('authorization', user2Token);

            case 2:
              res = _context14.sent;
              _context14.next = 5;
              return _Playlist2.default.findById(playlist._id);

            case 5:
              deletedPlaylist = _context14.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(res.body.success.playlist._id).to.equal(playlist._id.toString());
              (0, _chai.expect)(deletedPlaylist).to.equal(null);

            case 10:
            case 'end':
              return _context14.stop();
          }
        }
      }, _callee14, undefined);
    })));
  });

  /*****************************************************************************
  ***************************** .editPlaylistTitle *****************************
  *****************************************************************************/
  describe('.editPlaylistTitle', function () {
    var playlist = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15() {
      return _regenerator2.default.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              playlist = new _Playlist2.default({
                title: 'Test Playlist',
                byUser: user1,
                forUser: user2
              });

              _context15.next = 3;
              return playlist.save();

            case 3:
            case 'end':
              return _context15.stop();
          }
        }
      }, _callee15, undefined);
    })));

    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16() {
      var res;
      return _regenerator2.default.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/title/' + playlist._id);

            case 2:
              res = _context16.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context16.stop();
          }
        }
      }, _callee16, undefined);
    })));

    it('sends an error if an invalid playlist ID is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17() {
      var res;
      return _regenerator2.default.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/title/12345').send({ title: 'New Title' }).set('authorization', user1Token);

            case 2:
              res = _context17.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The playlist ID provided is invalid.');

            case 6:
            case 'end':
              return _context17.stop();
          }
        }
      }, _callee17, undefined);
    })));

    it('sends an error if the playlist does not exist.', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18() {
      var playlist2, res;
      return _regenerator2.default.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              playlist2 = new _Playlist2.default({ title: 'Test Playlist2' });
              _context18.next = 3;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/title/' + playlist2._id).send({ title: 'New Title' }).set('authorization', user1Token);

            case 3:
              res = _context18.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The playlist specified does not exist.');

            case 7:
            case 'end':
              return _context18.stop();
          }
        }
      }, _callee18, undefined);
    })));

    it('sends an error message if a user tries to edit a playlist that is not theirs', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19() {
      var user3, user3Token, res;
      return _regenerator2.default.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              user3 = new _User2.default({
                firstName: 'Test',
                lastName: 'User',
                displayName: 'Test User3'
              });
              user3Token = (0, _token2.default)(user3);
              _context19.next = 4;
              return user3.save();

            case 4:
              _context19.next = 6;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/title/' + playlist._id).set('authorization', user3Token);

            case 6:
              res = _context19.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal("You don't have permission to edit this playlist.");

            case 10:
            case 'end':
              return _context19.stop();
          }
        }
      }, _callee19, undefined);
    })));

    it('allows the "byUser" to edit a playlist title', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20() {
      var res, editedPlaylist;
      return _regenerator2.default.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/title/' + playlist._id).send({ title: 'New Title' }).set('authorization', user1Token);

            case 2:
              res = _context20.sent;
              _context20.next = 5;
              return _Playlist2.default.findById(playlist._id);

            case 5:
              editedPlaylist = _context20.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(res.body.success.playlist._id).to.equal(playlist._id.toString());
              (0, _chai.expect)(editedPlaylist.title).to.equal('New Title');

            case 10:
            case 'end':
              return _context20.stop();
          }
        }
      }, _callee20, undefined);
    })));

    it('allows the "forUser" to edit a playlist title', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21() {
      var res, editedPlaylist;
      return _regenerator2.default.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/title/' + playlist._id).send({ title: 'New Title' }).set('authorization', user2Token);

            case 2:
              res = _context21.sent;
              _context21.next = 5;
              return _Playlist2.default.findById(playlist._id);

            case 5:
              editedPlaylist = _context21.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(res.body.success.playlist._id).to.equal(playlist._id.toString());
              (0, _chai.expect)(editedPlaylist.title).to.equal('New Title');

            case 10:
            case 'end':
              return _context21.stop();
          }
        }
      }, _callee21, undefined);
    })));
  });

  /*****************************************************************************
  **************************** .updateLastSongPlayed ***************************
  *****************************************************************************/
  describe('.updateLastSongPlayed', function () {
    var playlist = void 0;
    var song = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee22() {
      return _regenerator2.default.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              playlist = new _Playlist2.default({
                title: 'Test Playlist',
                byUser: user1,
                forUser: user2
              });

              song = new _Song2.default({ youTubeUrl: 'https://www.youtube.com/watch?v=wFSvUMxDWak' });

              _context22.next = 4;
              return playlist.save();

            case 4:
              _context22.next = 6;
              return song.save();

            case 6:
            case 'end':
              return _context22.stop();
          }
        }
      }, _callee22, undefined);
    })));

    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee23() {
      var res;
      return _regenerator2.default.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/lastsongplayed/' + playlist._id);

            case 2:
              res = _context23.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context23.stop();
          }
        }
      }, _callee23, undefined);
    })));

    it('sends an error if an invalid playlist ID is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee24() {
      var res;
      return _regenerator2.default.wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              _context24.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/lastsongplayed/12345').send({ songId: song._id }).set('authorization', user1Token);

            case 2:
              res = _context24.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The playlist ID provided is invalid.');

            case 6:
            case 'end':
              return _context24.stop();
          }
        }
      }, _callee24, undefined);
    })));

    it('sends an error if the playlist does not exist.', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee25() {
      var playlist2, res;
      return _regenerator2.default.wrap(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              playlist2 = new _Playlist2.default({ title: 'Test Playlist2' });
              _context25.next = 3;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/lastsongplayed/' + playlist2._id).send({ songId: song._id }).set('authorization', user1Token);

            case 3:
              res = _context25.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The playlist specified does not exist.');

            case 7:
            case 'end':
              return _context25.stop();
          }
        }
      }, _callee25, undefined);
    })));

    it('sends an error message if a user tries to edit a playlist that is not theirs', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee26() {
      var user3, user3Token, res;
      return _regenerator2.default.wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              user3 = new _User2.default({
                firstName: 'Test',
                lastName: 'User',
                displayName: 'Test User3'
              });
              user3Token = (0, _token2.default)(user3);
              _context26.next = 4;
              return user3.save();

            case 4:
              _context26.next = 6;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/lastsongplayed/' + playlist._id).send({ songId: song._id }).set('authorization', user3Token);

            case 6:
              res = _context26.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal("You don't have permission to update this playlist.");

            case 10:
            case 'end':
              return _context26.stop();
          }
        }
      }, _callee26, undefined);
    })));

    it('sends an error if an invalid song ID is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee27() {
      var res;
      return _regenerator2.default.wrap(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              _context27.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/lastsongplayed/' + playlist._id).send({ songId: 'A24fadsf' }).set('authorization', user1Token);

            case 2:
              res = _context27.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The song ID provided is invalid.');

            case 6:
            case 'end':
              return _context27.stop();
          }
        }
      }, _callee27, undefined);
    })));

    it('sends an error if the song does not exist.', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee28() {
      var song2, res;
      return _regenerator2.default.wrap(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              song2 = new _Playlist2.default({ youTubeUrl: 'https://www.youtube.com/watch?v=RUJMqVkSMh4' });
              _context28.next = 3;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/lastsongplayed/' + playlist._id).send({ songId: song2._id }).set('authorization', user1Token);

            case 3:
              res = _context28.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The song specified does not exist.');

            case 7:
            case 'end':
              return _context28.stop();
          }
        }
      }, _callee28, undefined);
    })));

    it("successfully updates a playlist's 'lastSongPlayed' field", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee29() {
      var res, foundPlaylist;
      return _regenerator2.default.wrap(function _callee29$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              _context29.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/playlist/lastsongplayed/' + playlist._id).send({ songId: song._id }).set('authorization', user1Token);

            case 2:
              res = _context29.sent;
              _context29.next = 5;
              return _Playlist2.default.findById(playlist._id);

            case 5:
              foundPlaylist = _context29.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(res.body.success.playlist.ok).to.equal(1);
              (0, _chai.expect)(song._id.equals(foundPlaylist.lastSongPlayed)).to.equal(true);

            case 10:
            case 'end':
              return _context29.stop();
          }
        }
      }, _callee29, undefined);
    })));
  });

  /*****************************************************************************
  **************************** .fetchForUserPlaylists **************************
  *****************************************************************************/
  describe('.fetchForUserPlaylists', function () {
    var playlist1 = void 0,
        playlist2 = void 0,
        playlist3 = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee30() {
      return _regenerator2.default.wrap(function _callee30$(_context30) {
        while (1) {
          switch (_context30.prev = _context30.next) {
            case 0:
              playlist1 = new _Playlist2.default({
                title: 'Playlist1',
                forUser: user1,
                byUser: user2
              });

              playlist2 = new _Playlist2.default({
                title: 'Playlist2',
                forUser: user1,
                byUser: user2
              });

              playlist3 = new _Playlist2.default({
                title: 'Playlist3',
                forUser: user2,
                byUser: user1
              });

              _context30.next = 5;
              return playlist1.save();

            case 5:
              _context30.next = 7;
              return playlist2.save();

            case 7:
              _context30.next = 9;
              return playlist3.save();

            case 9:
            case 'end':
              return _context30.stop();
          }
        }
      }, _callee30, undefined);
    })));

    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee31() {
      var res;
      return _regenerator2.default.wrap(function _callee31$(_context31) {
        while (1) {
          switch (_context31.prev = _context31.next) {
            case 0:
              _context31.next = 2;
              return (0, _supertest2.default)(_app2.default).get('/api/playlist/foruser/');

            case 2:
              res = _context31.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context31.stop();
          }
        }
      }, _callee31, undefined);
    })));

    it('returns an array of playlists folllowing a successful GET request', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee32() {
      var res;
      return _regenerator2.default.wrap(function _callee32$(_context32) {
        while (1) {
          switch (_context32.prev = _context32.next) {
            case 0:
              _context32.next = 2;
              return (0, _supertest2.default)(_app2.default).get('/api/playlist/foruser/').set('authorization', user1Token);

            case 2:
              res = _context32.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(res.body.success.playlists.length).to.equal(2);
              (0, _chai.expect)(_lodash2.default.findIndex(res.body.success.playlists, { _id: playlist1._id.toString() })).to.not.equal(-1);
              (0, _chai.expect)(_lodash2.default.findIndex(res.body.success.playlists, { _id: playlist2._id.toString() })).to.not.equal(-1);
              (0, _chai.expect)(_lodash2.default.findIndex(res.body.success.playlists, { _id: playlist3._id.toString() })).to.equal(-1);

            case 9:
            case 'end':
              return _context32.stop();
          }
        }
      }, _callee32, undefined);
    })));
  });

  /*****************************************************************************
  **************************** .fetchByUserPlaylists ***************************
  *****************************************************************************/
  describe('.fetchByUserPlaylists', function () {
    var playlist1 = void 0,
        playlist2 = void 0,
        playlist3 = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee33() {
      return _regenerator2.default.wrap(function _callee33$(_context33) {
        while (1) {
          switch (_context33.prev = _context33.next) {
            case 0:
              playlist1 = new _Playlist2.default({
                title: 'Playlist1',
                forUser: user1,
                byUser: user2
              });

              playlist2 = new _Playlist2.default({
                title: 'Playlist2',
                forUser: user1,
                byUser: user2
              });

              playlist3 = new _Playlist2.default({
                title: 'Playlist3',
                forUser: user2,
                byUser: user1
              });

              _context33.next = 5;
              return playlist1.save();

            case 5:
              _context33.next = 7;
              return playlist2.save();

            case 7:
              _context33.next = 9;
              return playlist3.save();

            case 9:
            case 'end':
              return _context33.stop();
          }
        }
      }, _callee33, undefined);
    })));

    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee34() {
      var res;
      return _regenerator2.default.wrap(function _callee34$(_context34) {
        while (1) {
          switch (_context34.prev = _context34.next) {
            case 0:
              _context34.next = 2;
              return (0, _supertest2.default)(_app2.default).get('/api/playlist/byuser');

            case 2:
              res = _context34.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context34.stop();
          }
        }
      }, _callee34, undefined);
    })));

    it('returns an array of playlists folllowing a successful GET request', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee35() {
      var res;
      return _regenerator2.default.wrap(function _callee35$(_context35) {
        while (1) {
          switch (_context35.prev = _context35.next) {
            case 0:
              _context35.next = 2;
              return (0, _supertest2.default)(_app2.default).get('/api/playlist/byuser').set('authorization', user1Token);

            case 2:
              res = _context35.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(res.body.success.playlists.length).to.equal(1);
              (0, _chai.expect)(_lodash2.default.findIndex(res.body.success.playlists, { _id: playlist1._id.toString() })).to.equal(-1);
              (0, _chai.expect)(_lodash2.default.findIndex(res.body.success.playlists, { _id: playlist2._id.toString() })).to.equal(-1);
              (0, _chai.expect)(_lodash2.default.findIndex(res.body.success.playlists, { _id: playlist3._id.toString() })).to.not.equal(-1);

            case 9:
            case 'end':
              return _context35.stop();
          }
        }
      }, _callee35, undefined);
    })));
  });
});