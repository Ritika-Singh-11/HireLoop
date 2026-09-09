import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/session.model.js';

// Short-lived access token — sent as Bearer token, never stored server-side
export function signAccessToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
}

// Long-lived opaque refresh token — stored in DB as a Session document.
// Opaque (random) rather than a JWT so it can be invalidated by deleting the row.
export function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Creates a new Session (i.e. logs the user in on this device) and
 * returns both tokens. Call this after any successful login — local or OAuth.
 */
export async function createSession(user, req) {
  const refreshToken = generateRefreshToken();

  await Session.create({
    user: user._id,
    refreshToken,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });

  const accessToken = signAccessToken(user);
  return { accessToken, refreshToken };
}
