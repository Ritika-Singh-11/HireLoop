import StudentProfile from '../models/studentProfile.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';

// GET /api/students/profile - Fetch current student profile
export const getProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', 'name email role');
    
    if (!profile) {
      // Lazy initialize profile for registered student if not yet existing
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      profile = await StudentProfile.create({
        user: user._id,
        rollNumber: '21BCSE000',
        branch: 'Computer Science & Engineering',
        cgpa: 8.0,
        batch: 2026,
        skills: ['React', 'Node.js', 'JavaScript'],
        isVerified: true,
        isPremium: true
      });
      profile = await StudentProfile.findById(profile._id).populate('user', 'name email role');
    }

    res.json({
      success: true,
      profile: {
        id: profile._id.toString(),
        userId: profile.user?._id?.toString() || req.user.id,
        name: profile.user?.name || req.user.name || 'Candidate',
        email: profile.user?.email || req.user.email,
        phone: profile.phone || '',
        location: profile.location || '',
        rollNumber: profile.rollNumber || '',
        branch: profile.branch || '',
        batch: profile.batch || 2026,
        cgpa: profile.cgpa || 0,
        skills: profile.skills || [],
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        summary: profile.summary || '',
        backlogs: profile.backlogs || 0,
        isVerified: profile.isVerified !== false,
        isBlocked: !!profile.isBlocked,
        blockReason: profile.blockReason || null,
        placedCompany: profile.placedCompany || null,
        atsScore: profile.atsScore || null,
        mockInterviewScore: profile.mockInterviewScore || null,
        isPremium: profile.isPremium !== false,
        resumeUrl: profile.resumeUrl || null,
        resumeData: profile.resumeData || null
      }
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/students/profile - Update & synchronize student profile
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      rollNumber,
      branch,
      batch,
      cgpa,
      skills,
      linkedin,
      github,
      summary,
      backlogs,
      placedCompany,
      resumeData
    } = req.body;

    // Update User model (name, email) if changed
    if (name || email) {
      const userUpdates = {};
      if (name) userUpdates.name = name.trim();
      if (email) userUpdates.email = email.toLowerCase().trim();
      await User.findByIdAndUpdate(req.user.id, userUpdates);
    }

    let profile = await StudentProfile.findOne({ user: req.user.id });

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    if (!profile) {
      profile = new StudentProfile({
        user: req.user.id,
        rollNumber: rollNumber || '21BCSE000',
        branch: branch || 'Computer Science & Engineering',
        cgpa: cgpa !== undefined ? Number(cgpa) : 8.0,
        batch: batch !== undefined ? Number(batch) : 2026,
        skills: skillsArray || ['JavaScript'],
        phone,
        location,
        linkedin,
        github,
        summary,
        resumeData,
        backlogs: backlogs !== undefined ? Number(backlogs) : 0,
        isVerified: true
      });
    } else {
      if (rollNumber !== undefined) profile.rollNumber = rollNumber;
      if (branch !== undefined) profile.branch = branch;
      if (cgpa !== undefined) profile.cgpa = Number(cgpa);
      if (batch !== undefined) profile.batch = Number(batch);
      if (skillsArray !== undefined) profile.skills = skillsArray;
      if (phone !== undefined) profile.phone = phone;
      if (location !== undefined) profile.location = location;
      if (linkedin !== undefined) profile.linkedin = linkedin;
      if (github !== undefined) profile.github = github;
      if (summary !== undefined) profile.summary = summary;
      if (backlogs !== undefined) profile.backlogs = Number(backlogs);
      if (placedCompany !== undefined) profile.placedCompany = placedCompany;
      if (resumeData !== undefined) profile.resumeData = resumeData;
    }

    await profile.save();

    // Populate user
    const updatedProfile = await StudentProfile.findById(profile._id).populate('user', 'name email role');

    // Notify TPO about profile update
    try {
      await Notification.create({
        title: 'Student Profile Synchronized',
        message: `${updatedProfile.user?.name || 'Student'} (${updatedProfile.rollNumber || '2026'}) synchronized academic profile with CGPA ${updatedProfile.cgpa}.`,
        type: 'status',
        role: 'admin'
      });
    } catch (e) {}

    res.json({
      success: true,
      message: 'Student profile successfully synchronized with campus placement database',
      profile: {
        id: updatedProfile._id.toString(),
        userId: updatedProfile.user?._id?.toString() || req.user.id,
        name: updatedProfile.user?.name || req.user.name || name || 'Candidate',
        email: updatedProfile.user?.email || req.user.email || email,
        phone: updatedProfile.phone || phone || '',
        location: updatedProfile.location || location || '',
        rollNumber: updatedProfile.rollNumber || rollNumber || '',
        branch: updatedProfile.branch || branch || '',
        batch: updatedProfile.batch || batch || 2026,
        cgpa: updatedProfile.cgpa || (cgpa ? Number(cgpa) : 0),
        skills: updatedProfile.skills || skillsArray || [],
        linkedin: updatedProfile.linkedin || linkedin || '',
        github: updatedProfile.github || github || '',
        summary: updatedProfile.summary || summary || '',
        backlogs: updatedProfile.backlogs || 0,
        isVerified: updatedProfile.isVerified !== false,
        isBlocked: !!updatedProfile.isBlocked,
        blockReason: updatedProfile.blockReason || null,
        placedCompany: updatedProfile.placedCompany || null,
        atsScore: updatedProfile.atsScore || null,
        mockInterviewScore: updatedProfile.mockInterviewScore || null,
        resumeUrl: updatedProfile.resumeUrl || null,
        resumeData: updatedProfile.resumeData || resumeData || null
      }
    });
  } catch (err) {
    next(err);
  }
};
