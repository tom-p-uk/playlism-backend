// import { expect } from 'chai';
// import app from '../../app';
// import request from 'supertest';
// import User from '../../models/User';
// import tokenForUser from '../../services/token';
//
// describe('userController', () => {
//   let userToken;
//
//   beforeEach((done) => {
//     const user = new User({
//       local: {
//         username: 'testuser1',
//         password: 'testpw1'
//       }
//     });
//
//    userToken = tokenForUser(user);
//
//     user.save()
//       .then(() => done())
//       .catch(err => done(err));
//   });
//
//   describe('.signUp', () => {
//     it('creates a new user following a POST request to /api/auth/signup', async () => {
//       const res = await request(app)
//         .post('/api/auth/signup')
//         .send({ username: 'testuser2', password: 'testpw2' });
//
//       const user = await User.findOne({ 'local.username': 'testuser2' });
//       expect(user).to.exist;
//       expect(res.status).to.equal(201);
//     });
//
//     it('sends back the user object in a JSON response following a successful POST request to /api/auth/signup', async () => {
//       const res = await request(app)
//         .post('/api/auth/signup')
//         .send({ username: 'testuser2', password: 'testpw2' });
//
//       expect(res.body.user).to.exist;
//     });
//
//     it('sends back a JWT token following a successful POST request to /api/auth/signup', async () => {
//       const res = await request(app)
//         .post('/api/auth/signup')
//         .send({ username: 'testuser2', password: 'testpw2' });
//
//       expect(res.body.token).to.exist;
//     });
//
//     it('sends back an error if username already exists following a POST request to /api/auth/signup', async () => {
//       const res = await request(app)
//         .post('/api/auth/signup')
//         .send({ username: 'testuser1', password: 'testpw1' });
//
//       expect(res.body.error).to.equal('Username is not available.');
//     });
//
//     it('sends back an error if a username is not submitted after a POST request to /api/auth/signup', async () => {
//       const res = await request(app)
//         .post('/api/auth/signup')
//         .send({ username: '', password: 'testpw' });
//
//       expect(res.text).to.include('You must provide a username and password.');
//     });
//
//     it('sends back an error if a password is not submitted after a POST request to /api/auth/signup', async () => {
//       const res = await request(app)
//         .post('/api/auth/signup')
//         .send({ username: 'testuser2', password: '' });
//
//       expect(res.text).to.include('You must provide a username and password.');
//     });
//   });
//
//   describe('.signIn', () => {
//     // beforeEach(async () => {
//     //   const user = new User({
//     //     local: {
//     //       username: 'testuser5',
//     //       password: 'testpw5'
//     //     }
//     //   });
//     //
//     //   await user.save();
//     // });
//
//     it('sends back the user object in a JSON response following a successful POST request to /api/auth/signin', async () => {
//         const res = await request(app)
//           .post('/api/auth/signin')
//           .send({ username: 'testuser1', password: 'testpw1' });
//
//         expect(res.body.user).to.exist;
//     });
//
//     it('sends back a JWT token following a successful POST request to /api/auth/signin', async () => {
//       const res = await request(app)
//         .post('/api/auth/signin')
//         .send({ username: 'testuser1', password: 'testpw1' });
//
//       expect(res.body.token).to.exist;
//     });
//   });
// });
