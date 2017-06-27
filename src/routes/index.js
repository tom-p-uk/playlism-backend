import app from '../app';
import passportService from '../services/passport';
import passport from 'passport';
import {
  fetchUser,
  editDisplayName,
  editProfileImg,
} from '../controllers/user_controller';
import playlistController from '../controllers/playlist_controller';
import songController from '../controllers/song_controller';
import tokenForUser from '../services/token';

const requireAuth = passport.authenticate('jwt', { session: false });

export default app => {
  let redirectUrl; // Url to redirect back to mobile app

  // Facebook auth routes
  app.get('/auth/facebook', (req, res) => {
    redirectUrl = req.query.linkingUri;
    passport.authenticate('facebook')(req, res);
  });

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
    // Redirect to mobile app using url pulled from query string, passing user and token info
    (req, res) => res.redirect(`${redirectUrl}?user=${JSON.stringify(req.user)}&token=${tokenForUser(req.user)}`));

  // Google auth routes
  app.get('/auth/google', (req, res) => {
    redirectUrl = req.query.linkingUri;
    passport.authenticate('google', { scope: ['profile'] })(req, res);
  });

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google' }),
    // Redirect to mobile app using url pulled from query string, passing user and token info
    (req, res) => res.redirect(`${redirectUrl}?user=${JSON.stringify(req.user)}&token=${tokenForUser(req.user)}`));

  // User controller routes
  app.get('/user', requireAuth, fetchUser);
  app.put('/user/displayname', requireAuth, editDisplayName);
  app.put('/user/profileimg', requireAuth, editProfileImg);
};
