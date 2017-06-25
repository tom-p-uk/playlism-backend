import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import findOrCreate from 'findorcreate-promise';

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  fullName: String,
  displayName: String,
  googleId: String,
  facebookId: String,
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
