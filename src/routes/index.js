import passportService from '../services/passport';
import authRoutes from './auth_routes';
import userRoutes from './user_routes';
import playlistRoutes from './playlist_routes';
import songRoutes from './song_routes';

export default app => {
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/playlist', playlistRoutes);
  app.use('/api/song', songRoutes);
};
