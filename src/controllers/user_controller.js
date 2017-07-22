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
    await User.findByIdAndUpdate(req.user._id, { displayName }, { runValidators: true });
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

  let { friendRequestsSent } = sendingUser;
  let { friendRequests } = receivingUser;

  // Convert to array of strings for comparison
  friendRequestsSent = friendRequestsSent.map(id => id.toString());
  friendRequests = friendRequests.map(id => id.toString());

  // Add stingified ObjectIds to arrays, and ensure arrays are stripped of any duplicate entries
  friendRequestsSent = _.uniq([...friendRequestsSent, receivingUser._id.toString()]);
  friendRequests = _.uniq([...friendRequests, sendingUser._id.toString()]);

  // Convert back to ObjectIds
  friendRequestsSent = friendRequestsSent.map(id => mongoose.Types.ObjectId(id));
  friendRequests = friendRequests.map(id => mongoose.Types.ObjectId(id));

  sendingUser.friendRequestsSent = friendRequestsSent;
  receivingUser.friendRequests = friendRequests;

  // Save sendingUser and receivingUser
  try {
    await sendingUser.save();
    await receivingUser.save();

    res.status(200).send({ success: { users: [sendingUser, receivingUser] } });

    if (receivingUser.pushToken) {
      sendPushNotifications(receivingUser.pushToken, `${sendingUser.displayName} sent you a friend request on Playlism.`)
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
  const index = receivingUser.friendRequests.indexOf(mongoose.Types.ObjectId(userId));

  if (index === -1) {
    return res.status(422).send({ error: 'You have not received a friend request from this user.' });
  }

  const sendingUser = await User.findById(userId);

  let { friendRequestsSent } = sendingUser;
  let { friendRequests } = receivingUser;

  // Remove users from friendRequestsSent and friendRequests arrays
  friendRequestsSent = friendRequestsSent.filter(id => !id.equals(receivingUser._id));
  friendRequests = friendRequests.filter(id => !id.equals(sendingUser._id));

  sendingUser.friendRequestsSent = friendRequestsSent;
  receivingUser.friendRequests = friendRequests;

  if (accept) {
    sendingUser.friends.push(receivingUser);
    receivingUser.friends.push(sendingUser);
  }

  try {
    await receivingUser.save();
    await sendingUser.save();
    res.status(200).send({ success: 'Friend added.' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Could not accept friend request.' });
  }
};

export const deleteFriend = async (req, res) => {
  const { userId } = req.body;
  const deletingUser = req.user;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(422).send({ error: 'You must provide a valid user ID.' });
  }

  // Check for presence of userId in user's 'friends' arrays, and send error if not found
  const index = deletingUser.friends.indexOf(mongoose.Types.ObjectId(userId));

  if (index === -1) {
    return res.status(422).send({ error: 'That user is not currently in your friends list.' });
  }

  const deletedUser = await User.findById(userId);

  // Remove users from users from each other's 'friends' arrays
  deletingUser.friends = deletingUser.friends.filter(id => !id.equals(deletedUser._id));
  deletedUser.friends = deletedUser.friends.filter(id => !id.equals(deletingUser._id));

  try {
    await deletingUser.save();
    await deletedUser.save();

    res.status(200).send({ success: 'User deleted.' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'User could not be unfriended.' })
  }
};
