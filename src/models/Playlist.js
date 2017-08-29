import mongoose, { Schema } from 'mongoose';

mongoose.Promise = global.Promise;

const PlaylistSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Playlist title must be provided.'],
    minlength: [4, 'Playlist title must be at least 4 characters long.'],
    maxlength: [30, 'Playlist title must be no more than 30 characters long.'],
  },
  byUser: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
  },
  forUser: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'A recipient user must be provided.'],
  },
  lastSongPlayed: {
    type: Schema.Types.ObjectId,
    ref: 'song',
  },
  lastUpdated: {
    type: Date,
    default: Date.now(),
  },
}, {
  timestamps: {
    createdAt: 'dateAdded'
  }
});

const Playlist = mongoose.model('playlist', PlaylistSchema);

export default Playlist;
