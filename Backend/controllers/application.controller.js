import Application from '../models/application.model.js';
import Job from '../models/job.model.js';
import StudentProfile from '../models/studentProfile.model.js';
import RecruiterProfile from '../models/recruiterProfile.model.js';
import notificationService from '../services/notification.service.js';

// ---------- STUDENT: Apply to a job ----------
// POST /api/applications   Body: { jobId, resumeUrl, coverLetter? }
export const applyToJob = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) return res.status(404).json({ message: 'Student profile not found' });

    const { jobId, resumeUrl, coverLetter } = req.body;
    if (!jobId || !resumeUrl) {
      return res.status(400).json({ message: 'jobId and resumeUrl are required' });
    }

    const job = await Job.findById(jobId).populate('recruiter');
    if (!job || !job.isApproved) {
      return res.status(404).json({ message: 'Job not found or not open for applications' });
    }
    if (job.deadline < new Date()) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    // Eligibility check server-side (never trust the frontend filter alone)
    if (job.minCgpa && studentProfile.cgpa < job.minCgpa) {
      return res.status(403).json({ message: `Minimum CGPA required is ${job.minCgpa}` });
    }
    if (job.eligibleBranches?.length && !job.eligibleBranches.includes(studentProfile.branch)) {
      return res.status(403).json({ message: 'Your branch is not eligible for this job' });
    }

    let application;
    try {
      application = await Application.create({
        student: studentProfile._id,
        job: job._id,
        resumeUrl,
        coverLetter,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ message: 'You have already applied to this job' });
      }
      throw err;
    }

    // 1. Notify recruiter
    if (job.recruiter?.user) {
      await notificationService.createNotification({
        recipient: job.recruiter.user,
        role: 'recruiter',
        title: 'New Candidate Application',
        message: `${studentProfile.name || 'A candidate'} (CGPA: ${studentProfile.cgpa || 'N/A'}, ${studentProfile.branch || 'N/A'}) applied for ${job.title}.`,
        type: 'info',
        category: 'application',
        actionTarget: { role: 'recruiter', tab: 'applicants', meta: { jobId: job._id } },
      });
    }

    // 2. Notify student
    await notificationService.createNotification({
      recipient: req.user.id,
      role: 'student',
      title: 'Application Submitted',
      message: `Your application for "${job.title}" at ${job.recruiter?.companyName || 'the recruiter'} was submitted successfully.`,
      type: 'success',
      category: 'application',
      actionTarget: { role: 'student', tab: 'applications' },
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

// ---------- STUDENT: My applications (with tracker status) ----------
// GET /api/applications/student
export const getMyApplications = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) return res.status(404).json({ message: 'Student profile not found' });

    const applications = await Application.find({ student: studentProfile._id })
      .populate({ path: 'job', populate: { path: 'recruiter', select: 'companyName' } })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

// ---------- RECRUITER: View applicants for one of their jobs, with filters ----------
// GET /api/applications/job/:jobId?minCgpa=8&branch=CSE&minAtsScore=70&status=applied
export const getApplicantsForJob = async (req, res, next) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user.id });
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (!recruiterProfile || job.recruiter.toString() !== recruiterProfile._id.toString()) {
      return res.status(403).json({ message: 'You do not own this job posting' });
    }

    const { status, minAtsScore } = req.query;
    const filter = { job: job._id };
    if (status) filter.status = status;
    if (minAtsScore) filter.atsScore = { $gte: Number(minAtsScore) };

    let applications = await Application.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 });

    // branch/cgpa filters apply to the populated student profile,
    // so filter in-memory after populate rather than in the Mongo query
    const { branch, minCgpa } = req.query;
    if (branch) applications = applications.filter((a) => a.student.branch === branch);
    if (minCgpa) applications = applications.filter((a) => a.student.cgpa >= Number(minCgpa));

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

// ---------- RECRUITER: Update an applicant's status ----------
// PATCH /api/applications/:id/status   Body: { status, recruiterNotes? }
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, recruiterNotes } = req.body;
    const validStatuses = ['applied', 'shortlisted', 'interview_scheduled', 'offered', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user.id });
    if (!recruiterProfile || application.job.recruiter.toString() !== recruiterProfile._id.toString()) {
      return res.status(403).json({ message: 'You do not own the job this application belongs to' });
    }

    application.status = status;
    if (recruiterNotes !== undefined) application.recruiterNotes = recruiterNotes;
    await application.save();

    // Notify the student regarding the status progression
    try {
      const populatedApp = await Application.findById(application._id).populate({
        path: 'student',
        select: 'user name',
      });

      if (populatedApp?.student?.user) {
        const statusMessages = {
          shortlisted: `You have been shortlisted for the next round of ${application.job.title}!`,
          interview_scheduled: `An interview has been scheduled for your application to ${application.job.title}.`,
          offered: `🎉 Congratulations! You have received a job offer for ${application.job.title}!`,
          rejected: `Update regarding your application for ${application.job.title}: The hiring team has chosen to proceed with other candidates.`,
        };

        await notificationService.createNotification({
          recipient: populatedApp.student.user,
          role: 'student',
          title: `Application Update: ${application.job.title}`,
          message: statusMessages[status] || `Your application status was updated to ${status}.`,
          type: status === 'offered' ? 'success' : status === 'shortlisted' ? 'info' : status === 'rejected' ? 'warning' : 'info',
          category: 'application',
          actionTarget: { role: 'student', tab: 'applications' },
        });
      }
    } catch (notifErr) {
      console.error('Error sending application status notification:', notifErr);
    }

    res.json(application);
  } catch (err) {
    next(err);
  }
};

// ---------- Get a single application (student who owns it, recruiter who owns the job, or admin) ----------
// GET /api/applications/:id
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } });
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const isAdmin = req.user.role === 'admin';
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    const isOwningStudent = studentProfile && application.student._id.toString() === studentProfile._id.toString();
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user.id });
    const isOwningRecruiter = recruiterProfile && application.job.recruiter.toString() === recruiterProfile._id.toString();

    if (!isAdmin && !isOwningStudent && !isOwningRecruiter) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(application);
  } catch (err) {
    next(err);
  }
};
