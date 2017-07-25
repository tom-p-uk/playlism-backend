'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _require_auth = require('../utils/require_auth');

var _require_auth2 = _interopRequireDefault(_require_auth);

var _user_controller = require('../controllers/user_controller');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// User controller routes
router.get('/', _require_auth2.default, _user_controller.fetchUser);
router.put('/displayname', _require_auth2.default, _user_controller.editDisplayName);
router.put('/profileimg', _require_auth2.default, _user_controller.editProfileImg);
router.put('/pushtoken', _require_auth2.default, _user_controller.addPushToken);
router.put('/friend/add', _require_auth2.default, _user_controller.addFriend);
router.put('/friend/delete', _require_auth2.default, _user_controller.deleteFriend);
router.put('/friend/acceptreject', _require_auth2.default, _user_controller.acceptRejectFriendRequest);
router.get('/friends', _require_auth2.default, _user_controller.getFriendsList);
router.get('/friendrequests', _require_auth2.default, _user_controller.getFriendRequestsList);
router.get('/search/:searchTerm', _require_auth2.default, _user_controller.searchUsers);

exports.default = router;