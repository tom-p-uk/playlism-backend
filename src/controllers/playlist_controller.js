import Playlist from '../models/Playlist';
import Song from '../models/Song';
import tokenForUser from '../services/token';
import mongoose from 'mongoose';

const validatePlaylist = async (playlistId, user, editOrDelete) => {
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return { status: 422, error: 'The playlist ID provided is invalid.' };
  }

  let playlist;

  try {
    playlist = await Playlist.findById(playlistId);
  } catch (err) {
    console.log(err);
    return { status: 500, error: 'The playlist could not be retrieved from the database' };
  }

  if (!playlist) {
    return { status: 422, error: 'The playlist specified does not exist.' };
  }

  const { byUser, forUser } = playlist;

  if (!user._id.equals(byUser) && !user._id.equals(forUser)) {
    return { status: 401, error: `You don't have permission to ${editOrDelete} this playlist.` };
  }

  return playlist;
};

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

export const updateLastSongPlayed = (req, res) => {
  res.send('a');
};
