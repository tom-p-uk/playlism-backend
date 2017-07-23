'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFriend = exports.acceptRejectFriendRequest = exports.addFriend = exports.addPushToken = exports.editProfileImg = exports.editDisplayName = exports.fetchUser = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _validUrl = require('valid-url');

var _validUrl2 = _interopRequireDefault(_validUrl);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _token = require('../utils/token');

var _token2 = _interopRequireDefault(_token);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _exponentServerSdk = require('exponent-server-sdk');

var _exponentServerSdk2 = _interopRequireDefault(_exponentServerSdk);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _send_push_notifications = require('../services/send_push_notifications');

var _send_push_notifications2 = _interopRequireDefault(_send_push_notifications);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Fetch user data for users already signed in
var fetchUser = exports.fetchUser = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res) {
    var user;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            user = req.user;
            _context.next = 4;
            return user.update({ lastLogin: Date.now() });

          case 4:
            return _context.abrupt('return', res.status(200).send({ success: { user: user } }));

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0);
            return _context.abrupt('return', res.status(500).send({ error: 'Error retrieving user from database.' }));

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 7]]);
  }));

  return function fetchUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var editDisplayName = exports.editDisplayName = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res) {
    var displayName;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            displayName = req.body.displayName;
            _context2.prev = 1;
            _context2.next = 4;
            return _User2.default.findByIdAndUpdate(req.user._id, { displayName: displayName }, { runValidators: true });

          case 4:
            res.status(200).send({ success: { displayName: displayName } });
            _context2.next = 11;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2['catch'](1);

            console.log(_context2.t0);
            if (_context2.t0.errors.displayName) res.status(422).send({ error: _context2.t0.errors.displayName.message });else res.status(500).send({ error: 'Display name could not be updated.' });

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[1, 7]]);
  }));

  return function editDisplayName(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var editProfileImg = exports.editProfileImg = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, res) {
    var profileImg;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            profileImg = req.body.profileImg;

            if (_validUrl2.default.isUri(profileImg)) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt('return', res.status(422).send({ error: 'You must provide a valid URL.' }));

          case 3:
            _context3.prev = 3;
            _context3.next = 6;
            return _User2.default.findByIdAndUpdate(req.user._id, { profileImg: profileImg });

          case 6:
            res.status(200).send({ success: { profileImg: profileImg } });
            _context3.next = 13;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3['catch'](3);

            console.log(_context3.t0);
            res.status(500).send({ error: 'Profile image could not be updated.' });

          case 13:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[3, 9]]);
  }));

  return function editProfileImg(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var addPushToken = exports.addPushToken = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(req, res) {
    var pushToken, user, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            pushToken = req.body.pushToken;
            user = req.user;

            if (_exponentServerSdk2.default.isExponentPushToken(pushToken)) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt('return', res.status(422).send({ error: 'Not a valid Expo push token.' }));

          case 4:
            _context4.prev = 4;
            _context4.next = 7;
            return user.update({ pushToken: pushToken });

          case 7:
            result = _context4.sent;

            res.status(200).send({ success: result });
            _context4.next = 15;
            break;

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4['catch'](4);

            console.log(_context4.t0);
            return _context4.abrupt('return', res.status(500).send({ error: 'Push token could not be added.' }));

          case 15:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[4, 11]]);
  }));

  return function addPushToken(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var addFriend = exports.addFriend = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(req, res) {
    var userId, sendingUser, receivingUser, friendRequestsSent, friendRequests;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            userId = req.body.userId;

            if (!(!userId || !_mongoose2.default.Types.ObjectId.isValid(userId))) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt('return', res.status(422).send({ error: 'You must provide a valid user ID.' }));

          case 3:
            sendingUser = req.user;
            _context5.next = 6;
            return _User2.default.findById(userId);

          case 6:
            receivingUser = _context5.sent;
            friendRequestsSent = sendingUser.friendRequestsSent;
            friendRequests = receivingUser.friendRequests;

            // Convert to array of strings for comparison

            friendRequestsSent = friendRequestsSent.map(function (id) {
              return id.toString();
            });
            friendRequests = friendRequests.map(function (id) {
              return id.toString();
            });

            // Add stingified ObjectIds to arrays, and ensure arrays are stripped of any duplicate entries
            friendRequestsSent = _lodash2.default.uniq([].concat((0, _toConsumableArray3.default)(friendRequestsSent), [receivingUser._id.toString()]));
            friendRequests = _lodash2.default.uniq([].concat((0, _toConsumableArray3.default)(friendRequests), [sendingUser._id.toString()]));

            // Convert back to ObjectIds
            friendRequestsSent = friendRequestsSent.map(function (id) {
              return _mongoose2.default.Types.ObjectId(id);
            });
            friendRequests = friendRequests.map(function (id) {
              return _mongoose2.default.Types.ObjectId(id);
            });

            sendingUser.friendRequestsSent = friendRequestsSent;
            receivingUser.friendRequests = friendRequests;

            // Save sendingUser and receivingUser
            _context5.prev = 17;
            _context5.next = 20;
            return sendingUser.save();

          case 20:
            _context5.next = 22;
            return receivingUser.save();

          case 22:

            res.status(200).send({ success: { users: [sendingUser, receivingUser] } });

            if (receivingUser.pushToken) {
              (0, _send_push_notifications2.default)(receivingUser.pushToken, sendingUser.displayName + ' sent you a friend request on Playlism.');
            }
            _context5.next = 30;
            break;

          case 26:
            _context5.prev = 26;
            _context5.t0 = _context5['catch'](17);

            console.log(_context5.t0);
            res.status(500).send({ error: 'User could not be updated.' });

          case 30:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[17, 26]]);
  }));

  return function addFriend(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var acceptRejectFriendRequest = exports.acceptRejectFriendRequest = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(req, res) {
    var _req$body, userId, accept, receivingUser, index, sendingUser, friendRequestsSent, friendRequests;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _req$body = req.body, userId = _req$body.userId, accept = _req$body.accept;
            receivingUser = req.user;

            if (!(!userId || !_mongoose2.default.Types.ObjectId.isValid(userId))) {
              _context6.next = 4;
              break;
            }

            return _context6.abrupt('return', res.status(422).send({ error: 'You must provide a valid user ID.' }));

          case 4:

            // Check for presence of userId in friendRequests and send error if not found
            index = receivingUser.friendRequests.indexOf(_mongoose2.default.Types.ObjectId(userId));

            if (!(index === -1)) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt('return', res.status(422).send({ error: 'You have not received a friend request from this user.' }));

          case 7:
            _context6.next = 9;
            return _User2.default.findById(userId);

          case 9:
            sendingUser = _context6.sent;
            friendRequestsSent = sendingUser.friendRequestsSent;
            friendRequests = receivingUser.friendRequests;

            // Remove users from friendRequestsSent and friendRequests arrays

            friendRequestsSent = friendRequestsSent.filter(function (id) {
              return !id.equals(receivingUser._id);
            });
            friendRequests = friendRequests.filter(function (id) {
              return !id.equals(sendingUser._id);
            });

            sendingUser.friendRequestsSent = friendRequestsSent;
            receivingUser.friendRequests = friendRequests;

            if (accept) {
              sendingUser.friends.push(receivingUser);
              receivingUser.friends.push(sendingUser);
            }

            _context6.prev = 17;
            _context6.next = 20;
            return receivingUser.save();

          case 20:
            _context6.next = 22;
            return sendingUser.save();

          case 22:
            res.status(200).send({ success: 'Friend added.' });
            _context6.next = 29;
            break;

          case 25:
            _context6.prev = 25;
            _context6.t0 = _context6['catch'](17);

            console.log(_context6.t0);
            res.status(500).send({ error: 'Could not accept friend request.' });

          case 29:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[17, 25]]);
  }));

  return function acceptRejectFriendRequest(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var deleteFriend = exports.deleteFriend = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(req, res) {
    var userId, deletingUser, index, deletedUser;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            userId = req.body.userId;
            deletingUser = req.user;

            if (!(!userId || !_mongoose2.default.Types.ObjectId.isValid(userId))) {
              _context7.next = 4;
              break;
            }

            return _context7.abrupt('return', res.status(422).send({ error: 'You must provide a valid user ID.' }));

          case 4:

            // Check for presence of userId in user's 'friends' arrays, and send error if not found
            index = deletingUser.friends.indexOf(_mongoose2.default.Types.ObjectId(userId));

            if (!(index === -1)) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt('return', res.status(422).send({ error: 'That user is not currently in your friends list.' }));

          case 7:
            _context7.next = 9;
            return _User2.default.findById(userId);

          case 9:
            deletedUser = _context7.sent;


            // Remove users from users from each other's 'friends' arrays
            deletingUser.friends = deletingUser.friends.filter(function (id) {
              return !id.equals(deletedUser._id);
            });
            deletedUser.friends = deletedUser.friends.filter(function (id) {
              return !id.equals(deletingUser._id);
            });

            _context7.prev = 12;
            _context7.next = 15;
            return deletingUser.save();

          case 15:
            _context7.next = 17;
            return deletedUser.save();

          case 17:

            res.status(200).send({ success: 'User deleted.' });
            _context7.next = 24;
            break;

          case 20:
            _context7.prev = 20;
            _context7.t0 = _context7['catch'](12);

            console.log(_context7.t0);
            res.status(500).send({ error: 'User could not be unfriended.' });

          case 24:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[12, 20]]);
  }));

  return function deleteFriend(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();