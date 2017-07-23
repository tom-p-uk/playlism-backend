'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _findorcreatePromise = require('findorcreate-promise');

var _findorcreatePromise2 = _interopRequireDefault(_findorcreatePromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

var UserSchema = new _mongoose.Schema({
  firstName: String,
  lastName: String,
  displayName: {
    type: String,
    minlength: [4, 'Display name must be at least 4 characters long.'],
    maxlength: [100, 'Display name must no more than 100 characters long.']
  },
  googleId: String,
  facebookId: String,
  profileImg: String,
  dateJoined: {
    type: Date,
    default: Date.now()
  },
  friends: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  friendRequests: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  friendRequestsSent: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  lastLogin: Date,
  pushToken: String
});

UserSchema.plugin(_findorcreatePromise2.default);

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.local.password, function (err, isMatch) {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

var User = _mongoose2.default.model('user', UserSchema);

exports.default = User;