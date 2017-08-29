import { expect } from 'chai';
import User from '../../models/User';

describe('User', () => {
  let user;

  beforeEach(async () => {
    user = new User({ displayName: 'Test User' });

    try {
      await user.save();
    } catch (err) {
      console.log(err);
    }
  });

  it('creates a new user', async () => {
    const result = await User.find({});
    expect(result.length).to.equal(1);
    expect(result[0]._id).to.eql(user._id);
  });

  it('creates a new user with all the required fields', async () => {
    const user2 = new User({
      firstName: 'a',
      lastName: 'a',
      displayName: 'abcd',
      googleId: 'a',
      facebookId: 'a',
      profileImg: 'a',
      friends: [{
        friendsSince: Date.now(),
        user: user._id,
      }],
      friendRequests: [],
      friendRequestsSent: [],
      lastLogin: Date.now(),
      pushToken: 'a',
      displayNameLower: 'a',
    });

    const result = await user2.save();
    expect(result).to.have.property('firstName');
    expect(result).to.have.property('lastName');
    expect(result).to.have.property('displayName');
    expect(result).to.have.property('googleId');
    expect(result).to.have.property('facebookId');
    expect(result).to.have.property('profileImg');
    expect(result).to.have.property('friends');
    expect(result).to.have.property('friendRequests');
    expect(result).to.have.property('friendRequestsSent');
    expect(result).to.have.property('lastLogin');
    expect(result).to.have.property('pushToken');
    expect(result).to.have.property('displayNameLower');
  });

  it('shows a list of users in the "friends", "friendRequests" and "friendRequestsSent" fields', async () => {
    const friend1 = new User({ displayName: 'Friend1' });
    const friend2 = new User({ displayName: 'Friend2' });
    const friend3 = new User({ displayName: 'Friend3' });
    await friend1.save();
    await friend2.save();

    user.friends.push({ user: friend1, friendsSince: Date.now() });
    user.friendRequests.push({ user: friend2, dateReceived: Date.now() });
    user.friendRequestsSent.push({ user: friend3, dateSent: Date.now() });
    await user.save();

    const result = await User.findById(user._id)
      .populate('friends')
      .populate('friendRequests')
      .populate('friendRequestsSent');

    expect(result.friends[0].user).to.eql(friend1._id);
    expect(result.friendRequests[0].user).to.eql(friend2._id);
    expect(result.friendRequestsSent[0].user).to.eql(friend3._id);
  });

  it('adds a date to the "dateJoined" field', async () => {
    const result = await User.findById(user._id);
    expect(result).to.have.property('dateJoined');
    expect(result.dateJoined).to.be.a('date');
  });
});
