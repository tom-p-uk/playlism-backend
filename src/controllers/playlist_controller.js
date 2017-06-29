import Playlist from '../models/Playlist';
import Song from '../models/Song';
import tokenForUser from '../helpers/token';
import mongoose from 'mongoose';
import validateSong from '../helpers/validate_song';
import validatePlaylist from '../helpers/validate_playlist';

export const createPlaylist = async (req, res) => {
  const { title, forUser } = req.body;
  const byUser = req.user;

  const playlist = new Playlist({
    title,
    forUser,
    byUser,
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

  const playlist = await validatePlaylist(playlistId, user, 'edit');
  const song = await validateSong(songId, user, 'edit');

  if (playlist.error) {
    const { status, error } = playlist;
    return res.status(status).send({ error });
  }
};
