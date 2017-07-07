import Song from '../models/Song';
import validateSong from '../helpers/validate_song';
import validatePlaylist from '../helpers/validate_playlist';
import validateUrl from 'youtube-url';
import mongoose from 'mongoose';

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
    song = new Song({ youTubeUrl, inPlaylists: [] }); // if song doesn't exist, create new instance
  }

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
