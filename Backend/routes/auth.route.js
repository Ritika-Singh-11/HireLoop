import { Router } from 'express';
import passport from 'passport';
import rateLimit from 'express-rate-limit';

import auth from '../middleware/auth.middleware.js';
import * as ctrl from '../controllers/auth.controller.js';

const router = Router();

// Slow down brute-force attempts on login/register specifically
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many attempts. Please try again later.' },
});

// ---------- Email / Password ----------
router.post('/register', authLimiter, ctrl.register);
router.post('/login', authLimiter, ctrl.login);

// ---------- Google OAuth ----------
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
const getClientLoginUrl = () => {
  const raw = process.env.CLIENT_URL || 'https://hire-loop-chi.vercel.app';
  const base = raw.split(',')[0].trim().replace(/\/$/, '');
  return `${base}/login`;
};

router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', {
      session: false,
      failureRedirect: getClientLoginUrl(),
    })(req, res, next);
  },
  ctrl.oauthCallback
);

// ---------- GitHub OAuth ----------
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);
router.get(
  '/github/callback',
  (req, res, next) => {
    passport.authenticate('github', {
      session: false,
      failureRedirect: getClientLoginUrl(),
    })(req, res, next);
  },
  ctrl.oauthCallback
);

// ---------- Token lifecycle ----------
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.post('/logout-all', auth, ctrl.logoutAll);
router.delete('/sessions/:sessionId', auth, ctrl.revokeSession);
router.get('/sessions', auth, ctrl.listSessions);

// ---------- Current user ----------
router.get('/me', auth, ctrl.me);

export default router;
