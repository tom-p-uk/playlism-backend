import Song from '../../models/Song';
import User from '../../models/User';
import Playlist from '../../models/Playlist';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import tokenForUser from '../../services/token';

describe('songController', () => {
  let user1, user2;
  let user1Token, user2Token;
  let playlist1, playlist2;

  beforeEach(async () => {
    user1 = new User({
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User1',
    });

    user2 = new User({
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User2',
    });

    playlist1 = new Playlist({
      title: 'Test Playlist1',
      byUser: user1,
      forUser: user2,
    });

    playlist2 = new Playlist({
      title: 'Test Playlist2',
      byUser: user2,
      forUser: user1,
    });

    user1Token = tokenForUser(user1);
    user2Token = tokenForUser(user2);

    await user1.save();
    await user2.save();
    await playlist1.save();
    await playlist2.save();
  });

  describe('.addSong', () => {
    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .post('/song');

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends an error if a youTubeUrl is not provided', async () => {
      const res = await request(app)
        .post('/song')
        .set('authorization', user1Token);

      const foundSongs = await Song.find({});

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('A YouTube URL must be provided.');
      expect(foundSongs.length).to.equal(0);
    });

    it('sends an error if an invalid youTubeUrl is provided', async () => {
      const res = await request(app)
        .post('/song')
        .send({ youTubeUrl: 'https://www.youtube.com/YoB8t0B4jx4'})
        .set('authorization', user1Token);

      const foundSongs = await Song.find({});

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The YouTube URL provided is invalid.');
      expect(foundSongs.length).to.equal(0);
    });

    it('sends an error if a playlistId is not provided', async () => {
      const res = await request(app)
        .post('/song')
        .send({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4' })
        .set('authorization', user1Token);

      const foundSongs = await Song.find({});

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('A playlist ID must be provided.');
      expect(foundSongs.length).to.equal(0);
    });

    it('sends an error if the playlistId provided is invalid', async () => {
      const res = await request(app)
        .post('/song')
        .send({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4', playlistId: 'abc' })
        .set('authorization', user1Token);

      const foundSongs = await Song.find({});

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The playlist ID provided is invalid.');
      expect(foundSongs.length).to.equal(0);
    });

    it('adds a song following a successful POST request', async () => {
      const res = await request(app)
        .post('/song')
        .send({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4', playlistId: playlist1._id })
        .set('authorization', user1Token);

      const foundSongs = await Song.find({}).populate('inPlaylists');

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.youTubeUrl).to.equal('https://www.youtube.com/watch?v=YoB8t0B4jx4');
      expect(foundSongs.length).to.equal(1);
    });



    it("sends an error if the provided playlist already exists in a song's 'inPlaylists' array", async () => {
      const song = new Song({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4', inPlaylists: [playlist1._id] });
      await song.save();

      const res = await request(app)
        .post('/song')
        .send({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4', playlistId: playlist1._id })
        .set('authorization', user1Token);

      const foundSongs = await Song.find({});

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('That song has already been added to the playlist.' );
      expect(foundSongs.length).to.equal(1);
    });

    it("adds a playlist to a song's 'inPlaylists' arr if song already exists", async () => {
      const song = new Song({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4', inPlaylists: [playlist1._id] });
      await song.save();

      const res = await request(app)
        .post('/song')
        .send({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4', playlistId: playlist2._id })
        .set('authorization', user1Token);

      const foundSong = await Song.findOne({ youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4' });
      console.log(playlist1._id);
      console.log(playlist2._id);
      console.log(foundSong.inPlaylists);
      console.log(res.body.success.inPlaylists);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.youTubeUrl).to.equal('https://www.youtube.com/watch?v=YoB8t0B4jx4');
      expect(res.body.success.inPlaylists.length).to.equal(2);
      expect(foundSong.inPlaylists.indexOf(playlist1._id)).to.not.equal(-1);
      expect(foundSong.inPlaylists.indexOf(playlist2._id)).to.not.equal(-1);
    });
  });
});
