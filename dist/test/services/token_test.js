'use strict';

var _token = require('../../services/token');

var _token2 = _interopRequireDefault(_token);

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

var _chai = require('chai');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('token', function () {
  it('produces a JWT token when provided with a User instance', function () {
    var user = new _User2.default({ local: {
        username: 'testuser',
        password: 'testpw'
      } });

    var userToken = (0, _token2.default)(user);
    var split = userToken.split('.');
    (0, _chai.expect)(userToken).to.be.a('string');
    (0, _chai.expect)(split.length).to.equal(3);
  });
});