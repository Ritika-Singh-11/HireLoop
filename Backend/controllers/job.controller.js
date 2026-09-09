import Job from '../models/job.model.js';
import RecruiterProfile from '../models/recruiterProfile.model.js';
import notificationService from '../services/notification.service.js';

// ---------- STUDENT/PUBLIC: Browse approved jobs, with filters ----------
// GET /api/jobs?branch=CSE&minCgpa=8&batch=2026&roleType=full_time
export const getJobs = async (req, res, next) => {
  try {
    const { branch, minCgpa, batch, roleType, skill } = req.query;

    const filter = { isApproved: true };
    if (branch) filter.eligibleBranches = branch;
    if (batch) filter.batch = Number(batch);
    if (roleType) filter.roleType = roleType;
    if (skill) filter.skillsRequired = skill;

    // A student with CGPA X should see jobs whose cutoff is <= X, not the other way round
    if (minCgpa) filter.minCgpa = { $lte: Number(minCgpa) };

    const jobs = await Job.find(filter)
      .populate('recruiter', 'companyName')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

// ---------- Get a single job by id (recruiter/admin can see unapproved too if it's theirs) ----------
// GET /api/jobs/:id
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'companyName isApproved');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (!job.isApproved) {
      // Only the owning recruiter or an admin may view an unapproved job
      const isAdmin = req.user?.role === 'admin';
      const recruiterProfile = await RecruiterProfile.findOne({ user: req.user?.id });
      const isOwner = recruiterProfile && job.recruiter._id.toString() === recruiterProfile._id.toString();
      if (!isAdmin && !isOwner) {
        return res.status(404).json({ message: 'Job not found' });
      }
    }

    res.json(job);
  } catch (err) {
    next(err);
  }
};

// ---------- RECRUITER: Create a job posting ----------
// POST /api/jobs
// Body: { title, description, roleType, eligibleBranches, minCgpa, batch, ctcMin, ctcMax, skillsRequired, deadline }
export const createJob = async (req, res, next) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user.id });
    if (!recruiterProfile) {
      return res.status(404).json({ message: 'Recruiter profile not found for this account' });
    }
    if (!recruiterProfile.isApproved) {
      return res.status(403).json({ message: 'Your company is not yet approved by the placement cell' });
    }

    const {
      title, description, roleType, eligibleBranches,
      minCgpa, batch, ctcMin, ctcMax, skillsRequired, deadline,
    } = req.body;

    if (!title || !description || !batch || !ctcMin || !ctcMax || !deadline) {
      return res.status(400).json({ message: 'title, description, batch, ctcMin, ctcMax and deadline are required' });
    }

    const job = await Job.create({
      recruiter: recruiterProfile._id,
      title,
      description,
      roleType,
      eligibleBranches,
      minCgpa,
      batch,
      ctcMin,
      ctcMax,
      skillsRequired,
      deadline,
      // isApproved defaults to false — admin must approve.
      // isPaid defaults to false — set true by the payment controller (Phase 5)
      // once the listing-fee checkout is verified. For now, jobs can be created
      // unpaid so you can test the full flow before wiring up Razorpay.
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

// ---------- RECRUITER: Update own job (only while still unapproved) ----------
// PATCH /api/jobs/:id
export const updateJob = async (req, res, next) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user.id });
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (!recruiterProfile || job.recruiter.toString() !== recruiterProfile._id.toString()) {
      return res.status(403).json({ message: 'You do not own this job posting' });
    }
    if (job.isApproved) {
      return res.status(400).json({ message: 'Cannot edit a job that has already been approved. Contact the placement cell.' });
    }

    const allowedFields = [
      'title', 'description', 'roleType', 'eligibleBranches',
      'minCgpa', 'batch', 'ctcMin', 'ctcMax', 'skillsRequired', 'deadline',
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    await job.save();
    res.json(job);
  } catch (err) {
    next(err);
  }
};

// ---------- RECRUITER: List jobs posted by the logged-in recruiter (incl. unapproved) ----------
// GET /api/jobs/mine
export const getMyJobs = async (req, res, next) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user.id });
    if (!recruiterProfile) return res.status(404).json({ message: 'Recruiter profile not found' });

    const jobs = await Job.find({ recruiter: recruiterProfile._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

// ---------- ADMIN: List jobs pending approval ----------
// GET /api/jobs/pending
export const getPendingJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ isApproved: false }).populate('recruiter', 'companyName');
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

// ---------- ADMIN: Approve a job ----------
// PATCH /api/jobs/:id/approve
export const approveJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, rejectionReason: undefined },
      { new: true }
    ).populate('recruiter');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // 1. Notify recruiter
    if (job.recruiter?.user) {
      await notificationService.createNotification({
        recipient: job.recruiter.user,
        role: 'recruiter',
        title: 'Job Posting Approved',
        message: `Your job posting "${job.title}" was approved by the TPO and is now live to students.`,
        type: 'success',
        category: 'approval',
        actionTarget: { role: 'recruiter', tab: 'dashboard' },
      });
    }

    // 2. Broadcast to students
    await notificationService.broadcastToRole('student', {
      title: `New Placement Opening: ${job.title}`,
      message: `${job.recruiter?.companyName || 'A verified recruiter'} has opened applications for ${job.title}. Min CGPA: ${job.minCgpa || 'Open'}.`,
      type: 'info',
      category: 'drive',
      actionTarget: { role: 'student', tab: 'jobs' },
    });

    res.json(job);
  } catch (err) {
    next(err);
  }
};

// ---------- ADMIN: Reject a job ----------
// PATCH /api/jobs/:id/reject   Body: { reason }
export const rejectJob = async (req, res, next) => {
  try {
    const reason = req.body.reason || 'Does not meet campus policy';
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, rejectionReason: reason },
      { new: true }
    ).populate('recruiter');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Notify recruiter with rejection feedback
    if (job.recruiter?.user) {
      await notificationService.createNotification({
        recipient: job.recruiter.user,
        role: 'recruiter',
        title: 'Job Posting Returned / Rejected',
        message: `Your job posting "${job.title}" was rejected by TPO. Reason: ${reason}`,
        type: 'warning',
        category: 'approval',
        actionTarget: { role: 'recruiter', tab: 'dashboard' },
      });
    }

    res.json(job);
  } catch (err) {
    next(err);
  }
};
