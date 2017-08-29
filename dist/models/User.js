'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

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
  friends: [{
    friendsSince: Date,
    user: {
      type: _mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  }],
  friendRequests: [{
    dateReceived: Date,
    user: {
      type: _mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  }],
  friendRequestsSent: [{
    dateSent: Date,
    user: {
      type: _mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  }],
  lastLogin: {
    type: Date,
    default: Date.now()
  },
  pushToken: String,
  displayNameLower: String
}, {
  timestamps: {
    createdAt: 'dateJoined'
  }
});

var User = _mongoose2.default.model('user', UserSchema);

exports.default = User;