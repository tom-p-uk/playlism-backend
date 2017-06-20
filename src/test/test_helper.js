import mongoose from 'mongoose';

before(done => {
  mongoose.connect(process.env.MONGO_TEST_URI);

  mongoose.connection
    .once('open', () => {
      console.log('Connected to test database');
      done();
    })
    .on('error', err => {
      console.log(err);
      done();
    });
});

beforeEach(done => {
  const { users, playlists, songs } = mongoose.connection.collections;
  Promise.all([users.drop(), playlists.drop(), songs.drop()])
    .then(() => done())
    .catch(() => done());
});
