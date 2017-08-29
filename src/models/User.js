import mongoose, { Schema } from 'mongoose';

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  displayName: {
    type: String,
    minlength: [4, 'Display name must be at least 4 characters long.'],
    maxlength: [100, 'Display name must no more than 100 characters long.'],
  },
  googleId: String,
  facebookId: String,
  profileImg: String,
  friends: [{
    friendsSince: Date,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
  }],
  friendRequests: [{
    dateReceived: Date,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
  }],
  friendRequestsSent: [{
    dateSent: Date,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
  }],
  lastLogin: {
    type: Date,
    default: Date.now(),
  },
  pushToken: String,
  displayNameLower: String,
}, {
  timestamps: {
    createdAt: 'dateJoined'
  }
});

const User = mongoose.model('user', UserSchema);

export default User;
