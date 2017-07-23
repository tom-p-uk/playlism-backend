'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Playlist = require('../models/Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validatePlaylist = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(playlistId, user, accessEditUpdateOrDelete) {
    var playlist, _playlist, byUser, forUser;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (_mongoose2.default.Types.ObjectId.isValid(playlistId)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', { status: 422, error: 'The playlist ID provided is invalid.' });

          case 2:
            playlist = void 0;
            _context.prev = 3;
            _context.next = 6;
            return _Playlist2.default.findById(playlistId);

          case 6:
            playlist = _context.sent;
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](3);

            console.log(_context.t0);
            return _context.abrupt('return', { status: 500, error: 'The playlist could not be retrieved from the database' });

          case 13:
            if (playlist) {
              _context.next = 15;
              break;
            }

            return _context.abrupt('return', { status: 422, error: 'The playlist specified does not exist.' });

          case 15:
            _playlist = playlist, byUser = _playlist.byUser, forUser = _playlist.forUser;

            if (!(!user._id.equals(byUser) && !user._id.equals(forUser))) {
              _context.next = 18;
              break;
            }

            return _context.abrupt('return', { status: 401, error: 'You don\'t have permission to ' + accessEditUpdateOrDelete + ' this playlist.' });

          case 18:
            return _context.abrupt('return', playlist);

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[3, 9]]);
  }));

  return function validatePlaylist(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = validatePlaylist;