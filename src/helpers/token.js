import jwt from 'jwt-simple';

const tokenForUser = user => {
  console.log('asdfasdfasdfasdfaf');
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.SECRET);
};

export default tokenForUser;
