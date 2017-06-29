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

  it('shows a list of users in the "friends" and friendRequests" fields', async () => {
    const friend1 = new User({ displayName: 'Friend1' });
    const friend2 = new User({ displayName: 'Friend2' });
    await friend1.save();
    await friend2.save();

    user.friends.push(friend1);
    user.friendRequests.push(friend2);
    await user.save();

    const result = await User.findById(user._id).populate('friends').populate('friendRequests');
    expect(result.friends[0]._id).to.eql(friend1._id);
    expect(result.friendRequests[0]._id).to.eql(friend2._id);
  });

  it('adds a date to the "dateJoined" field', async () => {
    const result = await User.findById(user._id);
    expect(result).to.have.property('dateJoined');
    expect(result.dateJoined).to.be.a('date');
  });
});
