import mongoose from 'mongoose';

/**
 * One Session document = one logged-in device/browser.
 * Deleting a document logs that device out immediately, since /refresh
 * checks this collection before issuing a new access token.
 * The TTL index auto-removes stale sessions after they'd have expired anyway.
 */
const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  refreshToken: { type: String, required: true, unique: true },
  userAgent: String,
  ip: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: `${process.env.REFRESH_TOKEN_EXPIRY_DAYS || 30}d`, // TTL index
  },
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;
