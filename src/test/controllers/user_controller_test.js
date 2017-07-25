import { expect } from 'chai';
import app from '../../app';
import request from 'supertest';
import User from '../../models/User';
import tokenForUser from '../../utils/token';
import _ from 'lodash';

describe('userController', () => {
  let user1;
  let user1Token;

  beforeEach(async () => {
    user1 = new User({
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User1',
      displayNameLower: 'test user1',
      profileImg: 'http://www.somesite.com/someimg.png',
    });

    user1Token = tokenForUser(user1);
    await user1.save();
  });

  /*****************************************************************************
  ********************************* .fetchUser *********************************
  *****************************************************************************/
  describe('.fetchUser', () => {
    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .get('/api/user');

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('responds with user info following a successful request', async () => {
      const res = await request(app)
        .get('/api/user')
        .set('authorization', user1Token);

      const { _id, firstName, lastName, displayName } = res.body.success.user;
      expect(res.status).to.equal(200);
      expect(_id).to.equal(user1._id.toString());
      expect(firstName).to.equal(user1.firstName);
      expect(lastName).to.equal(user1.lastName);
      expect(displayName).to.equal(user1.displayName);
    });
  });

  /*****************************************************************************
  ****************************** .editDisplayName ******************************
  *****************************************************************************/
  describe('.editDisplayName', () => {
    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .put('/api/user/displayname');

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('allows a user to edit their display name', async () => {
      const res = await request(app)
        .put('/api/user/displayname')
        .send({ displayName: 'Display Name' })
        .set('authorization', user1Token);

      const updatedUser = await User.findById(user1._id);
      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(updatedUser.displayName).to.equal('Display Name');
    });

    it('also changes the "displayNameLower" field', async () => {
      const res = await request(app)
        .put('/api/user/displayname')
        .send({ displayName: 'Display Name' })
        .set('authorization', user1Token);

      const updatedUser = await User.findById(user1._id);
      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(updatedUser.displayNameLower).to.equal('display name');
    });

    it('throws an error if the proposed display name is too short', async () => {
      const res = await request(app)
        .put('/api/user/displayname')
        .send({ displayName: '' })
        .set('authorization', user1Token);

      const foundUser = await User.findById(user1._id);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('Display name must be at least 4 characters long.');
      expect(foundUser.displayName).to.equal('Test User1');
    });

    it('throws an error if the proposed display name is too long', async () => {
      const res = await request(app)
        .put('/api/user/displayname')
        .send({ displayName: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901' })
        .set('authorization', user1Token);

      const foundUser = await User.findById(user1._id);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('Display name must no more than 100 characters long.');
      expect(foundUser.displayName).to.equal('Test User1');
    });
  });

  /*****************************************************************************
  ******************************* .editProfileImg ******************************
  *****************************************************************************/
  describe('.editProfileImg', () => {
    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .put('/api/user/profileimg');
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('allows a user to change their profile image', async () => {
      const res = await request(app)
        .put('/api/user/profileimg')
        .send({ profileImg: 'http://www.somesite.com/someotherimg.png' })
        .set('authorization', user1Token);

      const updatedUser = await User.findById(user1._id);
      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(updatedUser.profileImg).to.equal('http://www.somesite.com/someotherimg.png');
    });

    it('sends an error message if an invalid URL is passed', async () => {
      const res = await request(app)
        .put('/api/user/profileimg')
        .send({ profileImg: '' })
        .set('authorization', user1Token);

      const updatedUser = await User.findById(user1._id);
      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('You must provide a valid URL.');
    });
  });

  /*****************************************************************************
  ******************************** .addPushToken *******************************
  *****************************************************************************/
  describe('.addPushToken', () => {
    const pushToken = 'ExponentPushToken[XPWN7TGbzc2PUSwXbnAtTv]';

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .put('/api/user/pushtoken');

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends an error if an invalid Expo push token is provided', async () => {
      const res = await request(app)
        .put('/api/user/pushtoken')
        .send({ pushToken: '12345' })
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('Not a valid Expo push token.');
    });

    it("updates a user's 'pushToken' prop", async () => {
      const res = await request(app)
        .put('/api/user/pushtoken')
        .send({ pushToken })
        .set('authorization', user1Token);

      const foundUser = await User.findById(user1._id);
      expect(foundUser.pushToken).to.equal(pushToken);
    });
  });

  /*****************************************************************************
  ********************************* .addFriend *********************************
  *****************************************************************************/
  describe('.addFriend', () => {
    let user2;
    let user2Token;

    beforeEach(async () => {
      user2 = new User({
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User12',
      });

      user2Token = tokenForUser(user2);
      await user2.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .put('/api/user/friend/add');
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends an error if no user ID, or an invalid user ID, is provided', async () => {
      const res1 = await request(app)
        .put('/api/user/friend/add')
        .set('authorization', user1Token);

      const res2 = await request(app)
        .put('/api/user/friend/add')
        .send({ userId: '12345' })
        .set('authorization', user1Token);

      expect(res1.status).to.equal(422);
      expect(res1.body.error).to.exist;
      expect(res1.body.error).to.equal('You must provide a valid user ID.');
      expect(res2.status).to.equal(422);
      expect(res2.body.error).to.exist;
      expect(res2.body.error).to.equal('You must provide a valid user ID.');
    });

    it("adds the sending user to the receiving user's 'friendRequests' array", async () => {
      const res = await request(app)
        .put('/api/user/friend/add')
        .send({ userId: user2._id })
        .set('authorization', user1Token);

      const foundUser = await User.findById(user2._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundUser.friendRequests.length).to.equal(1);
      expect(foundUser.friendRequests.indexOf(user1._id)).to.not.equal(-1);
    });

    it("adds the receiving user to the sending user's 'friendRequestsSent' array", async () => {
      const res = await request(app)
        .put('/api/user/friend/add')
        .send({ userId: user2._id })
        .set('authorization', user1Token);

      const foundUser = await User.findById(user1._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundUser.friendRequestsSent.length).to.equal(1);
      expect(foundUser.friendRequestsSent.indexOf(user2._id)).to.not.equal(-1);
    });

    it('sends back the user that receives the request as a response', async () => {
      const res = await request(app)
        .put('/api/user/friend/add')
        .send({ userId: user2._id })
        .set('authorization', user1Token);

      const foundUser = await User.findById(user2._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.user._id).to.equal(user2._id.toString());
    });

    it('prevents duplicate requests being sent', async () => {
      user1.friendRequestsSent = [user2];
      user2.friendRequests = [user1];

      await user1.save();
      await user2.save();

      const res = await request(app)
        .put('/api/user/friend/add')
        .send({ userId: user2._id })
        .set('authorization', user1Token);

      const foundUser1 = await User.findById(user1._id);
      const foundUser2 = await User.findById(user2._id);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('You have already sent a friend request to this user.');
      expect(foundUser1.friendRequestsSent.length).to.equal(1);
      expect(foundUser2.friendRequests.length).to.equal(1);
    });
  });

  /*****************************************************************************
  ************************ .acceptRejectFriendRequest **************************
  *****************************************************************************/
  describe('.acceptRejectFriendRequest', () => {
    let user2;
    let user2Token;

    beforeEach(async () => {
      user2 = new User({
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User2',
        friendRequests: [user1],
      });

      user1.friendRequestsSent = [user2];
      user2Token = tokenForUser(user2);

      await user1.save();
      await user2.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .put('/api/user/friend/acceptreject');
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends an error if no user ID, or an invalid user ID, is provided', async () => {
      const res1 = await request(app)
        .put('/api/user/friend/acceptreject')
        .set('authorization', user2Token);

      const res2 = await request(app)
        .put('/api/user/friend/acceptreject')
        .send({ userId: '12345' })
        .set('authorization', user2Token);

      expect(res1.status).to.equal(422);
      expect(res1.body.error).to.exist;
      expect(res1.body.error).to.equal('You must provide a valid user ID.');
      expect(res2.status).to.equal(422);
      expect(res2.body.error).to.exist;
      expect(res2.body.error).to.equal('You must provide a valid user ID.');
    });

    it("sends an error if user ID provided is not in a user's 'friendRequests' array", async () => {
      const user3 = new User();

      const res = await request(app)
        .put('/api/user/friend/acceptreject')
        .send({ userId: user3._id })
        .set('authorization', user2Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('You have not received a friend request from this user.');
    });

    it("removes the sending user from the receiving user's 'friendRequests' array", async () => {
      const user3 = new User();
      user2.friendRequests.push(user3);
      await user2.save();

      const res = await request(app)
        .put('/api/user/friend/acceptreject')
        .send({ userId: user1._id })
        .set('authorization', user2Token);

      const foundUser = await User.findById(user2._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundUser.friendRequests.length).to.equal(1);
      expect(foundUser.friendRequests.indexOf(user1._id)).to.equal(-1);
    });

    it("removes the receiving user from the sending user's 'friendRequestsSent' array", async () => {
      const res = await request(app)
        .put('/api/user/friend/acceptreject')
        .send({ userId: user1._id })
        .set('authorization', user2Token);

      const foundUser = await User.findById(user1._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundUser.friendRequestsSent.length).to.equal(0);
      expect(foundUser.friendRequestsSent.indexOf(user2._id)).to.equal(-1);
    });

    it("adds the sending user to the receiving user's 'friends' array if { accept: true } is sent", async () => {
      const res = await request(app)
        .put('/api/user/friend/acceptreject')
        .send({ userId: user1._id, accept: true })
        .set('authorization', user2Token);

      const foundUser = await User.findById(user2._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundUser.friends.length).to.equal(1);
      expect(foundUser.friends.indexOf(user1._id)).to.not.equal(-1);
    });

    it("adds the receiving user to the sending user's 'friends' array if { accept: true } is sent", async () => {
      const res = await request(app)
        .put('/api/user/friend/acceptreject')
        .send({ userId: user1._id, accept: true })
        .set('authorization', user2Token);

      const foundUser = await User.findById(user1._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundUser.friends.length).to.equal(1);
      expect(foundUser.friends.indexOf(user2._id)).to.not.equal(-1);
    });

    it("adds the sending user to the receiving user's 'friends' array if { accept: true } is not sent", async () => {
      const res = await request(app)
        .put('/api/user/friend/acceptreject')
        .send({ userId: user1._id })
        .set('authorization', user2Token);

      const foundUser = await User.findById(user2._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundUser.friends.length).to.equal(0);
      expect(foundUser.friends.indexOf(user1._id)).to.equal(-1);
    });

    it("adds the receiving user to the sending user's 'friends' array if { accept: true } is sent", async () => {
      const res = await request(app)
        .put('/api/user/friend/acceptreject')
        .send({ userId: user1._id })
        .set('authorization', user2Token);

      const foundUser = await User.findById(user1._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundUser.friends.length).to.equal(0);
      expect(foundUser.friends.indexOf(user2._id)).to.equal(-1);
    });
  });

  /*****************************************************************************
  ******************************* .deleteFriend ********************************
  *****************************************************************************/
  describe('.deleteFriend', () => {
    let user2;
    let user2Token;

    beforeEach(async () => {
      const user3 = new User();

      user2 = new User({
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User2',
        friends: [user1, user3]
      });

      user1.friends = [user2, user3];
      await user1.save();
      await user2.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .put('/api/user/friend/delete');
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends an error if no user ID, or an invalid ID, is provided', async () => {
      const res1 = await request(app)
        .put('/api/user/friend/delete')
        .set('authorization', user1Token);

      const res2 = await request(app)
        .put('/api/user/friend/delete')
        .send({ userId: '12345' })
        .set('authorization', user1Token);

      expect(res1.status).to.equal(422);
      expect(res1.body.error).to.exist;
      expect(res1.body.error).to.equal('You must provide a valid user ID.');
      expect(res2.status).to.equal(422);
      expect(res2.body.error).to.exist;
      expect(res2.body.error).to.equal('You must provide a valid user ID.');
    });

    it('sends an error if the user ID provided is not in the "friends" array', async () => {
      const user4 = new User();

      const res = await request(app)
        .put('/api/user/friend/delete')
        .send({ userId: user4._id })
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('That user is not currently in your friends list.');
    });

    it("removes a user from both users' 'friends' arrays", async () => {
      const res = await request(app)
        .put('/api/user/friend/delete')
        .send({ userId: user2._id })
        .set('authorization', user1Token);

      const foundUser1 = await User.findById(user1._id);
      const foundUser2 = await User.findById(user2._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundUser1.friends.length).to.equal(1);
      expect(foundUser1.friends.indexOf(user2._id)).to.equal(-1);
      expect(foundUser2.friends.length).to.equal(1);
      expect(foundUser2.friends.indexOf(user1._id)).to.equal(-1);
    });
  });

  /*****************************************************************************
  ******************************* .getFriendsList ******************************
  *****************************************************************************/
  describe('.getFriendsList', () => {
    let user2;
    let user2Token;

    beforeEach(async () => {
      user2 = new User({
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User2',
        friends: [user1]
      });

      user1.friends = [user2];
      await user1.save();
      await user2.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .get('/api/user/friends');
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it("sends back an array of a user's friends", async () => {
      const res = await request(app)
        .get('/api/user/friends')
        .set('authorization', user1Token);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.friends).to.be.an('array');
      expect(res.body.success.friends.length).to.equal(1);
      expect(_.findIndex(res.body.success.friends, { '_id': user2._id.toString() })).to.not.equal(-1);
    });
  });

  /*****************************************************************************
  *************************** .getFriendRequestsList ***************************
  *****************************************************************************/
  describe('.getFriendRequestsList', () => {
    let user2;
    let user2Token;

    beforeEach(async () => {
      user2 = new User({
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User2',
        friendRequests: [user1]
      });

      user2Token = tokenForUser(user2);

      user1.friendRequestsSent = [user2];
      await user1.save();
      await user2.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .get('/api/user/friendrequests');
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it("sends back an array of a user's friend requests received", async () => {
      const res = await request(app)
        .get('/api/user/friendrequests')
        .set('authorization', user2Token);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.friendRequests).to.be.an('array');
      expect(res.body.success.friendRequests.length).to.equal(1);
      expect(_.findIndex(res.body.success.friendRequests, { '_id': user1._id.toString() })).to.not.equal(-1);
    });
  });

  /*****************************************************************************
  ******************************** .searchUsers ********************************
  *****************************************************************************/
  describe.only('.searchUsers', () => {
    let user2;
    let user2Token;

    beforeEach(async () => {
      user2 = new User({
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User2',
        displayNameLower: 'test user2',
      });

      await user2.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .get('/api/user/search/someuser');
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('returns an array following a user display name search', async () => {
      const res = await request(app)
        .get(`/api/user/search/${encodeURI('Test User1')}`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.users).to.be.an('array');
    });

    it('returns a user if any matches are found', async () => {
      const res = await request(app)
        .get(`/api/user/search/${encodeURI('Test User1')}`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.users).to.be.an('array');
      expect(res.body.success.users.length).to.equal(1);
      expect(_.findIndex(res.body.success.users, { '_id': user1._id.toString() })).to.not.equal(-1);
    });

    it('returns case insensitive search results', async () => {
      const res = await request(app)
        .get(`/api/user/search/${encodeURI('test user1')}`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.users).to.be.an('array');
      expect(res.body.success.users.length).to.equal(1);
      expect(_.findIndex(res.body.success.users, { '_id': user1._id.toString() })).to.not.equal(-1);
    });

    it('returns search results for partial display name matches', async () => {
      const res = await request(app)
        .get(`/api/user/search/${encodeURI('test')}`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.users).to.be.an('array');
      expect(res.body.success.users.length).to.equal(2);
      expect(_.findIndex(res.body.success.users, { '_id': user1._id.toString() })).to.not.equal(-1);
      expect(_.findIndex(res.body.success.users, { '_id': user2._id.toString() })).to.not.equal(-1);
    });
  });
});
