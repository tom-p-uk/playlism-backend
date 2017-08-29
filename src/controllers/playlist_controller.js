import Playlist from '../models/Playlist';
import Song from '../models/Song';
import User from '../models/User';
import tokenForUser from '../utils/token';
import mongoose from 'mongoose';
import validateSong from '../utils/validate_song';
import validatePlaylist from '../utils/validate_playlist';

export const createPlaylist = async (req, res) => {
  let { title, forUser } = req.body;
  const byUser = req.user;

  forUser = await User.findById(forUser);

  const playlist = new Playlist({
    title,
    forUser,
    byUser,
    lastUpdated: Date.now(),
  });

  try {
    await playlist.save();
    res.status(201).send({ success: { playlist }});
  } catch (err) {
    console.log(err);

    if (err.errors.title) {
      res.status(422).send({ error: err.errors.title.message });
    } else if (err.errors.forUser) {
      res.status(422).send({ error: err.errors.forUser.message });
    } else {
      res.status(500).send({ error: 'The playlist could not be created.' });
    }
  }
};

export const deletePlaylist = async (req, res) => {
  const { user } = req;
  const { playlistId } = req.params;

  const playlist = await validatePlaylist(playlistId, user, 'delete');

  if (playlist.error) {
    const { status, error } = playlist;
    return res.status(status).send({ error });
  }

  try {
    await playlist.remove();
    res.status(200).send({ success: { playlist } });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'The playlist could not be deleted.' });
  }
};

export const editPlaylistTitle = async (req, res) => {
  const { user } = req;
  const { playlistId } = req.params;
  const  { title } = req.body;

  const playlist = await validatePlaylist(playlistId, user, 'edit');

  if (playlist.error) {
    const { status, error } = playlist;
    return res.status(status).send({ error });
  }

  playlist.title = title;

  try {
    await playlist.update({ title });
    res.status(200).send({ success: { playlist } });
  } catch (err) {
    console.log(err);
    if (err.errors.title) {
      res.status(422).send({ error: err.errors.title.message });
    } else {
      res.status(500).send({ error: 'The playlist title could not be edited.' });
    }
  }
};

export const updateLastSongPlayed = async (req, res) => {
  const { user } = req;
  const { playlistId } = req.params;
  const  { songId } = req.body;

  const playlist = await validatePlaylist(playlistId, user, 'update');
  const song = await validateSong(songId, user, 'update');

  if (playlist.error) {
    const { status, error } = playlist;
    return res.status(status).send({ error });
  } else if (song.error) {
    const { status, error } = song;
    return res.status(status).send({ error });
  }

  try {
    const updatedPlaylist = await playlist.update({ lastSongPlayed: song });
    res.status(200).send({ success: { playlist: updatedPlaylist } });
  } catch (err) {
    console.log(err);
    if (err.errors.lastSongPlayed) {
      res.status(422).send({ error: err.errors.lastSongPlayed.message });
    } else {
      res.status(500).send({ error: 'The playlist could not be updated.' });
    }
  }
};

export const fetchForUserPlaylists = async (req, res) => {
  const { user } = req;

  try {
    const playlists = await Playlist.find({ forUser: user._id })
      .populate('forUser')
      .populate('byUser');
    res.status(200).send({ success: { playlists } });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Playlists could not be retrieved.' });
  }
};

export const fetchByUserPlaylists = async (req, res) => {
  const { user } = req;

  try {
    const playlists = await Playlist.find({ byUser: user._id })
    .populate('forUser')
    .populate('byUser');
    res.status(200).send({ success: { playlists } });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Playlists could not be retrieved.' });
  }
};
