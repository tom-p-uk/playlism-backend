import mongoose from 'mongoose';
import Playlist from '../models/Playlist';

const validatePlaylist = async (playlistId, user, editUpdateOrDelete) => {
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
    return { status: 401, error: `You don't have permission to ${editUpdateOrDelete} this playlist.` };
  }

  return playlist;
};

export default validatePlaylist;
