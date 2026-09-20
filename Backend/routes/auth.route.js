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
  (req, res, next) => {
    const returnTo = req.query.returnTo || req.headers.referer;
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
      state: returnTo ? Buffer.from(returnTo).toString('base64') : undefined,
    })(req, res, next);
  }
);
const getClientLoginUrl = (req) => {
  let base = null;
  if (req?.query?.state) {
    try {
      const decoded = Buffer.from(req.query.state, 'base64').toString('utf8');
      const origin = new URL(decoded).origin;
      if (origin.endsWith('.vercel.app') || origin.includes('localhost')) {
        base = origin;
      }
    } catch {
      // fallback
    }
  }
  if (!base) {
    const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.RENDER_EXTERNAL_URL;
    const raw = process.env.CLIENT_URL || 'https://hire-loop-chi.vercel.app';
    const urls = raw.split(',').map((o) => o.trim()).filter(Boolean);
    if (isProd) {
      base = urls.find((u) => !u.includes('localhost')) || 'https://hire-loop-chi.vercel.app';
    } else {
      base = urls.find((u) => u.includes('localhost')) || urls[0] || 'http://localhost:5173';
    }
  }
  return `${base.replace(/\/$/, '')}/?error=oauth_failed`;
};

router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', {
      session: false,
      failureRedirect: getClientLoginUrl(req),
    })(req, res, next);
  },
  ctrl.oauthCallback
);

// ---------- GitHub OAuth ----------
router.get(
  '/github',
  (req, res, next) => {
    const returnTo = req.query.returnTo || req.headers.referer;
    passport.authenticate('github', {
      scope: ['user:email'],
      session: false,
      state: returnTo ? Buffer.from(returnTo).toString('base64') : undefined,
    })(req, res, next);
  }
);
router.get(
  '/github/callback',
  (req, res, next) => {
    passport.authenticate('github', {
      session: false,
      failureRedirect: getClientLoginUrl(req),
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
