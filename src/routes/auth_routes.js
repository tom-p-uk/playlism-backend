import express from 'express';
import passport from 'passport';
import requireAuth from '../utils/require_auth';
import tokenForUser from '../utils/token';

const router = express.Router();

let redirectUrl; // Url to redirect back to mobile app

// Facebook auth routes
router.get('/facebook', (req, res) => {
  redirectUrl = req.query.linkingUri;
  passport.authenticate('facebook')(req, res);
});

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/facebook' }),
  (req, res) => res.redirect(`${redirectUrl}?user=${JSON.stringify(req.user)}&token=${tokenForUser(req.user)}`));

// Google auth routes
router.get('/google', (req, res) => {
  redirectUrl = req.query.linkingUri;
  passport.authenticate('google', { scope: ['profile'] })(req, res);
});

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/google' }),
  (req, res) => res.redirect(`${redirectUrl}?user=${JSON.stringify(req.user)}&token=${tokenForUser(req.user)}`));

export default router;
