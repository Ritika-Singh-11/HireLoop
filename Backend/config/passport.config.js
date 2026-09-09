import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/user.model.js';

/**
 * Finds an existing OAuth user or creates a new one.
 * New OAuth users default to role "student" — they choose/confirm
 * their real role on the "Complete your profile" screen on the frontend.
 * Recruiters get isApproved:false until admin approves them (see RecruiterProfile).
 */
async function findOrCreateOAuthUser({ provider, providerId, email, name, avatar }) {
  const normalizedEmail = email ? email.toLowerCase() : null;
  let user = null;

  if (normalizedEmail) {
    user = await User.findOne({
      $or: [
        { provider, providerId },
        { email: normalizedEmail },
      ],
    });
  } else {
    user = await User.findOne({ provider, providerId });
  }

  if (user) {
    let updated = false;
    if (!user.providerId && providerId) {
      user.providerId = providerId;
      updated = true;
    }
    if (!user.avatar && avatar) {
      user.avatar = avatar;
      updated = true;
    }
    if (updated) await user.save();
    return user;
  }

  user = await User.create({
    email: normalizedEmail,
    name,
    avatar,
    provider,
    providerId,
    role: 'student',
    isEmailVerified: true,
  });
  return user;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateOAuthUser({
          provider: 'google',
          providerId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
        });
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateOAuthUser({
          provider: 'github',
          providerId: profile.id,
          email: profile.emails?.[0]?.value || `${profile.username}@users.noreply.github.com`,
          name: profile.displayName || profile.username,
          avatar: profile.photos?.[0]?.value,
        });
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// We use JWTs, not sessions, so serialize/deserialize aren't needed for
// req.user during normal API calls — but Passport requires them to be
// defined for the OAuth redirect handshake itself.
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
