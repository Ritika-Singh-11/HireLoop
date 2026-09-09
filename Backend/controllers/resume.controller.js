import StudentProfile from '../models/studentProfile.model.js';
import notificationService from '../services/notification.service.js';

// POST /api/resumes/upload
export const uploadResume = async (req, res, next) => {
  try {
    const { fileName, fileSize, fileUrl, rawText, skills } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: 'File name is required' });
    }

    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      // Auto-create basic profile if missing
      profile = await StudentProfile.create({
        user: req.user.id,
        batch: 2026,
        skills: skills || [],
      });
    }

    profile.resumeFileName = fileName;
    profile.resumeFileSize = fileSize || 0;
    profile.resumeUrl = fileUrl || `data:application/pdf;base64,mock`;
    profile.resumeUploadedAt = new Date();
    if (rawText) profile.resumeText = rawText;
    if (skills && Array.isArray(skills) && skills.length > 0) {
      profile.skills = Array.from(new Set([...(profile.skills || []), ...skills]));
    }

    await profile.save();

    // Trigger instant notification
    await notificationService.createNotification({
      recipient: req.user.id,
      role: 'student',
      title: 'Resume Verified & Active',
      message: `Master resume "${fileName}" uploaded successfully. AI ATS Scanner has indexed your credentials.`,
      type: 'success',
      category: 'system',
      actionTarget: { role: 'student', tab: 'resume-analyzer' },
    });

    res.json({
      message: 'Resume uploaded and synced with candidate profile',
      resume: {
        fileName: profile.resumeFileName,
        fileSize: profile.resumeFileSize,
        resumeUrl: profile.resumeUrl,
        uploadedAt: profile.resumeUploadedAt,
        skills: profile.skills,
        hasText: !!profile.resumeText,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/resumes
export const getResume = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile || !profile.resumeFileName) {
      return res.json({ resume: null });
    }

    res.json({
      resume: {
        fileName: profile.resumeFileName,
        fileSize: profile.resumeFileSize,
        resumeUrl: profile.resumeUrl,
        uploadedAt: profile.resumeUploadedAt,
        resumeText: profile.resumeText,
        skills: profile.skills,
      },
    });
  } catch (err) {
    next(err);
  }
};
