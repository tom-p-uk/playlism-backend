import { expect } from 'chai';
import app from '../../app';
import request from 'supertest';
import Playlist from '../../models/Playlist';
import User from '../../models/User';
import Song from '../../models/Song';
import tokenForUser from '../../utils/token';
import _ from 'lodash';

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

  /*****************************************************************************
  ******************************* .createPlaylist ******************************
  *****************************************************************************/
  describe('.createPlaylist', () => {
    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .post('/api/playlist');

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('creates a new playlist following a successful POST request', async () => {
      const res = await request(app)
        .post('/api/playlist')
        .send({ title: 'Test Playlist', forUser: user2 })
        .set('authorization', user1Token);

      const createdPlaylist = await Playlist.findOne({ title: 'Test Playlist' });
      expect(res.status).to.equal(201);
      expect(res.body.success).to.exist;
      expect(createdPlaylist).to.not.equal(undefined);
    });

    it('throws an error if the title is not provided', async () => {
      const res = await request(app)
        .post('/api/playlist')
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
        .post('/api/playlist')
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
        .post('/api/playlist')
        .send({ title: '123456789012345678901234567890123456789012345678901', forUser: user2 })
        .set('authorization', user1Token);

      const foundPlaylist = await Playlist.findOne({ title: '123456789012345678901234567890123456789012345678901' });

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('Playlist title must be no more than 30 characters long.');
      expect(foundPlaylist).to.equal(null);
    });

    it('throws an error if "forUser" data is not provided', async () => {
      const res = await request(app)
        .post('/api/playlist')
        .send({ title: 'Test Playlist' })
        .set('authorization', user1Token);

      const foundPlaylist = await Playlist.findOne({ title: 'Test Playlist' });

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('A recipient user must be provided.');
      expect(foundPlaylist).to.equal(null);
    });
  });

  /*****************************************************************************
  ******************************* .deletePlaylist ******************************
  *****************************************************************************/
  describe('.deletePlaylist', () => {
    let playlist;

    beforeEach(async () => {
      playlist = new Playlist({
        title: 'Test Playlist',
        byUser: user1,
        forUser: user2,
      });

      await playlist.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .delete(`/api/playlist/${playlist._id}`);

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends an error if an invalid playlist ID is provided', async () => {
      const res = await request(app)
        .delete(`/api/playlist/12345`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The playlist ID provided is invalid.');
    });

    it('sends an error if the playlist does not exist.', async () => {
      const playlist2 = new Playlist({ title: 'Test Playlist2' });
      const res = await request(app)
        .delete(`/api/playlist/${playlist2._id}`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The playlist specified does not exist.');
    });

    it('sends an error message if a user tries to delete a playlist that is not theirs', async () => {
      const user3 = new User({
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User3',
      });

      const user3Token = tokenForUser(user3);

      await user3.save();

      const res = await request(app)
        .delete(`/api/playlist/${playlist._id}`)
        .set('authorization', user3Token);

      expect(res.status).to.equal(401);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal("You don't have permission to delete this playlist.");
    });

    it('allows the "byUser" to delete a playlist', async () => {
      const res = await request(app)
        .delete(`/api/playlist/${playlist._id}`)
        .set('authorization', user1Token);

      const deletedPlaylist = await Playlist.findById(playlist._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.playlist._id).to.equal(playlist._id.toString());
      expect(deletedPlaylist).to.equal(null);
    });

    it('allows the "forUser" to delete a playlist', async () => {
      const res = await request(app)
        .delete(`/api/playlist/${playlist._id}`)
        .set('authorization', user2Token);

      const deletedPlaylist = await Playlist.findById(playlist._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.playlist._id).to.equal(playlist._id.toString());
      expect(deletedPlaylist).to.equal(null);
    });
  });

  /*****************************************************************************
  ***************************** .editPlaylistTitle *****************************
  *****************************************************************************/
  describe('.editPlaylistTitle', () => {
    let playlist;

    beforeEach(async () => {
      playlist = new Playlist({
        title: 'Test Playlist',
        byUser: user1,
        forUser: user2,
      });

      await playlist.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .put(`/api/playlist/title/${playlist._id}`);

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends an error if an invalid playlist ID is provided', async () => {
      const res = await request(app)
        .put(`/api/playlist/title/12345`)
        .send({ title: 'New Title' })
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The playlist ID provided is invalid.');
    });

    it('sends an error if the playlist does not exist.', async () => {
      const playlist2 = new Playlist({ title: 'Test Playlist2' });
      const res = await request(app)
        .put(`/api/playlist/title/${playlist2._id}`)
        .send({ title: 'New Title' })
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The playlist specified does not exist.');
    });

    it('sends an error message if a user tries to edit a playlist that is not theirs', async () => {
      const user3 = new User({
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User3',
      });

      const user3Token = tokenForUser(user3);

      await user3.save();

      const res = await request(app)
        .put(`/api/playlist/title/${playlist._id}`)
        .set('authorization', user3Token);

      expect(res.status).to.equal(401);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal("You don't have permission to edit this playlist.");
    });

    it('allows the "byUser" to edit a playlist title', async () => {
      const res = await request(app)
        .put(`/api/playlist/title/${playlist._id}`)
        .send({ title: 'New Title' })
        .set('authorization', user1Token);

      const editedPlaylist = await Playlist.findById(playlist._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.playlist._id).to.equal(playlist._id.toString());
      expect(editedPlaylist.title).to.equal('New Title');
    });

    it('allows the "forUser" to edit a playlist title', async () => {
      const res = await request(app)
        .put(`/api/playlist/title/${playlist._id}`)
        .send({ title: 'New Title' })
        .set('authorization', user2Token);

      const editedPlaylist = await Playlist.findById(playlist._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.playlist._id).to.equal(playlist._id.toString());
      expect(editedPlaylist.title).to.equal('New Title');
    });
  });

  /*****************************************************************************
  **************************** .updateLastSongPlayed ***************************
  *****************************************************************************/
  describe('.updateLastSongPlayed', () => {
    let playlist;
    let song;

    beforeEach(async () => {
      playlist = new Playlist({
        title: 'Test Playlist',
        byUser: user1,
        forUser: user2,
      });

      song =  new Song({ youTubeUrl: 'https://www.youtube.com/watch?v=wFSvUMxDWak' });

      await playlist.save();
      await song.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .put(`/api/playlist/lastsongplayed/${playlist._id}`);

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends an error if an invalid playlist ID is provided', async () => {
      const res = await request(app)
        .put(`/api/playlist/lastsongplayed/12345`)
        .send({ songId: song._id })
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The playlist ID provided is invalid.');
    });

    it('sends an error if the playlist does not exist.', async () => {
      const playlist2 = new Playlist({ title: 'Test Playlist2' });
      const res = await request(app)
        .put(`/api/playlist/lastsongplayed/${playlist2._id}`)
        .send({ songId: song._id })
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The playlist specified does not exist.');
    });

    it('sends an error message if a user tries to edit a playlist that is not theirs', async () => {
      const user3 = new User({
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User3',
      });

      const user3Token = tokenForUser(user3);

      await user3.save();

      const res = await request(app)
        .put(`/api/playlist/lastsongplayed/${playlist._id}`)
        .send({ songId: song._id })
        .set('authorization', user3Token);

      expect(res.status).to.equal(401);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal("You don't have permission to update this playlist.");
    });

    it('sends an error if an invalid song ID is provided', async () => {
      const res = await request(app)
        .put(`/api/playlist/lastsongplayed/${playlist._id}`)
        .send({ songId: 'A24fadsf' })
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The song ID provided is invalid.');
    });

    it('sends an error if the song does not exist.', async () => {
      const song2 = new Playlist({ youTubeUrl: 'https://www.youtube.com/watch?v=RUJMqVkSMh4' });
      const res = await request(app)
        .put(`/api/playlist/lastsongplayed/${playlist._id}`)
        .send({ songId: song2._id })
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The song specified does not exist.');
    });

    it("successfully updates a playlist's 'lastSongPlayed' field", async () => {
      const res = await request(app)
        .put(`/api/playlist/lastsongplayed/${playlist._id}`)
        .send({ songId: song._id })
        .set('authorization', user1Token);

      const foundPlaylist = await Playlist.findById(playlist._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.playlist.ok).to.equal(1);
      expect(song._id.equals(foundPlaylist.lastSongPlayed)).to.equal(true);
    });
  });

  /*****************************************************************************
  **************************** .fetchForUserPlaylists **************************
  *****************************************************************************/
  describe('.fetchForUserPlaylists', () => {
    let playlist1, playlist2, playlist3;

    beforeEach(async () => {
      playlist1 = new Playlist({
        title: 'Playlist1',
        forUser: user1,
        byUser: user2,
      });

      playlist2 = new Playlist({
        title: 'Playlist2',
        forUser: user1,
        byUser: user2,
      });

      playlist3 = new Playlist({
        title: 'Playlist3',
        forUser: user2,
        byUser: user1,
      });

      await playlist1.save();
      await playlist2.save();
      await playlist3.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .get('/api/playlist/foruser/');

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('returns an array of playlists folllowing a successful GET request', async () => {
      const res = await request(app)
        .get('/api/playlist/foruser/')
        .set('authorization', user1Token);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.playlists.length).to.equal(2);
      expect(_.findIndex(res.body.success.playlists, { _id: playlist1._id.toString() })).to.not.equal(-1);
      expect(_.findIndex(res.body.success.playlists, { _id: playlist2._id.toString() })).to.not.equal(-1);
      expect(_.findIndex(res.body.success.playlists, { _id: playlist3._id.toString() })).to.equal(-1);
    });
  });

  /*****************************************************************************
  **************************** .fetchByUserPlaylists ***************************
  *****************************************************************************/
  describe('.fetchByUserPlaylists', () => {
    let playlist1, playlist2, playlist3;

    beforeEach(async () => {
      playlist1 = new Playlist({
        title: 'Playlist1',
        forUser: user1,
        byUser: user2,
      });

      playlist2 = new Playlist({
        title: 'Playlist2',
        forUser: user1,
        byUser: user2,
      });

      playlist3 = new Playlist({
        title: 'Playlist3',
        forUser: user2,
        byUser: user1,
      });

      await playlist1.save();
      await playlist2.save();
      await playlist3.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .get('/api/playlist/byuser');

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('returns an array of playlists folllowing a successful GET request', async () => {
      const res = await request(app)
        .get('/api/playlist/byuser')
        .set('authorization', user1Token);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(res.body.success.playlists.length).to.equal(1);
      expect(_.findIndex(res.body.success.playlists, { _id: playlist1._id.toString() })).to.equal(-1);
      expect(_.findIndex(res.body.success.playlists, { _id: playlist2._id.toString() })).to.equal(-1);
      expect(_.findIndex(res.body.success.playlists, { _id: playlist3._id.toString() })).to.not.equal(-1);
    });
  });
});
