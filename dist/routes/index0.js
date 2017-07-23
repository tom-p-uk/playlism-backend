// import app from '../app';
// import passportService from '../services/passport';
// import passport from 'passport';
// import tokenForUser from '../services/token';
// import {
//   fetchUser,
//   editDisplayName,
//   editProfileImg,
//   addPushToken,
// } from '../controllers/user_controller';
// import {
//   createPlaylist,
//   deletePlaylist,
//   editPlaylistTitle,
//   updateLastSongPlayed,
//   fetchForUserPlaylists,
//   fetchByUserPlaylists
// } from '../controllers/playlist_controller';
// import {
//   addSong,
//   deleteSongFromPlaylist,
//   fetchSongsInPlaylist,
//   fetchLikedSongs,
//   likeSong,
//   unlikeSong
// } from '../controllers/song_controller';
//
// const requireAuth = passport.authenticate('jwt', { session: false });
//
// export default app => {
//   let redirectUrl; // Url to redirect back to mobile app
//
//   // Facebook auth routes
//   app.get('/auth/facebook', (req, res) => {
//     redirectUrl = req.query.linkingUri;
//     passport.authenticate('facebook')(req, res);
//   });
//   app.get('/auth/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
//     (req, res) => res.redirect(`${redirectUrl}?user=${JSON.stringify(req.user)}&token=${tokenForUser(req.user)}`));
//
//   // Google auth routes
//   app.get('/auth/google', (req, res) => {
//     redirectUrl = req.query.linkingUri;
//     passport.authenticate('google', { scope: ['profile'] })(req, res);
//   });
//   app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/auth/google' }),
//     (req, res) => res.redirect(`${redirectUrl}?user=${JSON.stringify(req.user)}&token=${tokenForUser(req.user)}`));
//
//   // User controller routes
//   app.get('/user', requireAuth, fetchUser);
//   app.put('/user/displayname', requireAuth, editDisplayName);
//   app.put('/user/profileimg', requireAuth, editProfileImg);
//   app.post('/user/pushtoken', requireAuth, addPushToken);
//
//   // Playlist controller routes
//   app.post('/playlist', requireAuth, createPlaylist);
//   app.delete('/playlist/:playlistId', requireAuth, deletePlaylist);
//   app.put('/playlist/title/:playlistId', requireAuth, editPlaylistTitle);
//   app.put('/playlist/lastsongplayed/:playlistId', requireAuth, updateLastSongPlayed);
//   app.get('/playlist/foruser/:userId', requireAuth, fetchForUserPlaylists);
//   app.get('/playlist/byuser/:userId', requireAuth, fetchByUserPlaylists);
//
//   // Song controller routes
//   app.post('/song', requireAuth, addSong);
//   app.delete('/song/:playlistId/:songId', requireAuth, deleteSongFromPlaylist);
//   app.get('/song/playlist/:playlistId', requireAuth, fetchSongsInPlaylist);
//   app.get('/song', requireAuth, fetchLikedSongs);
//   app.put('/song/like/:songId', requireAuth, likeSong);
//   app.put('/song/unlike/:songId', requireAuth, unlikeSong);
// };
"use strict";