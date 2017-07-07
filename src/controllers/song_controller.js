import Song from '../models/Song';
import validateSong from '../helpers/validate_song';
import validatePlaylist from '../helpers/validate_playlist';
import validateUrl from 'youtube-url';
import mongoose from 'mongoose';
import _ from 'lodash';

export const addSong = async (req, res) => {
  const { user } = req;
  const  { youTubeUrl, playlistId } = req.body;

  if (!youTubeUrl) {
    return res.status(422).send({ error: 'A YouTube URL must be provided.' });
  } else if (!validateUrl.valid(youTubeUrl)) {
    return res.status(422).send({ error: 'The YouTube URL provided is invalid.' });
  }

  if (!playlistId) {
    return res.status(422).send({ error: 'A playlist ID must be provided.' });
  } else if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(422).send({ error: 'The playlist ID provided is invalid.' });
  }

  const playlist = mongoose.Types.ObjectId(playlistId);
  const foundSong = await Song.findOne({ youTubeUrl });

  if (foundSong) {
    console.log(foundSong);
    const index = _.findIndex(foundSong.inPlaylists, object => object === playlist);
    console.log(index);
  }

  const song = new Song({ youTubeUrl, inPlaylists: [] });

  try {
    song.save();
    res.status(200).send({ success: song });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'The song could not be added.' });
  }
};

export const deleteSong  = async (req, res) => {
  const { user } = req;
  const { songId } = req.params;
  res.status(200).send({ success: 'a' });
};

export const fetchSongsInPlaylist  = async (req, res) => {
  const { user } = req;
  const  { playlistId } = req.params;
  res.status(200).send({ success: 'a' });
};

export const fetchLikedSongs  = async (req, res) => {
  const { user } = req;
  res.status(200).send({ success: 'a' });
};
