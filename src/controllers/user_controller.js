import validUrl from 'valid-url';
import User from '../models/User';
import tokenForUser from '../utils/token';
import mongoose from 'mongoose';
import Expo from 'exponent-server-sdk';
import _ from 'lodash';
import sendPushNotifications from '../services/send_push_notifications';

// Fetch user data for users already signed in
export const fetchUser = async (req, res) => {
  try {
    const { user } = req;

    await user.update({ lastLogin: Date.now() });
    return res.status(200).send({ success: { user } });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Error retrieving user from database.' });
  }
};

export const editDisplayName = async (req, res) => {
  const { displayName } = req.body;
  try {
    await User.findByIdAndUpdate(req.user._id, {
      displayName,
      displayNameLower: displayName.toLowerCase()
    }, { runValidators: true });

    res.status(200).send({ success: { displayName }});
  } catch (err) {
    console.log(err);
    if (err.errors.displayName) res.status(422).send({ error: err.errors.displayName.message });
    else res.status(500).send({ error: 'Display name could not be updated.' });
  }
};

export const editProfileImg = async (req, res) => {
  const { profileImg } = req.body;
  if (!validUrl.isUri(profileImg)) return res.status(422).send({ error: 'You must provide a valid URL.' });

  try {
    await User.findByIdAndUpdate(req.user._id, { profileImg });
    res.status(200).send({ success: { profileImg }});
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Profile image could not be updated.' });
  }
};

export const addPushToken = async (req, res) => {
  const { pushToken } = req.body;
  const { user } = req;

  if (!Expo.isExponentPushToken(pushToken)) {
    return res.status(422).send({ error: 'Not a valid Expo push token.' });
  }

  try {
    const result = await user.update({ pushToken });
    res.status(200).send({ success: result });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Push token could not be added.' });
  }
};

export const addFriend = async (req, res) => {
  const { userId } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(422).send({ error: 'You must provide a valid user ID.' });
  }

  const sendingUser = req.user;
  const receivingUser = await User.findById(userId);

  if (!receivingUser) {
    return res.status(422).send({ error: 'User not found.' });
  }

  let { friendRequestsSent } = sendingUser;
  let { friendRequests } = receivingUser;

  // Ensure that users don't exist in the friendRequestsSent / friendRequests
  // arrays and send an error message if so
  const receivingUserIndex = _.findIndex(friendRequestsSent, { user: receivingUser._id });
  const sendingUserIndex = _.findIndex(friendRequests, { user: sendingUser._id });

  if (receivingUserIndex !== -1 || sendingUserIndex !== -1) {
    return res.status(422).send({ error: 'You have already sent a friend request to this user.' });
  }

  const sentRequest = {
    dateSent: Date.now(),
    user: receivingUser._id,
  };

  const receivedRequest = {
    dateReceived: Date.now(),
    user: sendingUser._id,
  };

  friendRequestsSent.push(sentRequest);
  friendRequests.push(receivedRequest);

  // Save sendingUser and receivingUser
  try {
    await sendingUser.save();
    await receivingUser.save();

    res.status(200).send({ success: { friendRequestsSent } });

    if (receivingUser.pushToken) {
      sendPushNotifications(receivingUser.pushToken, `${sendingUser.displayName} sent you a friend request on Playlism.`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'User could not be updated.' });
  }
};

export const acceptRejectFriendRequest = async (req, res) => {
  const { userId, accept } = req.body;
  const receivingUser = req.user;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(422).send({ error: 'You must provide a valid user ID.' });
  }

  // Check for presence of userId in friendRequests and send error if not found
  const index = _.findIndex(receivingUser.friendRequests, { user: mongoose.Types.ObjectId(userId) });

  if (index === -1) {
    return res.status(422).send({ error: 'You have not received a friend request from this user.' });
  }

  const sendingUser = await User.findById(userId);

  let { friendRequestsSent } = sendingUser;
  let { friendRequests } = receivingUser;

  // Remove users from friendRequestsSent and friendRequests arrays
  const friendRequestsSentFiltered = _.filter(friendRequestsSent, obj => !obj.user.equals(receivingUser._id));
  const friendRequestsFiltered = _.filter(friendRequests, obj => !obj.user.equals(sendingUser._id));

  sendingUser.friendRequestsSent = friendRequestsSentFiltered;
  receivingUser.friendRequests = friendRequestsFiltered;

  const sendingUserFriend = {
    friendsSince: Date.now(),
    user: receivingUser._id,
  };

  const receivingUserFriend = {
    friendsSince: Date.now(),
    user: sendingUser._id,
  };

  if (accept) {
    sendingUser.friends.push(sendingUserFriend);
    receivingUser.friends.push(receivingUserFriend);
  }
  try {
    await receivingUser.save();
    await sendingUser.save();

    receivingUserFriend.user = sendingUser;
    if (accept) {
      res.status(200).send({ success: { friend: receivingUserFriend } });

      if (sendingUser.pushToken) {
      sendPushNotifications(sendingUser.pushToken, `${receivingUser.displayName} accepted your friend request on Playlism.`);
    }
    } else {
      res.status(200).send({ success: 'Request rejected.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Could not respond to friend request.' });
  }
};

export const deleteFriend = async (req, res) => {
  const { userId } = req.body;
  const deletingUser = req.user;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(422).send({ error: 'You must provide a valid user ID.' });
  }

  // Check for presence of userId in user's 'friends' arrays, and send error if not found
  // const index = deletingUser.friends.indexOf(mongoose.Types.ObjectId(userId));
  const index = _.findIndex(deletingUser.friends, { user: mongoose.Types.ObjectId(userId) });

  if (index === -1) {
    return res.status(422).send({ error: 'That user is not currently in your friends list.' });
  }

  const deletedUser = await User.findById(userId);

  // Remove users from users from each other's 'friends' arrays
  deletingUser.friends = deletingUser.friends.filter(obj => !obj.user.equals(deletedUser._id));
  deletedUser.friends = deletedUser.friends.filter(obj => !obj.user.equals(deletingUser._id));

  try {
    await deletingUser.save();
    await deletedUser.save();

    res.status(200).send({ success: { friends: deletingUser.friends } });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'User could not be deleted.' })
  }
};

export const getFriendsList = async(req, res) => {
  let { user } = req;

  try {
    user = await User.findById(user._id).populate('friends.user');
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Could not retrieve friends list.' });
  }

  const { friends } = user;
  res.status(200).send({ success: { friends }});
};

export const getFriendRequestsList = async (req, res) => {
  let { user } = req;

  try {
    user = await User.findById(user._id).populate('friendRequests.user');
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Could not retrieve friend requests list.' });
  }

  const { friendRequests } = user;
  res.status(200).send({
    success: { friendRequests }
  });
};

export const searchUsers = async (req, res) => {
  const { user } = req;
  const displayNameLower = decodeURIComponent(req.params.searchTerm).toLowerCase();

  try {
    let users = await User.find({ 'displayNameLower':
      { $regex: new RegExp('^' + displayNameLower, 'i') }
    });

    // Filter searching user from the array
    users = users.filter(userObj => !userObj._id.equals(user._id));

    res.status(200).send({ success: { users } });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Search results could not be returned.' });
  }
};
