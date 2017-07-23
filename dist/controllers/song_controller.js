'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlikeSong = exports.likeSong = exports.fetchLikedSongs = exports.fetchSongsInPlaylist = exports.deleteSongFromPlaylist = exports.addSong = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Song = require('../models/Song');

var _Song2 = _interopRequireDefault(_Song);

var _Playlist = require('../models/Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _validate_song = require('../utils/validate_song');

var _validate_song2 = _interopRequireDefault(_validate_song);

var _validate_playlist = require('../utils/validate_playlist');

var _validate_playlist2 = _interopRequireDefault(_validate_playlist);

var _youtubeUrl = require('youtube-url');

var _youtubeUrl2 = _interopRequireDefault(_youtubeUrl);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addSong = exports.addSong = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res) {
    var user, _req$body, youTubeUrl, playlistId, playlist, song;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = req.user;
            _req$body = req.body, youTubeUrl = _req$body.youTubeUrl, playlistId = _req$body.playlistId;

            // Send errors if YouTube URL does not exist or is invalid

            if (youTubeUrl) {
              _context.next = 6;
              break;
            }

            return _context.abrupt('return', res.status(422).send({ error: 'A YouTube URL must be provided.' }));

          case 6:
            if (_youtubeUrl2.default.valid(youTubeUrl)) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', res.status(422).send({ error: 'The YouTube URL provided is invalid.' }));

          case 8:
            if (playlistId) {
              _context.next = 12;
              break;
            }

            return _context.abrupt('return', res.status(422).send({ error: 'A playlist ID must be provided.' }));

          case 12:
            if (_mongoose2.default.Types.ObjectId.isValid(playlistId)) {
              _context.next = 14;
              break;
            }

            return _context.abrupt('return', res.status(422).send({ error: 'The playlist ID provided is invalid.' }));

          case 14:
            playlist = _mongoose2.default.Types.ObjectId(playlistId);
            _context.next = 17;
            return _Song2.default.findOne({ youTubeUrl: youTubeUrl });

          case 17:
            song = _context.sent;

            if (!song) {
              _context.next = 26;
              break;
            }

            if (!(song.inPlaylists.indexOf(playlist) !== -1)) {
              _context.next = 23;
              break;
            }

            return _context.abrupt('return', res.status(422).send({ error: 'That song has already been added to the playlist.' }));

          case 23:
            song.inPlaylists.push(playlist); // Else push playlist to song's inPlaylists array

          case 24:
            _context.next = 27;
            break;

          case 26:
            song = new _Song2.default({ youTubeUrl: youTubeUrl, inPlaylists: [playlist] }); // If song doesn't exist, create new instance

          case 27:
            _context.prev = 27;
            _context.next = 30;
            return song.save();

          case 30:
            _context.next = 32;
            return _Playlist2.default.findByIdAndUpdate(playlist, { lastUpdated: Date.now() });

          case 32:
            res.status(200).send({ success: { song: song } });
            _context.next = 39;
            break;

          case 35:
            _context.prev = 35;
            _context.t0 = _context['catch'](27);

            console.log(_context.t0);
            res.status(500).send({ error: 'The song could not be added.' });

          case 39:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[27, 35]]);
  }));

  return function addSong(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var deleteSongFromPlaylist = exports.deleteSongFromPlaylist = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res) {
    var user, _req$params, playlistId, songId, playlist, song, status, error, _status, _error, inPlaylists, updatedSong, deletedSong;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            user = req.user;
            _req$params = req.params, playlistId = _req$params.playlistId, songId = _req$params.songId;
            _context2.next = 4;
            return (0, _validate_playlist2.default)(playlistId, user, 'update');

          case 4:
            playlist = _context2.sent;
            _context2.next = 7;
            return (0, _validate_song2.default)(songId, user);

          case 7:
            song = _context2.sent;

            if (!playlist.error) {
              _context2.next = 13;
              break;
            }

            status = playlist.status, error = playlist.error;
            return _context2.abrupt('return', res.status(status).send({ error: error }));

          case 13:
            if (!song.error) {
              _context2.next = 16;
              break;
            }

            _status = song.status, _error = song.error;
            return _context2.abrupt('return', res.status(_status).send({ error: _error }));

          case 16:
            inPlaylists = song.inPlaylists.filter(function (playlistObject) {
              return !playlist._id.equals(playlistObject);
            });

            // If song's filtered inPlaylists array is not empty, update the song

            if (!(inPlaylists.length > 0)) {
              _context2.next = 30;
              break;
            }

            _context2.prev = 18;
            _context2.next = 21;
            return song.update({ inPlaylists: inPlaylists });

          case 21:
            updatedSong = _context2.sent;

            res.status(200).send({ success: { song: updatedSong } });
            _context2.next = 28;
            break;

          case 25:
            _context2.prev = 25;
            _context2.t0 = _context2['catch'](18);

            res.status(500).send({ error: 'Song could not deleted.' });

          case 28:
            _context2.next = 41;
            break;

          case 30:
            _context2.prev = 30;
            _context2.next = 33;
            return song.remove();

          case 33:
            deletedSong = _context2.sent;

            res.status(200).send({ success: { song: deletedSong } });
            _context2.next = 41;
            break;

          case 37:
            _context2.prev = 37;
            _context2.t1 = _context2['catch'](30);

            console.log(_context2.t1);
            res.status(500).send({ error: 'Song could not deleted.' });

          case 41:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[18, 25], [30, 37]]);
  }));

  return function deleteSongFromPlaylist(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var fetchSongsInPlaylist = exports.fetchSongsInPlaylist = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, res) {
    var user, playlistId, playlist, status, error, songs;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            user = req.user;
            playlistId = req.params.playlistId;
            _context3.next = 4;
            return (0, _validate_playlist2.default)(playlistId, user, 'access');

          case 4:
            playlist = _context3.sent;

            if (!playlist.error) {
              _context3.next = 8;
              break;
            }

            status = playlist.status, error = playlist.error;
            return _context3.abrupt('return', res.status(status).send({ error: error }));

          case 8:
            _context3.prev = 8;
            _context3.next = 11;
            return _Song2.default.find({ inPlaylists: { '$in': [playlist._id] } });

          case 11:
            songs = _context3.sent;

            res.status(200).send({ success: { songs: songs } });
            _context3.next = 19;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3['catch'](8);

            console.log(_context3.t0);
            res.status(500).send({ error: 'Songs could not be retrieved.' });

          case 19:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[8, 15]]);
  }));

  return function fetchSongsInPlaylist(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var fetchLikedSongs = exports.fetchLikedSongs = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(req, res) {
    var user, songs;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            user = req.user;
            _context4.prev = 1;
            _context4.next = 4;
            return _Song2.default.find({ likedByUsers: { '$in': [user._id] } });

          case 4:
            songs = _context4.sent;

            res.status(200).send({ success: { songs: songs } });
            _context4.next = 12;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](1);

            console.log(_context4.t0);
            res.status(500).send({ error: 'Songs could not be retrieved.' });

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[1, 8]]);
  }));

  return function fetchLikedSongs(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var likeSong = exports.likeSong = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(req, res) {
    var user, songId, song, status, error, likedByUsers, updatedSong;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // TODO
            user = req.user;
            songId = req.params.songId;
            _context5.next = 4;
            return (0, _validate_song2.default)(songId, user);

          case 4:
            song = _context5.sent;

            if (!song.error) {
              _context5.next = 8;
              break;
            }

            status = song.status, error = song.error;
            return _context5.abrupt('return', res.status(status).send({ error: error }));

          case 8:

            // Add user to song's likedByUsers array
            likedByUsers = song.likedByUsers;

            likedByUsers.push(user);

            _context5.prev = 10;
            _context5.next = 13;
            return song.update({ likedByUsers: likedByUsers });

          case 13:
            updatedSong = _context5.sent;

            res.status(200).send({ success: { song: updatedSong } });
            _context5.next = 21;
            break;

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5['catch'](10);

            console.log(_context5.t0);
            res.status(500).send({ error: 'Song could not be updated.' });

          case 21:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[10, 17]]);
  }));

  return function likeSong(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var unlikeSong = exports.unlikeSong = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(req, res) {
    var user, songId, song, status, error, likedByUsers, updatedSong;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            // TODO
            user = req.user;
            songId = req.params.songId;
            _context6.next = 4;
            return (0, _validate_song2.default)(songId, user);

          case 4:
            song = _context6.sent;

            if (!song.error) {
              _context6.next = 8;
              break;
            }

            status = song.status, error = song.error;
            return _context6.abrupt('return', res.status(status).send({ error: error }));

          case 8:

            // New filtered array with user removed from it
            likedByUsers = song.likedByUsers.filter(function (userObj) {
              return !userObj.equals(user._id);
            });
            _context6.prev = 9;
            _context6.next = 12;
            return song.update({ likedByUsers: likedByUsers });

          case 12:
            updatedSong = _context6.sent;

            res.status(200).send({ success: { song: updatedSong } });
            _context6.next = 20;
            break;

          case 16:
            _context6.prev = 16;
            _context6.t0 = _context6['catch'](9);

            console.log(_context6.t0);
            res.status(500).send({ error: 'Song could not be updated.' });

          case 20:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[9, 16]]);
  }));

  return function unlikeSong(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();