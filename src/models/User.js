import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import findOrCreate from 'findorcreate-promise';

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  local: {
    username: String,
    password: String,
    profileImg: {
      type: String,
      default: 'http://i.imgur.com/8qPW2gr.png',
    },
  },
  facebook: {
    id: String,
    firstName: String,
    profileImg: String,
  },
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
  }]
});

UserSchema.plugin(findOrCreate);

// salt password using bcrypt
UserSchema.pre('save', function(next) {
  const user = this;

  if (user.local.password) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.local.password, salt, null, (err, hash) => {
        if (err) return next(err);

        user.local.password = hash;
        next();
      });
    });
  }
  else {
    next();
  }
});

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.local.password, (err, isMatch) => {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

const User = mongoose.model('user', UserSchema);

export default User;
