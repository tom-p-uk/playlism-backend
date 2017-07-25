'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchUsers = exports.getFriendRequestsList = exports.getFriendsList = exports.deleteFriend = exports.acceptRejectFriendRequest = exports.addFriend = exports.addPushToken = exports.editProfileImg = exports.editDisplayName = exports.fetchUser = undefined;

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
            return _User2.default.findByIdAndUpdate(req.user._id, {
              displayName: displayName,
              displayNameLower: displayName.toLowerCase()
            }, { runValidators: true });

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
    var userId, sendingUser, receivingUser, friendRequestsSent, friendRequests, receivingUserIndex, sendingUserIndex;
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

            // Ensure that users don't exist in the friendRequestsSent / friendRequests
            // arrays and send an error message if so

            receivingUserIndex = friendRequestsSent.indexOf(receivingUser._id);
            sendingUserIndex = friendRequests.indexOf(sendingUser._id);

            if (!(receivingUserIndex !== -1 || sendingUserIndex !== -1)) {
              _context5.next = 13;
              break;
            }

            return _context5.abrupt('return', res.status(422).send({ error: 'You have already sent a friend request to this user.' }));

          case 13:

            friendRequestsSent.push(receivingUser);
            friendRequests.push(sendingUser);

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

            res.status(200).send({ success: { user: receivingUser } });

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

            accept ? res.status(200).send({ success: { user: sendingUser } }) : res.status(200).send({ success: 'Request rejected.' });
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

            res.status(200).send({ success: { friends: deletingUser.friends } });
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

var getFriendsList = exports.getFriendsList = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(req, res) {
    var user, _user, friends;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            user = req.user;
            _context8.prev = 1;
            _context8.next = 4;
            return _User2.default.findById(user._id).populate('friends');

          case 4:
            user = _context8.sent;
            _context8.next = 11;
            break;

          case 7:
            _context8.prev = 7;
            _context8.t0 = _context8['catch'](1);

            console.log(_context8.t0);
            return _context8.abrupt('return', res.status(500).send({ error: 'Could not retrieve friends list.' }));

          case 11:
            _user = user, friends = _user.friends;

            res.status(200).send({ success: { friends: friends } });

          case 13:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined, [[1, 7]]);
  }));

  return function getFriendsList(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var getFriendRequestsList = exports.getFriendRequestsList = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(req, res) {
    var user, _user2, friendRequests;

    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            user = req.user;

            console.log(user);
            _context9.prev = 2;
            _context9.next = 5;
            return _User2.default.findById(user._id).populate('friendRequests');

          case 5:
            user = _context9.sent;
            _context9.next = 12;
            break;

          case 8:
            _context9.prev = 8;
            _context9.t0 = _context9['catch'](2);

            console.log(_context9.t0);
            return _context9.abrupt('return', res.status(500).send({ error: 'Could not retrieve friend requests list.' }));

          case 12:
            _user2 = user, friendRequests = _user2.friendRequests;

            res.status(200).send({
              success: { friendRequests: friendRequests }
            });

          case 14:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined, [[2, 8]]);
  }));

  return function getFriendRequestsList(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

var searchUsers = exports.searchUsers = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(req, res) {
    var displayNameLower, users;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            displayNameLower = decodeURI(req.params.searchTerm).toLowerCase();
            _context10.next = 3;
            return _User2.default.find({ 'displayNameLower': { $regex: new RegExp('^' + displayNameLower, 'i') }
            });

          case 3:
            users = _context10.sent;


            console.log(users);
            res.status(200).send({ success: { users: users } });

          case 6:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  }));

  return function searchUsers(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();