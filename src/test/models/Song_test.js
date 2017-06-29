import { expect } from 'chai';
import Song from '../../models/Song';
import User from '../../models/User';
import Playlist from '../../models/Playlist';

describe('Song', () => {
  let song;
  let user1;
  let user2;
  let playlist;

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

  it('adds a date to the "dateAdded" field', async () => {
    const result = await Song.findById(song._id);
    console.log(result);
    expect(result).to.have.property('dateAdded');
    expect(result.dateAdded).to.be.a('date');
  });

  it('can add a user to the "likedByUsers" field', async () => {
    user1 = new User({ displayName: 'Test User' });
    song.likedByUsers.push(user1);
    await user1.save();
    await song.save();

    const result = await Song.findById(song._id).populate('likedByUsers');
    expect(result.likedByUsers.length).to.equal(1);
    expect(result.likedByUsers[0]._id).to.eql(user1._id);
  });

  it('can add a playlist to the "playlist" field', async () => {
    user1 = new User({ displayName: 'Test User1' });
    user2 = new User({ displayName: 'Test User2' });
    playlist = new Playlist({ title: 'Test Playlist', byUser: user1, forUser: user2 });
    song.playlist = playlist;
    await user1.save();
    await user2.save();
    await playlist.save();
    await song.save();

    const result = await Song.findById(song._id);
    expect(result.playlist.equals(playlist._id)).to.equal(true);
  });
});
