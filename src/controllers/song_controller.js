import Song from '../models/Song';
import validateSong from '../helpers/validate_song';
import validatePlaylist from '../helpers/validate_playlist';
import validateUrl from 'youtube-url';
import mongoose from 'mongoose';
import _ from 'lodash';

export const addSong = async (req, res) => {
  const { user } = req;
  const  { youTubeUrl, playlistId } = req.body;

  // Send errors if YouTube URL does not exist or is invalid
  if (!youTubeUrl) {
    return res.status(422).send({ error: 'A YouTube URL must be provided.' });
  } else if (!validateUrl.valid(youTubeUrl)) {
    return res.status(422).send({ error: 'The YouTube URL provided is invalid.' });
  }

  // Send errors if playlistId doesn't exist or is invalid
  if (!playlistId) {
    return res.status(422).send({ error: 'A playlist ID must be provided.' });
  } else if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(422).send({ error: 'The playlist ID provided is invalid.' });
  }

  const playlist = mongoose.Types.ObjectId(playlistId);
  let song = await Song.findOne({ youTubeUrl });

  if (song) { // If song already exists in db
    if (song.inPlaylists.indexOf(playlist) !== -1) { // And if playlist exists in song's inPlaylists array, send error
      return res.status(422).send({ error: 'That song has already been added to the playlist.' });
    } else {
      song.inPlaylists.push(playlist); // Else push playlist to song's inPlaylists array
    }
  } else {
    song = new Song({ youTubeUrl, inPlaylists: [] }); // If song doesn't exist, create new instance
  }

  try {
    song.save();
    res.status(200).send({ success: song });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'The song could not be added.' });
  }
};

export const deleteSongFromPlaylist  = async (req, res) => {
  const { user } = req;
  const { playlistId, songId } = req.params;

  const playlist = await validatePlaylist(playlistId, user, 'update');
  const song = await validateSong(songId, user, 'delete');

  if (playlist.error) {
    const { status, error } = playlist;
    return res.status(status).send({ error });
  } else if (song.error) {
    const { status, error } = song;
    return res.status(status).send({ error });
  }

  const inPlaylists = song.inPlaylists.filter(playlistObject => !playlist._id.equals(playlistObject));

  // If song's filtered inPlaylists array is not empty, update the song
  if (inPlaylists.length > 0) {
    try {
      const updatedSong = await song.update({ inPlaylists });
      res.status(200).send({ success: updatedSong });
    } catch (err) {
      res.status(500).send({ error: 'Song could not deleted.' })
    }
  // Else remove the song
  } else {
    try {
      const deletedSong = await song.remove();
      res.status(200).send({ success: deletedSong });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: 'Song could not deleted.' })
    }
  }
};

export const fetchSongsInPlaylist  = async (req, res) => {
  const { user } = req;
  const  { playlistId } = req.params;

  const playlist = await validatePlaylist(playlistId, user, 'access');

  if (playlist.error) {
    const { status, error } = playlist;
    return res.status(status).send({ error });
  }

  try {
    const songs = await Song.find({ inPlaylists: { '$in' : [playlist._id]} });
    res.status(200).send({ success: songs });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Songs could not be retrieved.' });
  }

};

export const fetchLikedSongs = async (req, res) => {
  const { user } = req;

  try {
    const songs = await Song.find({ likedByUsers: { '$in' : [user._id]} });
    res.status(200).send({ success: songs });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Songs could not be retrieved.' });
  }
};

export const likeSong = async (req, res) => { // TODO
  const { user } = req;
  const { songId } = req.params;

  const song = await validateSong(songId, user);

  if (song.error) {
    const { status, error } = song;
    return res.status(status).send({ error });
  }

  // Add user to song's likedByUsers array
  const { likedByUsers } = song;
  likedByUsers.push(user);

  try {
    const updatedSong = await song.update({ likedByUsers });
    res.status(200).send({ success: updatedSong });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Song could not be updated.' });
  }
};

export const unlikeSong = async (req, res) => { // TODO
  const { user } = req;
  const { songId } = req.params;

  const song = await validateSong(songId, user);

  if (song.error) {
    const { status, error } = song;
    return res.status(status).send({ error });
  }

  // New filtered array with user removed from it
  const likedByUsers = song.likedByUsers.filter(userObj => !userObj.equals(user._id));

  try {
    const updatedSong = await song.update({ likedByUsers });
    res.status(200).send({ success: updatedSong });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Song could not be updated.' });
  }
};
