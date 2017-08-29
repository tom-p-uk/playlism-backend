'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

var SongSchema = new _mongoose.Schema({
  youTubeUrl: {
    required: true,
    type: String
  },
  videoId: {
    type: String
  },
  title: String,
  description: String,
  thumbnail: String,
  likedByUsers: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  inPlaylists: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'playlist'
  }]
}, {
  timestamps: {
    createdAt: 'dateAdded'
  }
});

var Song = _mongoose2.default.model('song', SongSchema);

exports.default = Song;