import mongoose from 'mongoose';
import Song from '../models/Song';

const validateSong = async (songId, user) => {
  if (!mongoose.Types.ObjectId.isValid(songId)) {
    return { status: 422, error: 'The song ID provided is invalid.' };
  }

  let song;

  try {
    song = await Song.findById(songId);
  } catch (err) {
    console.log(err);
    return { status: 500, error: 'The song could not be retrieved from the database' };
  }

  if (!song) {
    return { status: 422, error: 'The song specified does not exist.' };
  }

  return song;
};

export default validateSong;
