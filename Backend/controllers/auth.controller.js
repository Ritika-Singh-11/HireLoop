import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import StudentProfile from '../models/studentProfile.model.js';
import RecruiterProfile from '../models/recruiterProfile.model.js';
import Company from '../models/company.model.js';
import { signAccessToken, createSession } from '../utils/tokens.util.js';

const ADMIN_WHITELIST = (process.env.ADMIN_EMAIL_WHITELIST || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// ---------- REGISTER (email/password) ----------
// CHANGED: now accepts and persists the real fields your registration form
// collects (rollNumber, branch, cgpa, batch, skills for students; industry,
// website for recruiters if you send them) instead of silently dropping them.
export const register = async (req, res, next) => {
  try {
    const {
      email, password, name, role,
      // student-specific
      rollNumber, branch, cgpa, batch, skills,
      // recruiter-specific
      companyName, industry, website,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'email, password and role are required' });
    }
    if (!['student', 'recruiter', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (role === 'admin') {
      const isWhitelisted = ADMIN_WHITELIST.length === 0 || ADMIN_WHITELIST.includes(email.toLowerCase());
      const hasValidKey = req.body.adminSecretKey && (req.body.adminSecretKey.trim().toUpperCase() === (process.env.ADMIN_SECRET_KEY || 'TPO2026').toUpperCase());
      if (!isWhitelisted && !hasValidKey) {
        return res.status(403).json({ message: 'This email is not whitelisted, and an invalid TPO Security Key was provided' });
      }
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ email, password, name, role, provider: 'local' });

    if (role === 'student') {
      // `skills` may arrive as a real array (already split on the frontend)
      // or as a raw comma-separated string — handle both so this endpoint
      // works regardless of how the frontend form processed it.
      const skillsArray = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
          ? skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [];

      await StudentProfile.create({
        user: user._id,
        rollNumber,
        branch,
        cgpa: cgpa !== undefined ? Number(cgpa) : undefined,
        batch: batch !== undefined ? Number(batch) : undefined,
        skills: skillsArray,
        isPremium: true,
      });
    }

    let extra = {};
    if (role === 'student') {
      extra.isPremium = true;
    }
    if (role === 'recruiter') {
      const company = companyName?.trim() || 'Unnamed Company';
      await RecruiterProfile.create({
        user: user._id,
        companyName: company,
        isApproved: false,
      });

      // Upsert into Company collection for Admin/TPO verification
      const companyDoc = await Company.findOneAndUpdate(
        { name: company },
        {
          $setOnInsert: {
            name: company,
            logo: '🏢',
            industry: industry || 'Information Technology',
            location: 'India',
            website: website || '',
            contactPerson: name || 'Talent Acquisition Team',
            contactEmail: email.toLowerCase(),
            status: 'Pending',
          }
        },
        { upsert: true, returnDocument: 'after' }
      );

      companyInfo = {
        companyName: company,
        companyId: companyDoc?._id?.toString(),
        isApproved: false,
      };
    }

    const { accessToken, refreshToken } = await createSession(user, req);

    res.status(201).json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role, ...companyInfo, ...extra },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// ---------- LOGIN (email/password) ----------
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = await createSession(user, req);

    let extra = {};
    if (user.role === 'student') {
      const sp = await StudentProfile.findOne({ user: user._id });
      extra.isPremium = sp ? sp.isPremium !== false : true;
    }
    if (user.role === 'recruiter') {
      const rp = await RecruiterProfile.findOne({ user: user._id });
      if (rp) {
        extra.companyName = rp.companyName;
        extra.isApproved = rp.isApproved;
        const comp = await Company.findOne({ name: rp.companyName });
        if (comp) {
          extra.companyId = comp._id.toString();
          extra.companyStatus = comp.status;
        }
      }
    }

    res.json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role, ...extra },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// ---------- OAUTH CALLBACK (shared by Google + GitHub routes) ----------
// CHANGED: your frontend has no router (no /oauth-success page to land on),
// so this now redirects to CLIENT_URL's ROOT with tokens as query params
// instead of a /oauth-success subpath. Your AppContext reads these params
// on load (see the frontend patch) and cleans up the URL afterward.
export const oauthCallback = async (req, res, next) => {
  try {
    const user = req.user;
    const { accessToken, refreshToken } = await createSession(user, req);

    const redirectUrl = new URL('/', process.env.CLIENT_URL);
    redirectUrl.searchParams.set('accessToken', accessToken);
    redirectUrl.searchParams.set('refreshToken', refreshToken);
    res.redirect(redirectUrl.toString());
  } catch (err) {
    next(err);
  }
};

// ---------- CURRENT USER ----------
export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    let extra = {};
    if (user.role === 'student') {
      const sp = await StudentProfile.findOne({ user: user._id });
      extra.isPremium = sp ? sp.isPremium !== false : true;
    }
    if (user.role === 'recruiter') {
      const rp = await RecruiterProfile.findOne({ user: user._id });
      if (rp) {
        extra.companyName = rp.companyName;
        extra.isApproved = rp.isApproved;
        const comp = await Company.findOne({ name: rp.companyName });
        if (comp) {
          extra.companyId = comp._id.toString();
          extra.companyStatus = comp.status;
        }
      }
    }
    res.json({ id: user._id, email: user.email, name: user.name, role: user.role, avatar: user.avatar, ...extra });
  } catch (err) {
    next(err);
  }
};

// ---------- LIST MY ACTIVE SESSIONS (devices) ----------
export const listSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ user: req.user.id }).select('userAgent ip createdAt');
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

// ---------- REFRESH ACCESS TOKEN ----------
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken is required' });

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      return res.status(401).json({ message: 'Session expired or logged out. Please log in again.' });
    }

    const user = await User.findById(session.user);
    if (!user) return res.status(401).json({ message: 'User no longer exists' });

    const accessToken = signAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

// ---------- LOGOUT (this device only) ----------
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await Session.deleteOne({ refreshToken });
    }
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

// ---------- LOGOUT FROM ALL DEVICES ----------
export const logoutAll = async (req, res, next) => {
  try {
    await Session.deleteMany({ user: req.user.id });
    res.json({ message: 'Logged out from all devices' });
  } catch (err) {
    next(err);
  }
};

// ---------- LOGOUT A SPECIFIC OTHER DEVICE (by session id) ----------
export const revokeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    await Session.deleteOne({ _id: sessionId, user: req.user.id });
    res.json({ message: 'Session revoked' });
  } catch (err) {
    next(err);
  }
};
