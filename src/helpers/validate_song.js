import mongoose from 'mongoose';
import Song from '../models/Song';

const validateSong = async (songId, user, accessEditUpdateOrDelete) => {
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

  // const { byUser, forUser } = song;
  //
  // if (!user._id.equals(byUser) && !user._id.equals(forUser)) {
  //   return { status: 401, error: `You don't have permission to ${editUpdateOrDelete} this song.` };
  // }

  return song;
};

export default validateSong;
