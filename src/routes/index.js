import app from '../app';
import passportService from '../services/passport';
import passport from 'passport';
import { signUp, signIn } from '../controllers/user_controller';
import playlistController from '../controllers/playlist_controller';
import songController from '../controllers/song_controller';

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });
const requireFacebookAuth = passport.authenticate('facebook-token', { session: false });

export default app => {
  // app.post('/api/auth/facebook', requireFacebookAuth, userController.facebookAuth);
  app.post('/api/auth/signup', signUp);
  app.post('/api/auth/signin', requireSignIn, signIn);
};
