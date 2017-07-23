'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

before(function (done) {
  _mongoose2.default.connect(process.env.MONGO_TEST_URI);

  _mongoose2.default.connection.once('open', function () {
    console.log('Connected to test database');
    done();
  }).on('error', function (err) {
    console.log(err);
    done();
  });
});

beforeEach(function (done) {
  var _mongoose$connection$ = _mongoose2.default.connection.collections,
      users = _mongoose$connection$.users,
      playlists = _mongoose$connection$.playlists,
      songs = _mongoose$connection$.songs;

  _promise2.default.all([users.drop(), playlists.drop(), songs.drop()]).then(function () {
    return done();
  }).catch(function () {
    return done();
  });
});