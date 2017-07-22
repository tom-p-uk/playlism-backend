import validatePlaylist from '../../utils/validate_playlist';
import { expect } from 'chai';
import Playlist from '../../models/Playlist';
import User from '../../models/User';

describe('validatePlaylist', () => {
  let playlist;
  let user1, user2;

  beforeEach(async () => {
    user1 = new User({
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User1'
    });

    user2 = new User({
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User2'
    });

    playlist = new Playlist({
      title: 'Test Playlist',
      forUser: user1,
      byUser: user2
    });

    await user1.save();
    await user2.save();
    await playlist.save();
  });

  it('returns an object containing status and error props if an invalid playlistId is provided', async () => {
    const result = await validatePlaylist('12345', user1, 'access');

    expect(result.status).to.exist;
    expect(result.error).to.exist;
    expect(result.status).to.equal(422);
    expect(result.error).to.equal('The playlist ID provided is invalid.');
  });

  it('returns an object containing status and error props if the playlistId provided does not exist', async () => {
    const playlist2 = new Playlist({});

    const result = await validatePlaylist(playlist2._id, user1, 'access');

    expect(result.status).to.exist;
    expect(result.error).to.exist;
    expect(result.status).to.equal(422);
    expect(result.error).to.equal('The playlist specified does not exist.');
  });

  it('returns an object containing status and error props if the user provided is not the forUser or byUser', async () => {
    const user3 = new User({});

    const result = await validatePlaylist(playlist._id, user3, 'access');

    expect(result.status).to.exist;
    expect(result.error).to.exist;
    expect(result.status).to.equal(401);
    expect(result.error).to.equal("You don't have permission to access this playlist.");
  });

  it('returns a Playlist object', async () => {
    const result = await validatePlaylist(playlist._id, user1, 'access');

    expect(result.title).to.equal('Test Playlist');
    expect(result._id.equals(playlist._id)).to.equal(true);
    expect(result.forUser.equals(user1._id)).to.equal(true);
    expect(result.byUser.equals(user2._id)).to.equal(true);
  });
});
