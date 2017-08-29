'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _require_auth = require('../utils/require_auth');

var _require_auth2 = _interopRequireDefault(_require_auth);

var _playlist_controller = require('../controllers/playlist_controller');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// Playlist controller routes
router.post('/', _require_auth2.default, _playlist_controller.createPlaylist);
router.delete('/:playlistId', _require_auth2.default, _playlist_controller.deletePlaylist);
router.put('/title/:playlistId', _require_auth2.default, _playlist_controller.editPlaylistTitle);
router.put('/lastsongplayed/:playlistId', _require_auth2.default, _playlist_controller.updateLastSongPlayed);
router.get('/foruser', _require_auth2.default, _playlist_controller.fetchForUserPlaylists);
router.get('/byuser', _require_auth2.default, _playlist_controller.fetchByUserPlaylists);

exports.default = router;