import Playlist from '../models/Playlist';
import tokenForUser from '../services/token';
import mongoose from 'mongoose';

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

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(422).send({ error: 'The playlist ID provided is invalid.' });
  }

  let playlist;

  try {
    playlist = await Playlist.findById(playlistId);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'The playlist could not be retrieved from the database' });
  }

  if (!playlist) {
    return res.status(422).send({ error: 'The playlist specified does not exist.' });
  }

  const { byUser, forUser } = playlist;

  if (!user._id.equals(byUser) && !user._id.equals(forUser)) {
    return res.status(401).send({ error: "You don't have permission to delete this playlist." });
  }

  try {
    await playlist.remove();
    res.status(200).send({ success: { playlist } });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'The playlist could not be deleted.' });
  }
};

export const editPlaylistTitle = (req, res) => {
  res.send('a');
};

export const updateLastSongPlayed = (req, res) => {
  res.send('a');
};
