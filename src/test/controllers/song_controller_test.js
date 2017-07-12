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

  /*****************************************************************************
  ********************************** .addsong **********************************
  *****************************************************************************/
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

  /*****************************************************************************
  *************************** .deleteSongFromPlaylist **************************
  *****************************************************************************/
  describe('.deleteSongFromPlaylist', () => {
    let song;

    beforeEach(async () => {
      song = new Song({
        youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
        inPlaylists: [playlist1._id, playlist2._id]
      });
      await song.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .delete(`/song/${playlist1._id}/${song._id}`);

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends an error if an invalid song ID is provided', async () => {
      const res = await request(app)
        .delete(`/song/${playlist1._id}/12345`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The song ID provided is invalid.');
    });

    it('sends an error if the song does not exist', async () => {
      const song2 = new Song({ youTubeUrl: 'https://www.youtube.com/watch?v=RUJMqVkSMh4' });
      const res = await request(app)
        .delete(`/song/${playlist1._id}/${song2._id}`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The song specified does not exist.');
    });

    it('sends an error if an invalid playlist ID is provided', async () => {
      const res = await request(app)
        .delete(`/song/12345/${song._id}`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The playlist ID provided is invalid.');
    });

    it('sends an error if the playlist does not exist.', async () => {
      const playlist3 = new Playlist({ title: 'Test Playlist3' });
      const res = await request(app)
        .delete(`/song/${playlist3._id}/${song._id}`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The playlist specified does not exist.');
    });

    it("removes a playlist from a song's 'inPlaylists' array", async () => {
      const res = await request(app)
        .delete(`/song/${playlist1._id}/${song._id}`)
        .set('authorization', user1Token);

      const foundSong = await Song.findById(song._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundSong.inPlaylists.length).to.equal(1);
      expect(foundSong.inPlaylists.indexOf(playlist1._id)).to.equal(-1);
    });

    it('removes a song altogether if it no longer has any associated playlists', async () => {
      const song2 = new Song({ youTubeUrl: 'https://www.youtube.com/watch?v=RUJMqVkSMh4', inPlaylists: [playlist1._id] });
      await song2.save();

      const res = await request(app)
        .delete(`/song/${playlist1._id}/${song2._id}`)
        .set('authorization', user1Token);

      const foundSong = await Song.findById(song2._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundSong).to.equal(null);
    });
  });

  /*****************************************************************************
  **************************** .fetchSongsInPlaylist ***************************
  *****************************************************************************/
  describe('.fetchSongsInPlaylist', () => {
    let song1, song2;

    beforeEach(async () => {
      song1 = new Song({
        youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
        inPlaylists: [playlist1._id, playlist2._id]
      });

      song2 = new Song({
        youTubeUrl: 'https://www.youtube.com/watch?v=YsB8t0B4jx4',
        inPlaylists: [playlist1._id]
      });

      await song1.save();
      await song2.save();
    });

    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .get(`/song/playlist/${playlist1._id}`);

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends an error if an invalid playlist ID is provided', async () => {
      const res = await request(app)
        .get(`/song/playlist/12345`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The playlist ID provided is invalid.');
    });

    it('sends an error if the playlist does not exist', async () => {
      const playlist3 = new Playlist({ title: 'Test Playlist3' });
      const res = await request(app)
        .get(`/song/playlist/${playlist3._id}`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The playlist specified does not exist.');
    });

    it('sends an error if the user is not is not the "forUser" or "byUser" in the playlist', async () => {
      const user3 = new User({
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User3'
      });

      const user3Token = tokenForUser(user3);
      await user3.save();

      const res = await request(app)
        .get(`/song/playlist/${playlist1._id}`)
        .set('authorization', user3Token);

        expect(res.status).to.equal(401);
        expect(res.body.error).to.exist;
        expect(res.body.error).to.equal("You don't have permission to access this playlist.");
    });

    it('fetches a list of songs that match the provided playlist', async () => {
      const res1 = await request(app)
        .get(`/song/playlist/${playlist1._id}`)
        .set('authorization', user1Token);

      const res2 = await request(app)
        .get(`/song/playlist/${playlist2._id}`)
        .set('authorization', user1Token);

      expect(res1.status).to.equal(200);
      expect(res1.body.success).to.exist;
      expect(res1.body.success).to.exist;
      expect(res1.body.success.length).to.equal(2);
      expect(res2.status).to.equal(200);
      expect(res2.body.success).to.exist;
      expect(res2.body.success).to.exist;
      expect(res2.body.success.length).to.equal(1);
    });
  });

  /*****************************************************************************
  ******************************* .fetchlikedSongs *****************************
  *****************************************************************************/
  describe('.fetchlikedSongs', () => {
    let song1, song2, song3, song4;

    beforeEach(async () => {
      song1 = new Song({
        youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
        inPlaylists: [playlist1._id, playlist2._id],
        likedByUsers: [user1._id]
      });

      song2 = new Song({
        youTubeUrl: 'https://www.youtube.com/watch?v=YsB8t0B4jx4',
        inPlaylists: [playlist1._id],
        likedByUsers: [user2._id]
      });

      song3 = new Song({
        youTubeUrl: 'https://www.youtube.com/watch?v=YgB8t0B4jx4',
        inPlaylists: [playlist1._id],
        likedByUsers: [user1._id, user2._id]
      });

      song4 = new Song({
        youTubeUrl: 'https://www.youtube.com/watch?v=YzB8t0B4jx4',
        inPlaylists: [playlist1._id],
        likedByUsers: [user1._id]
      });

      await song1.save();
      await song2.save();
      await song3.save();
      await song4.save();
    });

    it('can only  be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .get('/song');

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends a list of songs liked by the user', async () => {
      const res1 = await request(app)
        .get('/song')
        .set('authorization', user1Token);

        const res2 = await request(app)
          .get('/song')
          .set('authorization', user2Token);

      expect(res1.status).to.equal(200);
      expect(res1.body.success).to.exist;
      expect(res1.body.success.length).to.equal(3);
      expect(res2.status).to.equal(200);
      expect(res2.body.success).to.exist;
      expect(res2.body.success.length).to.equal(2);
    });
  });

  /*****************************************************************************
  ********************************** .likesong *********************************
  *****************************************************************************/
  describe('.likeSong', () => {
    let song;

    beforeEach(async () => {
      song = new Song({
        youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
        inPlaylists: [playlist1._id],
      });

      await song.save();
    });

    it('can only  be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .put(`/song/like/${song._id}`);

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends an error if an invalid song ID is provided', async () => {
      const res = await request(app)
        .put(`/song/like/12345`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The song ID provided is invalid.');
    });

    it('sends an error if the song does not exist', async () => {
      const song2 = new Song({
        youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
        inPlaylists: [playlist1._id],
      });

      const res = await request(app)
        .put(`/song/like/${song2._id}`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The song specified does not exist.');
    });

    it("adds a user to a song's 'likedByUsers' array", async () => {
      const res = await request(app)
      .put(`/song/like/${song._id}`)
      .set('authorization', user1Token);

      const foundSong = await Song.findById(song._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundSong.likedByUsers.length).to.equal(1);
      expect(foundSong.likedByUsers[0].equals(user1._id)).to.equal(true);
    });
  });

  /*****************************************************************************
  ********************************* .unlikesong ********************************
  *****************************************************************************/
  describe('.unlikeSong', () => {
    let song;

    beforeEach(async () => {
      song = new Song({
        youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
        inPlaylists: [playlist1._id],
        likedByUsers: [user1._id, user2._id]
      });

      await song.save();
    });

    it('can only  be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .put(`/song/unlike/${song._id}`);

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('sends an error if an invalid song ID is provided', async () => {
      const res = await request(app)
        .put(`/song/unlike/12345`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The song ID provided is invalid.');
    });

    it('sends an error if the song does not exist', async () => {
      const song2 = new Song({
        youTubeUrl: 'https://www.youtube.com/watch?v=YoB8t0B4jx4',
        inPlaylists: [playlist1._id, playlist2._id],
      });

      const res = await request(app)
        .put(`/song/unlike/${song2._id}`)
        .set('authorization', user1Token);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('The song specified does not exist.');
    });

    it("removes a user from a song's 'likedByUsers' array", async () => {
      const res = await request(app)
        .put(`/song/unlike/${song._id}`)
        .set('authorization', user1Token);

      const foundSong = await Song.findById(song._id);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(foundSong.likedByUsers.length).to.equal(1);
      expect(foundSong.likedByUsers.indexOf(user1._id)).to.equal(-1);
      expect(foundSong.likedByUsers.indexOf(user2._id)).to.not.equal(-1);
    });
  });
});
