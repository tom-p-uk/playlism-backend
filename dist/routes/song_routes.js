'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _require_auth = require('../utils/require_auth');

var _require_auth2 = _interopRequireDefault(_require_auth);

var _song_controller = require('../controllers/song_controller');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// Song controller routes
router.post('/', _require_auth2.default, _song_controller.addSong);
router.delete('/:playlistId/:songId', _require_auth2.default, _song_controller.deleteSongFromPlaylist);
router.get('/playlist/:playlistId', _require_auth2.default, _song_controller.fetchSongsInPlaylist);
router.get('/liked', _require_auth2.default, _song_controller.fetchLikedSongs);
router.put('/like/:songId', _require_auth2.default, _song_controller.likeSong);
router.put('/unlike/:songId', _require_auth2.default, _song_controller.unlikeSong);

exports.default = router;