import mongoose, { Schema } from 'mongoose';

mongoose.Promise = global.Promise;

const SongSchema = new Schema({
  dateAdded: {
    type: Date,
    default: Date.now(),
  },
  youTubeUrl: {
    required: true,
    type: String,
  },
  likedByUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
  inPlaylists: [{
    type: Schema.Types.ObjectId,
    ref: 'playlist',
  }],
});

const Song = mongoose.model('song', SongSchema);

export default Song;
