'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

var PlaylistSchema = new _mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Playlist title must be provided.'],
    minlength: [4, 'Playlist title must be at least 4 characters long.'],
    maxlength: [50, 'Playlist title must no more than 50 characters long.']
  },
  dateAdded: {
    type: Date,
    default: Date.now()
  },
  byUser: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  forUser: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'A recipient user must be provided.']
  },
  lastSongPlayed: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'song'
  },
  lastUpdated: Date
});

var Playlist = _mongoose2.default.model('playlist', PlaylistSchema);

exports.default = Playlist;