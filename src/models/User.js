import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import findOrCreate from 'findorcreate-promise';

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  displayName: {
    type: String,
    minlength: [4, 'Display name must be at least 4 characters long.'],
    maxlength: [50, 'Display name must less than 100 characters long.'],
  },
  googleId: String,
  facebookId: String,
  profileImg: String,
  dateJoined: {
    type: Date,
    default: Date.now(),
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  friendRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
});

UserSchema.plugin(findOrCreate);

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.local.password, (err, isMatch) => {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

const User = mongoose.model('user', UserSchema);

export default User;
