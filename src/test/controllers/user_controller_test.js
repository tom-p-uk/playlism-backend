import { expect } from 'chai';
import app from '../../app';
import request from 'supertest';
import User from '../../models/User';
import tokenForUser from '../../services/token';

describe.only('userController', () => {
  let user;
  let userToken;

  beforeEach(async () => {
    user = new User({
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User',
      profileImg: 'http://www.somesite.com/someimg.png',
    });

    userToken = tokenForUser(user);
    await user.save();
  });

  describe('.fetchUser', () => {
    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .get('/user');

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('responds with user info following a successful request', async () => {
      const res = await request(app)
        .get('/user')
        .set('authorization', userToken);

      const { _id, firstName, lastName, displayName } = res.body.user;
      expect(res.status).to.equal(200);
      expect(_id).to.equal(user._id.toString());
      expect(firstName).to.equal(user.firstName);
      expect(lastName).to.equal(user.lastName);
      expect(displayName).to.equal(user.displayName);
    });
  });

  describe('.editDisplayName', () => {
    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .put('/user/displayname');

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('allows a user to edit their display name', async () => {
      const res = await request(app)
        .put('/user/displayname')
        .send({ displayName: 'Display Name' })
        .set('authorization', userToken);

      const updatedUser = await User.findById(user._id);
      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(updatedUser.displayName).to.equal('Display Name');
    });

    it('throws an error if the proposed display name is too short', async () => {
      const res = await request(app)
        .put('/user/displayname')
        .send({ displayName: '' })
        .set('authorization', userToken);

      const foundUser = await User.findById(user._id);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('Display name must be at least 4 characters long.');
      expect(foundUser.displayName).to.equal('Test User');
    });

    it('throws an error if the proposed display name is too long', async () => {
      const res = await request(app)
        .put('/user/displayname')
        .send({ displayName: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901' })
        .set('authorization', userToken);

      const foundUser = await User.findById(user._id);

      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('Display name must less than 100 characters long.');
      expect(foundUser.displayName).to.equal('Test User');
    });
  });

  describe('.editProfileImg', () => {
    it('can only be accessed by passing a valid JWT', async () => {
      const res = await request(app)
        .put('/user/profileimg');
      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Unauthorized');
    });

    it('allows a user to edit their display name', async () => {
      const res = await request(app)
        .put('/user/profileimg')
        .send({ profileImg: 'http://www.somesite.com/someotherimg.png' })
        .set('authorization', userToken);

      const updatedUser = await User.findById(user._id);
      expect(res.status).to.equal(200);
      expect(res.body.success).to.exist;
      expect(updatedUser.profileImg).to.equal('http://www.somesite.com/someotherimg.png');
    });

    it('sends an error message if an invalid URL is passed', async () => {
      const res = await request(app)
        .put('/user/profileimg')
        .send({ profileImg: '' })
        .set('authorization', userToken);

      const updatedUser = await User.findById(user._id);
      expect(res.status).to.equal(422);
      expect(res.body.error).to.exist;
      expect(res.body.error).to.equal('You must provide a valid URL.');
    });
  });
});
