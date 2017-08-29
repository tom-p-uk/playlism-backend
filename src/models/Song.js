import mongoose, { Schema } from 'mongoose';

mongoose.Promise = global.Promise;

const SongSchema = new Schema({
  youTubeUrl: {
    required: true,
    type: String,
  },
  videoId: {
    type: String,
  },
  title: String,
  description: String,
  thumbnail: String,
  likedByUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
  }],
  inPlaylists: [{
    type: Schema.Types.ObjectId,
    ref: 'playlist',
  }],
}, {
  timestamps: {
    createdAt: 'dateAdded'
  }
});

const Song = mongoose.model('song', SongSchema);

export default Song;
