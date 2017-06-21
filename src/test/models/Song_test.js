import { expect } from 'chai';
import Song from '../../models/Song';
import User from '../../models/User';

describe('Song', () => {
  let song;
  let user;

  beforeEach(async () => {
    song = new Song({ youTubeUrl: 'https://www.youtube.com/watch?v=Kg8Rk5DDQlA' });

    try {
      await song.save();
    } catch (err) {
      console.log(err);
    }
  });

  it('creates a new song', async () => {
    const result = await Song.find({});
    expect(result.length).to.equal(1);
    expect(result[0]._id).to.eql(song._id);
  });

  it('add a date to the "dateAdded" field', async () => {
    const result = await Song.findById(song._id);
    expect(result).to.have.property('dateAdded');
    expect(result.dateAdded).to.be.a('date');
  });

  it('can add a user to the "likedByUsers" field', async () => {
    user = new User({ local: { username: 'testuser' }});
    song.likedByUsers.push(user);
    await user.save();
    await song.save();

    const result = await Song.findById(song._id).populate('likedByUsers');
    expect(result.likedByUsers.length).to.equal(1);
    expect(result.likedByUsers[0]._id).to.eql(user._id);
  });
});
