'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Song = require('../../models/Song');

var _Song2 = _interopRequireDefault(_Song);

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

var _Playlist = require('../../models/Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _chai = require('chai');

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

var _token = require('../../utils/token');

var _token2 = _interopRequireDefault(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('songController', function () {
  var user1 = void 0,
      user2 = void 0;
  var user1Token = void 0,
      user2Token = void 0;
  var playlist1 = void 0,
      playlist2 = void 0;

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

            playlist1 = new _Playlist2.default({
              title: 'Test Playlist1',
              byUser: user1,
              forUser: user2
            });

            playlist2 = new _Playlist2.default({
              title: 'Test Playlist2',
              byUser: user2,
              forUser: user1
            });

            user1Token = (0, _token2.default)(user1);
            user2Token = (0, _token2.default)(user2);

            _context.next = 8;
            return user1.save();

          case 8:
            _context.next = 10;
            return user2.save();

          case 10:
            _context.next = 12;
            return playlist1.save();

          case 12:
            _context.next = 14;
            return playlist2.save();

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  /*****************************************************************************
  ********************************** .addsong **********************************
  *****************************************************************************/
  describe('.addSong', function () {
    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      var res;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _supertest2.default)(_app2.default).post('/api/song');

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

    it('sends an error if a youTubeUrl is not provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
      var res, foundSongs;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _supertest2.default)(_app2.default).post('/api/song').set('authorization', user1Token);

            case 2:
              res = _context3.sent;
              _context3.next = 5;
              return _Song2.default.find({});

            case 5:
              foundSongs = _context3.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('A YouTube URL must be provided.');
              (0, _chai.expect)(foundSongs.length).to.equal(0);

            case 10:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));

    it('sends an error if an invalid youTubeUrl is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
      var res, foundSongs;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _supertest2.default)(_app2.default).post('/api/song').send({ youTubeUrl: 'https://www.youtube.com/YoB8t0B4jx4' }).set('authorization', user1Token);

            case 2:
              res = _context4.sent;
              _context4.next = 5;
              return _Song2.default.find({});

            case 5:
              foundSongs = _context4.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The YouTube URL provided is invalid.');
              (0, _chai.expect)(foundSongs.length).to.equal(0);

            case 10:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));

    it('sends an error if a playlistId is not provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
      var res, foundSongs;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _supertest2.default)(_app2.default).post('/api/song').send({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4' }).set('authorization', user1Token);

            case 2:
              res = _context5.sent;
              _context5.next = 5;
              return _Song2.default.find({});

            case 5:
              foundSongs = _context5.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('A playlist ID must be provided.');
              (0, _chai.expect)(foundSongs.length).to.equal(0);

            case 10:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));

    it('sends an error if the playlistId provided is invalid', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
      var res, foundSongs;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return (0, _supertest2.default)(_app2.default).post('/api/song').send({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4', playlistId: 'abc' }).set('authorization', user1Token);

            case 2:
              res = _context6.sent;
              _context6.next = 5;
              return _Song2.default.find({});

            case 5:
              foundSongs = _context6.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The playlist ID provided is invalid.');
              (0, _chai.expect)(foundSongs.length).to.equal(0);

            case 10:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    })));

    it('adds a song following a successful POST request', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
      var res, foundSongs;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return (0, _supertest2.default)(_app2.default).post('/api/song').send({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4', playlistId: playlist1._id }).set('authorization', user1Token);

            case 2:
              res = _context7.sent;
              _context7.next = 5;
              return _Song2.default.find({});

            case 5:
              foundSongs = _context7.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(res.body.success.song.youTubeUrl).to.equal('https://www.youtube.com/watch?v=YoB8t0B4jx4');
              (0, _chai.expect)(foundSongs.length).to.equal(1);
              (0, _chai.expect)(foundSongs[0].inPlaylists[0].equals(playlist1._id)).to.equal(true);

            case 11:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    })));

    it("sends an error if the provided playlist already exists in a song's 'inPlaylists' array", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
      var song, res, foundSongs;
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              song = new _Song2.default({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4', inPlaylists: [playlist1._id] });
              _context8.next = 3;
              return song.save();

            case 3:
              _context8.next = 5;
              return (0, _supertest2.default)(_app2.default).post('/api/song').send({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4', playlistId: playlist1._id }).set('authorization', user1Token);

            case 5:
              res = _context8.sent;
              _context8.next = 8;
              return _Song2.default.find({});

            case 8:
              foundSongs = _context8.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('That song has already been added to the playlist.');
              (0, _chai.expect)(foundSongs.length).to.equal(1);

            case 13:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, undefined);
    })));

    it("adds a playlist to a song's 'inPlaylists' arr if song already exists", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {
      var song, res, foundSong;
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              song = new _Song2.default({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4', inPlaylists: [playlist1._id] });
              _context9.next = 3;
              return song.save();

            case 3:
              _context9.next = 5;
              return (0, _supertest2.default)(_app2.default).post('/api/song').send({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4', playlistId: playlist2._id }).set('authorization', user1Token);

            case 5:
              res = _context9.sent;
              _context9.next = 8;
              return _Song2.default.findOne({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4' });

            case 8:
              foundSong = _context9.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(res.body.success.song.youTubeUrl).to.equal('https://www.youtube.com/watch?v=YoB8t0B4jx4');
              (0, _chai.expect)(res.body.success.song.inPlaylists.length).to.equal(2);
              (0, _chai.expect)(foundSong.inPlaylists.length).to.equal(2);
              (0, _chai.expect)(foundSong.inPlaylists.indexOf(playlist1._id)).to.not.equal(-1);
              (0, _chai.expect)(foundSong.inPlaylists.indexOf(playlist2._id)).to.not.equal(-1);

            case 16:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, undefined);
    })));
  });

  /*****************************************************************************
  *************************** .deleteSongFromPlaylist **************************
  *****************************************************************************/
  describe('.deleteSongFromPlaylist', function () {
    var song = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10() {
      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              song = new _Song2.default({
                youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
                inPlaylists: [playlist1._id, playlist2._id]
              });
              _context10.next = 3;
              return song.save();

            case 3:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, undefined);
    })));

    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11() {
      var res;
      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return (0, _supertest2.default)(_app2.default).delete('/api/song/' + playlist1._id + '/' + song._id);

            case 2:
              res = _context11.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, undefined);
    })));

    it('sends an error if an invalid song ID is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12() {
      var res;
      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return (0, _supertest2.default)(_app2.default).delete('/api/song/' + playlist1._id + '/12345').set('authorization', user1Token);

            case 2:
              res = _context12.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The song ID provided is invalid.');

            case 6:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, undefined);
    })));

    it('sends an error if the song does not exist', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13() {
      var song2, res;
      return _regenerator2.default.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              song2 = new _Song2.default({ youTubeUrl: 'https://www.youtube.com/watch?v=RUJMqVkSMh4' });
              _context13.next = 3;
              return (0, _supertest2.default)(_app2.default).delete('/api/song/' + playlist1._id + '/' + song2._id).set('authorization', user1Token);

            case 3:
              res = _context13.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The song specified does not exist.');

            case 7:
            case 'end':
              return _context13.stop();
          }
        }
      }, _callee13, undefined);
    })));

    it('sends an error if an invalid playlist ID is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14() {
      var res;
      return _regenerator2.default.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return (0, _supertest2.default)(_app2.default).delete('/api/song/12345/' + song._id).set('authorization', user1Token);

            case 2:
              res = _context14.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The playlist ID provided is invalid.');

            case 6:
            case 'end':
              return _context14.stop();
          }
        }
      }, _callee14, undefined);
    })));

    it('sends an error if the playlist does not exist.', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15() {
      var playlist3, res;
      return _regenerator2.default.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              playlist3 = new _Playlist2.default({ title: 'Test Playlist3' });
              _context15.next = 3;
              return (0, _supertest2.default)(_app2.default).delete('/api/song/' + playlist3._id + '/' + song._id).set('authorization', user1Token);

            case 3:
              res = _context15.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The playlist specified does not exist.');

            case 7:
            case 'end':
              return _context15.stop();
          }
        }
      }, _callee15, undefined);
    })));

    it("removes a playlist from a song's 'inPlaylists' array", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16() {
      var res, foundSong;
      return _regenerator2.default.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return (0, _supertest2.default)(_app2.default).delete('/api/song/' + playlist1._id + '/' + song._id).set('authorization', user1Token);

            case 2:
              res = _context16.sent;
              _context16.next = 5;
              return _Song2.default.findById(song._id);

            case 5:
              foundSong = _context16.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundSong.inPlaylists.length).to.equal(1);
              (0, _chai.expect)(foundSong.inPlaylists.indexOf(playlist1._id)).to.equal(-1);

            case 10:
            case 'end':
              return _context16.stop();
          }
        }
      }, _callee16, undefined);
    })));

    it('removes a song altogether if it no longer has any associated playlists', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17() {
      var song2, res, foundSong;
      return _regenerator2.default.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              song2 = new _Song2.default({ youTubeUrl: 'https://www.youtube.com/watch?v=RUJMqVkSMh4', inPlaylists: [playlist1._id] });
              _context17.next = 3;
              return song2.save();

            case 3:
              _context17.next = 5;
              return (0, _supertest2.default)(_app2.default).delete('/api/song/' + playlist1._id + '/' + song2._id).set('authorization', user1Token);

            case 5:
              res = _context17.sent;
              _context17.next = 8;
              return _Song2.default.findById(song2._id);

            case 8:
              foundSong = _context17.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundSong).to.equal(null);

            case 12:
            case 'end':
              return _context17.stop();
          }
        }
      }, _callee17, undefined);
    })));
  });

  /*****************************************************************************
  **************************** .fetchSongsInPlaylist ***************************
  *****************************************************************************/
  describe('.fetchSongsInPlaylist', function () {
    var song1 = void 0,
        song2 = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18() {
      return _regenerator2.default.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              song1 = new _Song2.default({
                youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
                inPlaylists: [playlist1._id, playlist2._id]
              });

              song2 = new _Song2.default({
                youTubeUrl: 'https://www.youtube.com/watch?v=YsB8t0B4jx4',
                inPlaylists: [playlist1._id]
              });

              _context18.next = 4;
              return song1.save();

            case 4:
              _context18.next = 6;
              return song2.save();

            case 6:
            case 'end':
              return _context18.stop();
          }
        }
      }, _callee18, undefined);
    })));

    it('can only be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19() {
      var res;
      return _regenerator2.default.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return (0, _supertest2.default)(_app2.default).get('/api/song/playlist/' + playlist1._id);

            case 2:
              res = _context19.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context19.stop();
          }
        }
      }, _callee19, undefined);
    })));

    it('sends an error if an invalid playlist ID is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20() {
      var res;
      return _regenerator2.default.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return (0, _supertest2.default)(_app2.default).get('/api/song/playlist/12345').set('authorization', user1Token);

            case 2:
              res = _context20.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The playlist ID provided is invalid.');

            case 6:
            case 'end':
              return _context20.stop();
          }
        }
      }, _callee20, undefined);
    })));

    it('sends an error if the playlist does not exist', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21() {
      var playlist3, res;
      return _regenerator2.default.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              playlist3 = new _Playlist2.default({ title: 'Test Playlist3' });
              _context21.next = 3;
              return (0, _supertest2.default)(_app2.default).get('/api/song/playlist/' + playlist3._id).set('authorization', user1Token);

            case 3:
              res = _context21.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The playlist specified does not exist.');

            case 7:
            case 'end':
              return _context21.stop();
          }
        }
      }, _callee21, undefined);
    })));

    it('sends an error if the user is not is not the "forUser" or "byUser" in the playlist', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee22() {
      var user3, user3Token, res;
      return _regenerator2.default.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              user3 = new _User2.default({
                firstName: 'Test',
                lastName: 'User',
                displayName: 'Test User3'
              });
              user3Token = (0, _token2.default)(user3);
              _context22.next = 4;
              return user3.save();

            case 4:
              _context22.next = 6;
              return (0, _supertest2.default)(_app2.default).get('/api/song/playlist/' + playlist1._id).set('authorization', user3Token);

            case 6:
              res = _context22.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal("You don't have permission to access this playlist.");

            case 10:
            case 'end':
              return _context22.stop();
          }
        }
      }, _callee22, undefined);
    })));

    it('fetches a list of songs that match the provided playlist', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee23() {
      var res1, res2;
      return _regenerator2.default.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return (0, _supertest2.default)(_app2.default).get('/api/song/playlist/' + playlist1._id).set('authorization', user1Token);

            case 2:
              res1 = _context23.sent;
              _context23.next = 5;
              return (0, _supertest2.default)(_app2.default).get('/api/song/playlist/' + playlist2._id).set('authorization', user1Token);

            case 5:
              res2 = _context23.sent;


              (0, _chai.expect)(res1.status).to.equal(200);
              (0, _chai.expect)(res1.body.success).to.exist;
              (0, _chai.expect)(res1.body.success.songs.length).to.equal(2);
              (0, _chai.expect)(res2.status).to.equal(200);
              (0, _chai.expect)(res2.body.success).to.exist;
              (0, _chai.expect)(res2.body.success.songs.length).to.equal(1);

            case 12:
            case 'end':
              return _context23.stop();
          }
        }
      }, _callee23, undefined);
    })));
  });

  /*****************************************************************************
  ******************************* .fetchlikedSongs *****************************
  *****************************************************************************/
  describe('.fetchlikedSongs', function () {
    var song1 = void 0,
        song2 = void 0,
        song3 = void 0,
        song4 = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee24() {
      return _regenerator2.default.wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              song1 = new _Song2.default({
                youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
                inPlaylists: [playlist1._id, playlist2._id],
                likedByUsers: [user1._id]
              });

              song2 = new _Song2.default({
                youTubeUrl: 'https://www.youtube.com/watch?v=YsB8t0B4jx4',
                inPlaylists: [playlist1._id],
                likedByUsers: [user2._id]
              });

              song3 = new _Song2.default({
                youTubeUrl: 'https://www.youtube.com/watch?v=YgB8t0B4jx4',
                inPlaylists: [playlist1._id],
                likedByUsers: [user1._id, user2._id]
              });

              song4 = new _Song2.default({
                youTubeUrl: 'https://www.youtube.com/watch?v=YzB8t0B4jx4',
                inPlaylists: [playlist1._id],
                likedByUsers: [user1._id]
              });

              _context24.next = 6;
              return song1.save();

            case 6:
              _context24.next = 8;
              return song2.save();

            case 8:
              _context24.next = 10;
              return song3.save();

            case 10:
              _context24.next = 12;
              return song4.save();

            case 12:
            case 'end':
              return _context24.stop();
          }
        }
      }, _callee24, undefined);
    })));

    it('can only  be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee25() {
      var res;
      return _regenerator2.default.wrap(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              _context25.next = 2;
              return (0, _supertest2.default)(_app2.default).get('/api/song/liked');

            case 2:
              res = _context25.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context25.stop();
          }
        }
      }, _callee25, undefined);
    })));

    it('sends a list of songs liked by the user', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee26() {
      var res1, res2;
      return _regenerator2.default.wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              _context26.next = 2;
              return (0, _supertest2.default)(_app2.default).get('/api/song/liked').set('authorization', user1Token);

            case 2:
              res1 = _context26.sent;
              _context26.next = 5;
              return (0, _supertest2.default)(_app2.default).get('/api/song/liked').set('authorization', user2Token);

            case 5:
              res2 = _context26.sent;


              (0, _chai.expect)(res1.status).to.equal(200);
              (0, _chai.expect)(res1.body.success).to.exist;
              (0, _chai.expect)(res1.body.success.songs.length).to.equal(3);
              (0, _chai.expect)(res2.status).to.equal(200);
              (0, _chai.expect)(res2.body.success).to.exist;
              (0, _chai.expect)(res2.body.success.songs.length).to.equal(2);

            case 12:
            case 'end':
              return _context26.stop();
          }
        }
      }, _callee26, undefined);
    })));
  });

  /*****************************************************************************
  ********************************** .likesong *********************************
  *****************************************************************************/
  describe('.likeSong', function () {
    var song = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee27() {
      return _regenerator2.default.wrap(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              song = new _Song2.default({
                youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
                inPlaylists: [playlist1._id]
              });

              _context27.next = 3;
              return song.save();

            case 3:
            case 'end':
              return _context27.stop();
          }
        }
      }, _callee27, undefined);
    })));

    it('can only  be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee28() {
      var res;
      return _regenerator2.default.wrap(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              _context28.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/song/like/' + song._id);

            case 2:
              res = _context28.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context28.stop();
          }
        }
      }, _callee28, undefined);
    })));

    it('sends an error if an invalid song ID is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee29() {
      var res;
      return _regenerator2.default.wrap(function _callee29$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              _context29.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/song/like/12345').set('authorization', user1Token);

            case 2:
              res = _context29.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The song ID provided is invalid.');

            case 6:
            case 'end':
              return _context29.stop();
          }
        }
      }, _callee29, undefined);
    })));

    it('sends an error if the song does not exist', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee30() {
      var song2, res;
      return _regenerator2.default.wrap(function _callee30$(_context30) {
        while (1) {
          switch (_context30.prev = _context30.next) {
            case 0:
              song2 = new _Song2.default({
                youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
                inPlaylists: [playlist1._id]
              });
              _context30.next = 3;
              return (0, _supertest2.default)(_app2.default).put('/api/song/like/' + song2._id).set('authorization', user1Token);

            case 3:
              res = _context30.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The song specified does not exist.');

            case 7:
            case 'end':
              return _context30.stop();
          }
        }
      }, _callee30, undefined);
    })));

    it("adds a user to a song's 'likedByUsers' array", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee31() {
      var res, foundSong;
      return _regenerator2.default.wrap(function _callee31$(_context31) {
        while (1) {
          switch (_context31.prev = _context31.next) {
            case 0:
              _context31.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/song/like/' + song._id).set('authorization', user1Token);

            case 2:
              res = _context31.sent;
              _context31.next = 5;
              return _Song2.default.findById(song._id);

            case 5:
              foundSong = _context31.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundSong.likedByUsers.length).to.equal(1);
              (0, _chai.expect)(foundSong.likedByUsers[0].equals(user1._id)).to.equal(true);

            case 10:
            case 'end':
              return _context31.stop();
          }
        }
      }, _callee31, undefined);
    })));
  });

  /*****************************************************************************
  ********************************* .unlikesong ********************************
  *****************************************************************************/
  describe('.unlikeSong', function () {
    var song = void 0;

    beforeEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee32() {
      return _regenerator2.default.wrap(function _callee32$(_context32) {
        while (1) {
          switch (_context32.prev = _context32.next) {
            case 0:
              song = new _Song2.default({
                youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
                inPlaylists: [playlist1._id],
                likedByUsers: [user1._id, user2._id]
              });

              _context32.next = 3;
              return song.save();

            case 3:
            case 'end':
              return _context32.stop();
          }
        }
      }, _callee32, undefined);
    })));

    it('can only  be accessed by passing a valid JWT', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee33() {
      var res;
      return _regenerator2.default.wrap(function _callee33$(_context33) {
        while (1) {
          switch (_context33.prev = _context33.next) {
            case 0:
              _context33.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/song/unlike/' + song._id);

            case 2:
              res = _context33.sent;


              (0, _chai.expect)(res.status).to.equal(401);
              (0, _chai.expect)(res.text).to.equal('Unauthorized');

            case 5:
            case 'end':
              return _context33.stop();
          }
        }
      }, _callee33, undefined);
    })));

    it('sends an error if an invalid song ID is provided', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee34() {
      var res;
      return _regenerator2.default.wrap(function _callee34$(_context34) {
        while (1) {
          switch (_context34.prev = _context34.next) {
            case 0:
              _context34.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/song/unlike/12345').set('authorization', user1Token);

            case 2:
              res = _context34.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The song ID provided is invalid.');

            case 6:
            case 'end':
              return _context34.stop();
          }
        }
      }, _callee34, undefined);
    })));

    it('sends an error if the song does not exist', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee35() {
      var song2, res;
      return _regenerator2.default.wrap(function _callee35$(_context35) {
        while (1) {
          switch (_context35.prev = _context35.next) {
            case 0:
              song2 = new _Song2.default({
                youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
                inPlaylists: [playlist1._id, playlist2._id]
              });
              _context35.next = 3;
              return (0, _supertest2.default)(_app2.default).put('/api/song/unlike/' + song2._id).set('authorization', user1Token);

            case 3:
              res = _context35.sent;


              (0, _chai.expect)(res.status).to.equal(422);
              (0, _chai.expect)(res.body.error).to.exist;
              (0, _chai.expect)(res.body.error).to.equal('The song specified does not exist.');

            case 7:
            case 'end':
              return _context35.stop();
          }
        }
      }, _callee35, undefined);
    })));

    it("removes a user from a song's 'likedByUsers' array", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee36() {
      var res, foundSong;
      return _regenerator2.default.wrap(function _callee36$(_context36) {
        while (1) {
          switch (_context36.prev = _context36.next) {
            case 0:
              _context36.next = 2;
              return (0, _supertest2.default)(_app2.default).put('/api/song/unlike/' + song._id).set('authorization', user1Token);

            case 2:
              res = _context36.sent;
              _context36.next = 5;
              return _Song2.default.findById(song._id);

            case 5:
              foundSong = _context36.sent;


              (0, _chai.expect)(res.status).to.equal(200);
              (0, _chai.expect)(res.body.success).to.exist;
              (0, _chai.expect)(foundSong.likedByUsers.length).to.equal(1);
              (0, _chai.expect)(foundSong.likedByUsers.indexOf(user1._id)).to.equal(-1);
              (0, _chai.expect)(foundSong.likedByUsers.indexOf(user2._id)).to.not.equal(-1);

            case 11:
            case 'end':
              return _context36.stop();
          }
        }
      }, _callee36, undefined);
    })));
  });
});