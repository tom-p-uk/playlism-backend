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

var _Song = require('../models/Song');

var _Song2 = _interopRequireDefault(_Song);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validateSong = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(songId, user) {
    var song;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (_mongoose2.default.Types.ObjectId.isValid(songId)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', { status: 422, error: 'The song ID provided is invalid.' });

          case 2:
            song = void 0;
            _context.prev = 3;
            _context.next = 6;
            return _Song2.default.findById(songId);

          case 6:
            song = _context.sent;
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](3);

            console.log(_context.t0);
            return _context.abrupt('return', { status: 500, error: 'The song could not be retrieved from the database' });

          case 13:
            if (song) {
              _context.next = 15;
              break;
            }

            return _context.abrupt('return', { status: 422, error: 'The song specified does not exist.' });

          case 15:
            return _context.abrupt('return', song);

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[3, 9]]);
  }));

  return function validateSong(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = validateSong;