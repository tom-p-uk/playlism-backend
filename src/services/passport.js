import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User';

const facebookOptions = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${process.env.HOST}/api/auth/facebook/callback`,
  profileFields: ['id', 'name', 'picture.type(large)'],
};

const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.HOST}/api/auth/google/callback`,
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET
};

const facebookLogin = new FacebookStrategy(facebookOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, first_name, last_name, picture } = profile._json;
    let user = await User.findOneAndUpdate({ 'facebookId': id }, { lastLogin: Date.now() });

    if (!user) {
      user = new User({
        displayName: `${first_name} ${last_name}`,
        facebookId: id,
        firstName: first_name,
        lastName: last_name,
        profileImg: encodeURIComponent(profile.photos[0].value),
        displayNameLower: `${first_name} ${last_name}`.toLowerCase(),
      });

      await user.save();
    }

    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

const googleLogin = new GoogleStrategy(googleOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, name, displayName, image } = profile._json;
    let user = await User.findOneAndUpdate({ 'googleId': id }, { lastLogin: Date.now() });

    if (!user) {
      user = new User({
        displayName,
        googleId: id,
        firstName: name.givenName,
        lastName: name.familyName,
        profileImg: encodeURIComponent(image.url),
        displayNameLower: displayName.toLowerCase(),
      });

      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

const jwtLogin = new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const user = await User.findByIdAndUpdate(jwt_payload.sub, { lastLogin: Date.now() })

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
