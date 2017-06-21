import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import User from '../models/User';

const facebookOptions = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  profileFields: ['id', 'first_name','picture'],
};

const facebookTokenLogin = new FacebookTokenStrategy(facebookOptions, (accessToken, refreshToken, profile, done) => {
  console.log(accessToken);
  User.findOrCreate({ 'facebook.id': profile.id }, {
    facebook: {
      id: profile.id,
      firstName: profile.name.givenName,
      profileImg: profile.photos[0].value
    }
  })
    .then(user => done(null, user.result))
    .catch(err => done(err));
});

const localLogin = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ 'local.username': username });

    if (!user) return done(null, false);

    // run method assigned to User in models/user & return a user if username exists, pw's match and there are no errors
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        console.log('Error:', err);
        return done(err);
      }

      if (!isMatch) return done(null, false);

      return done(null, user);
    });
  } catch (err) {
    done(err);
  }
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET
};

const jwtLogin = new JwtStrategy(jwtOptions, (jwt_payload, done) => {

  User.findById(jwt_payload.sub)
    .then((user) => {
      if (user) {
        done(null, user);
      }
      else {
        done(null, false);
      }
    })
    .catch((err) => {
      done(err, false);
    });
});

// passport.use(facebookTokenLogin);
passport.use(localLogin);
passport.use(jwtLogin);
