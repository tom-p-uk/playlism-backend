import express from 'express';
import requireAuth from '../utils/require_auth';
import {
  fetchUser,
  editDisplayName,
  editProfileImg,
  addPushToken,
  addFriend,
  deleteFriend,
  acceptRejectFriendRequest,
  getFriendsList,
  getFriendRequestsList,
  searchUsers,
} from '../controllers/user_controller';

const router = express.Router();

// User controller routes
router.get('/', requireAuth, fetchUser);
router.put('/displayname', requireAuth, editDisplayName);
router.put('/profileimg', requireAuth, editProfileImg);
router.put('/pushtoken', requireAuth, addPushToken);
router.put('/friend/add', requireAuth, addFriend);
router.put('/friend/delete', requireAuth, deleteFriend);
router.put('/friend/acceptreject', requireAuth, acceptRejectFriendRequest);
router.get('/friends', requireAuth, getFriendsList);
router.get('/friendrequests', requireAuth, getFriendRequestsList);
router.get('/search/:searchTerm', requireAuth, searchUsers);

export default router;
