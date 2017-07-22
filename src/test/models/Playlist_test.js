import { expect } from 'chai';
import Playlist from '../../models/Playlist';
import User from '../../models/User';
import Song from '../../models/Song';

describe('Playlist', () => {
  let playlist;
  let user1;
  let user2;
  let song1;
  let song2;

  beforeEach(async () => {
    user1 = new User({});
    user2 = new User({});
    song1 = new Song({ youTubeUrl: 'https://www.youtube.com/watch?v=Kg8Rk5DDQlA' });
    song2 = new Song({ youTubeUrl: 'https://www.youtube.com/watch?v=Kg8Rk5DDQlA' });

    playlist = new Playlist({
      title: 'testPlaylist',
      forUser: user1,
      byUser: user2,
      songs: [song1, song2],
      lastSongPlayed: song1,
      lastUpdated: Date.now(),
    });

    try {
      await user1.save();
      await user2.save();
      await song1.save();
      await song2.save();
      await playlist.save();
    } catch (err) {
      console.log(err);
    }
  });

  it('creates a new playlist', async () => {
    const result = await Playlist.find({});
    expect(result.length).to.equal(1);
    expect(result[0]._id).to.eql(playlist._id);
  });

  it('creates a playlist with a "title" property', async () => {
    const result = await Playlist.findById(playlist._id);
    expect(result).to.have.property('title');
    expect(result.title).to.equal('testPlaylist');
  });

  it('creates a playlist with a "dateAdded" property', async () => {
    const result = await Playlist.findById(playlist._id);
    expect(result).to.have.property('dateAdded');
    expect(result.dateAdded).to.be.a('date');
  });

  it('creates a playlist with a "forUser" property', async () => {
    const result = await Playlist.findById(playlist._id).populate('forUser');
    expect(result).to.have.property('forUser');
    expect(result.forUser._id).to.eql(user1._id);
  });

  it('creates a playlist with a "byUser" property', async () => {
    const result = await Playlist.findById(playlist._id).populate('byUser');
    expect(result).to.have.property('byUser');
    expect(result.byUser._id).to.eql(user2._id);
  });

  it('creates a playlist with a "lastSongPlayed" property', async () => {
    const result = await Playlist.findById(playlist._id).populate('lastSongPlayed');
    expect(result).to.have.property('lastSongPlayed');
    expect(result.lastSongPlayed._id).to.eql(song1._id);
  });

  it('creates a playlist with a "lastUpdated" property', async () => {
    const result = await Playlist.findById(playlist._id);
    expect(result).to.have.property('lastUpdated');
    expect(result.lastUpdated).to.be.a('date');
  });

});
