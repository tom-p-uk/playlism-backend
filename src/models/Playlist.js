import mongoose, { Schema } from 'mongoose';

mongoose.Promise = global.Promise;

const PlaylistSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: [4, 'Playlist title must be at least 4 characters long.'],
    maxlength: [100, 'Playlist title must less than 100 characters long.'],
  },
  dateAdded: {
    type: Date,
    default: Date.now(),
  },
  byUser: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
  },
  forUser: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
  },
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'song',
  }],
  lastSongPlayed: {
    type: Schema.Types.ObjectId,
    ref: 'song',
  },
});

const Playlist = mongoose.model('playlist', PlaylistSchema);

export default Playlist;
