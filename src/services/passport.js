import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import User from '../models/User';

const facebookOptions = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://192.168.0.14:3000/auth/facebook/callback',
  profileFields: ['id', 'name', 'picture'],
};

const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://127.0.0.1:3000/auth/google/callback',
};

const facebookLogin = new FacebookStrategy(facebookOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, first_name, last_name, picture } = profile._json;
    const user = await User.findOrCreate({ 'facebookId': id }, {
      displayName: `${first_name} ${last_name}`,
      facebookId: id,
      firstName: first_name,
      lastName: last_name,
      picture: picture.data.url,
    });

    done(null, user.result); // user.
  } catch (err) {
    done(err);
  }
});

const googleLogin = new GoogleStrategy(googleOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, name, displayName, image } = profile._json;
    const user = await User.findOrCreate({ 'googleId': id }, {
      displayName,
      googleId: id,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: image.url,
    });

    done(null, user.result); // user.
  } catch (err) {
    done(err);
  }
});


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET
};

const jwtLogin = new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.sub)

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
});

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(facebookLogin);
passport.use(googleLogin);
passport.use(jwtLogin);
