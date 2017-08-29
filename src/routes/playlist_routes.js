import express from 'express';
import requireAuth from '../utils/require_auth';
import {
  createPlaylist,
  deletePlaylist,
  editPlaylistTitle,
  updateLastSongPlayed,
  fetchForUserPlaylists,
  fetchByUserPlaylists
} from '../controllers/playlist_controller';

const router = express.Router();

// Playlist controller routes
router.post('/', requireAuth, createPlaylist);
router.delete('/:playlistId', requireAuth, deletePlaylist);
router.put('/title/:playlistId', requireAuth, editPlaylistTitle);
router.put('/lastsongplayed/:playlistId', requireAuth, updateLastSongPlayed);
router.get('/foruser', requireAuth, fetchForUserPlaylists);
router.get('/byuser', requireAuth, fetchByUserPlaylists);

export default router;
