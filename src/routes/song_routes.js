import express from 'express';
import requireAuth from '../utils/require_auth';
import {
  addSong,
  deleteSongFromPlaylist,
  fetchSongsInPlaylist,
  fetchLikedSongs,
  likeSong,
  unlikeSong
} from '../controllers/song_controller';

const router = express.Router();

// Song controller routes
router.post('/', requireAuth, addSong);
router.delete('/:playlistId/:songId', requireAuth, deleteSongFromPlaylist);
router.get('/playlist/:playlistId', requireAuth, fetchSongsInPlaylist);
router.get('/liked', requireAuth, fetchLikedSongs);
router.put('/like/:songId', requireAuth, likeSong);
router.put('/unlike/:songId', requireAuth, unlikeSong);

export default router;
