import validateSong from '../../helpers/validate_song';
import { expect } from 'chai';
import Song from '../../models/Song';
import User from '../../models/User';

describe('validateSong', () => {
  let user;
  let song;

  beforeEach(async () => {
    user = new User({
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User1'
    });

    song = new Song({ youTubeUrl: 'https://www.youtube.com/watch?v=RUJMqVkSMh4' });

    await user.save();
    await song.save();
  });

  it('returns an object containing status and error props if an invalid songId is provided', async () => {
    const result = await validateSong('12345', user);

    expect(result.status).to.exist;
    expect(result.error).to.exist;
    expect(result.status).to.equal(422);
    expect(result.error).to.equal('The song ID provided is invalid.');
  });

  it('returns an object containing status and error props if the songId provided does not exist', async () => {
    const song2 = new Song({});

    const result = await validateSong(song2._id, user);

    expect(result.status).to.exist;
    expect(result.error).to.exist;
    expect(result.status).to.equal(422);
    expect(result.error).to.equal('The song specified does not exist.');
  });

  it('returns a Song object', async () => {
    const result = await validateSong(song._id, user);

    expect(result.youTubeUrl).to.equal('https://www.youtube.com/watch?v=RUJMqVkSMh4');
    expect(result._id.equals(song._id)).to.equal(true);
  });
});
