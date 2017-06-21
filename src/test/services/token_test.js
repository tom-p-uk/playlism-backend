import token from '../../services/token';
import User from '../../models/User';
import { expect } from 'chai';

describe('token', () => {
  it('produces a JWT token when provided with a User instance', () => {
    const user = new User({ local: {
      username: 'testuser',
      password: 'testpw',
    }});

    const userToken = token(user);
    const split = userToken.split('.');
    expect(userToken).to.be.a('string');
    expect(split.length).to.equal(3);
  });
});
