import Playlist from '../models/Playlist';
import tokenForUser from '../services/token';

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
      res.status(500).send({ error: 'Playlist could not be created.' });
    }
  }
};

export const deletePlaylist = (req, res) => {
  res.send('a');
};

export const editPlaylistTitle = (req, res) => {
  res.send('a');
};

export const updateLastSongPlayed = (req, res) => {
  res.send('a');
};
