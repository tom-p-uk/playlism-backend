import { expect } from 'chai';
import app from '../../app';
import request from 'supertest';
import Playlist from '../../models/Playlist';
import User from '../../models/User';
import tokenForUser from '../../services/token';

describe('playlistController', () => {
  let user1, user1Token;
  let user2, user2Token;

  beforeEach(async () => {
    user1 = new User({
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User 1',
      profileImg: 'http://www.somesite.com/someimg.png',
    });

    user2 = new User({
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User 2',
      profileImg: 'http://www.somesite.com/someimg.png',
    });

    user1Token = tokenForUser(user1);
    user2Token = tokenForUser(user2);
    await user1.save();
    await user2.save();
  });

  describe.only('.createPlaylist', () => {
    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .post('/playlist');

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('creates a new playlist following a successful POST request', async () => {
      const res = await request(app)
        .post('/playlist')
        .send({ title: 'Test Playlist', forUser: user2 })
        .set('authorization', user1Token);

      const createdPlaylist = await Playlist.findOne({ title: 'Test Playlist' });
      expect(res.status).to.equal(201);
      expect(res.body.success).to.exist;
      expect(createdPlaylist).to.not.equal(undefined);
    });

    it('throws an error if the title is not provided', async () => {
      const res = await request(app)
        .post('/playlist')
        .send({ forUser: user2 })
        .set('authorization', user1Token);

      const foundPlaylist = await Playlist.findOne({ title: 'A' });

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('Playlist title must be provided.');
      expect(foundPlaylist).to.equal(null);
    });

    it('throws an error if the title provided is too short', async () => {
      const res = await request(app)
        .post('/playlist')
        .send({ title: 'A', forUser: user2 })
        .set('authorization', user1Token);

      const foundPlaylist = await Playlist.findOne({ title: 'A' });

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('Playlist title must be at least 4 characters long.');
      expect(foundPlaylist).to.equal(null);
    });

    it('throws an error if the title provided is too long', async () => {
      const res = await request(app)
        .post('/playlist')
        .send({ title: '123456789012345678901234567890123456789012345678901', forUser: user2 })
        .set('authorization', user1Token);

      const foundPlaylist = await Playlist.findOne({ title: '123456789012345678901234567890123456789012345678901' });

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('Playlist title must no more than 50 characters long.');
      expect(foundPlaylist).to.equal(null);
    });

    it.only('throws an error if "forUser" data is not provided', async () => {
      const res = await request(app)
        .post('/playlist')
        .send({ title: 'Test Playlist' })
        .set('authorization', user1Token);

      const foundPlaylist = await Playlist.findOne({ title: 'Test Playlist' });

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('A recipient user must be provided.');
      expect(foundPlaylist).to.equal(null);
    });
  });
});
