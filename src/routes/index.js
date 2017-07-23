import passportService from '../services/passport';
import authRoutes from './auth_routes';
import userRoutes from './user_routes';
import playlistRoutes from './playlist_routes';
import songRoutes from './song_routes';

import passport from 'passport';
import requireAuth from '../utils/require_auth';
import tokenForUser from '../utils/token';

export default app => {
  // app.use('/api/auth', authRoutes);

  let redirectUrl; // Url to redirect back to mobile app

  // Facebook auth routes
  app.get('/api/auth/facebook', (req, res) => {
    redirectUrl = req.query.linkingUri;
    passport.authenticate('facebook')(req, res);
  });

  app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/api/auth/facebook' }),
    (req, res) => res.redirect(`${redirectUrl}?user=${JSON.stringify(req.user)}&token=${tokenForUser(req.user)}`));

  // Google auth routes
  app.get('/api/auth/google', (req, res) => {
    redirectUrl = req.query.linkingUri;
    passport.authenticate('google', { scope: ['profile'] })(req, res);
  });

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/google' }),
    (req, res) => res.redirect(`${redirectUrl}?user=${JSON.stringify(req.user)}&token=${tokenForUser(req.user)}`));
  app.use('/api/user', userRoutes);
  app.use('/api/playlist', playlistRoutes);
  app.use('/api/song', songRoutes);
};
