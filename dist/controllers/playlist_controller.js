'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchByUserPlaylists = exports.fetchForUserPlaylists = exports.updateLastSongPlayed = exports.editPlaylistTitle = exports.deletePlaylist = exports.createPlaylist = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Playlist = require('../models/Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _Song = require('../models/Song');

var _Song2 = _interopRequireDefault(_Song);

var _token = require('../utils/token');

var _token2 = _interopRequireDefault(_token);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validate_song = require('../utils/validate_song');

var _validate_song2 = _interopRequireDefault(_validate_song);

var _validate_playlist = require('../utils/validate_playlist');

var _validate_playlist2 = _interopRequireDefault(_validate_playlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createPlaylist = exports.createPlaylist = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res) {
    var _req$body, title, forUser, byUser, playlist;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, title = _req$body.title, forUser = _req$body.forUser;
            byUser = req.user;
            playlist = new _Playlist2.default({
              title: title,
              forUser: forUser,
              byUser: byUser,
              lastUpdated: Date.now()
            });
            _context.prev = 3;
            _context.next = 6;
            return playlist.save();

          case 6:
            res.status(201).send({ success: { playlist: playlist } });
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](3);

            console.log(_context.t0);

            if (_context.t0.errors.title) {
              res.status(422).send({ error: _context.t0.errors.title.message });
            } else if (_context.t0.errors.forUser) {
              res.status(422).send({ error: _context.t0.errors.forUser.message });
            } else {
              res.status(500).send({ error: 'The playlist could not be created.' });
            }

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[3, 9]]);
  }));

  return function createPlaylist(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var deletePlaylist = exports.deletePlaylist = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res) {
    var user, playlistId, playlist, status, error;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            user = req.user;
            playlistId = req.params.playlistId;
            _context2.next = 4;
            return (0, _validate_playlist2.default)(playlistId, user, 'delete');

          case 4:
            playlist = _context2.sent;

            if (!playlist.error) {
              _context2.next = 8;
              break;
            }

            status = playlist.status, error = playlist.error;
            return _context2.abrupt('return', res.status(status).send({ error: error }));

          case 8:
            _context2.prev = 8;
            _context2.next = 11;
            return playlist.remove();

          case 11:
            res.status(200).send({ success: { playlist: playlist } });
            _context2.next = 18;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2['catch'](8);

            console.log(_context2.t0);
            res.status(500).send({ error: 'The playlist could not be deleted.' });

          case 18:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[8, 14]]);
  }));

  return function deletePlaylist(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var editPlaylistTitle = exports.editPlaylistTitle = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, res) {
    var user, playlistId, title, playlist, status, error;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            user = req.user;
            playlistId = req.params.playlistId;
            title = req.body.title;
            _context3.next = 5;
            return (0, _validate_playlist2.default)(playlistId, user, 'edit');

          case 5:
            playlist = _context3.sent;

            if (!playlist.error) {
              _context3.next = 9;
              break;
            }

            status = playlist.status, error = playlist.error;
            return _context3.abrupt('return', res.status(status).send({ error: error }));

          case 9:
            _context3.prev = 9;
            _context3.next = 12;
            return playlist.update({ title: title });

          case 12:
            res.status(200).send({ success: { playlist: playlist } });
            _context3.next = 19;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3['catch'](9);

            console.log(_context3.t0);
            if (_context3.t0.errors.title) {
              res.status(422).send({ error: _context3.t0.errors.title.message });
            } else {
              res.status(500).send({ error: 'The playlist title could not be edited.' });
            }

          case 19:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[9, 15]]);
  }));

  return function editPlaylistTitle(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var updateLastSongPlayed = exports.updateLastSongPlayed = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(req, res) {
    var user, playlistId, songId, playlist, song, status, error, _status, _error, updatedPlaylist;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            user = req.user;
            playlistId = req.params.playlistId;
            songId = req.body.songId;
            _context4.next = 5;
            return (0, _validate_playlist2.default)(playlistId, user, 'update');

          case 5:
            playlist = _context4.sent;
            _context4.next = 8;
            return (0, _validate_song2.default)(songId, user, 'update');

          case 8:
            song = _context4.sent;

            if (!playlist.error) {
              _context4.next = 14;
              break;
            }

            status = playlist.status, error = playlist.error;
            return _context4.abrupt('return', res.status(status).send({ error: error }));

          case 14:
            if (!song.error) {
              _context4.next = 17;
              break;
            }

            _status = song.status, _error = song.error;
            return _context4.abrupt('return', res.status(_status).send({ error: _error }));

          case 17:
            _context4.prev = 17;
            _context4.next = 20;
            return playlist.update({ lastSongPlayed: song });

          case 20:
            updatedPlaylist = _context4.sent;

            res.status(200).send({ success: { playlist: updatedPlaylist } });
            _context4.next = 28;
            break;

          case 24:
            _context4.prev = 24;
            _context4.t0 = _context4['catch'](17);

            console.log(_context4.t0);
            if (_context4.t0.errors.lastSongPlayed) {
              res.status(422).send({ error: _context4.t0.errors.lastSongPlayed.message });
            } else {
              res.status(500).send({ error: 'The playlist could not be updated.' });
            }

          case 28:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[17, 24]]);
  }));

  return function updateLastSongPlayed(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var fetchForUserPlaylists = exports.fetchForUserPlaylists = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(req, res) {
    var user, playlists;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            user = req.user;
            _context5.prev = 1;
            _context5.next = 4;
            return _Playlist2.default.find({ forUser: user._id });

          case 4:
            playlists = _context5.sent;

            res.status(200).send({ success: { playlists: playlists } });
            _context5.next = 12;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5['catch'](1);

            console.log(_context5.t0);
            res.status(500).send({ error: 'Playlists could not be retrieved.' });

          case 12:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[1, 8]]);
  }));

  return function fetchForUserPlaylists(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var fetchByUserPlaylists = exports.fetchByUserPlaylists = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(req, res) {
    var user, playlists;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            user = req.user;
            _context6.prev = 1;
            _context6.next = 4;
            return _Playlist2.default.find({ byUser: user._id });

          case 4:
            playlists = _context6.sent;

            res.status(200).send({ success: { playlists: playlists } });
            _context6.next = 12;
            break;

          case 8:
            _context6.prev = 8;
            _context6.t0 = _context6['catch'](1);

            console.log(_context6.t0);
            res.status(500).send({ error: 'Playlists could not be retrieved.' });

          case 12:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[1, 8]]);
  }));

  return function fetchByUserPlaylists(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();