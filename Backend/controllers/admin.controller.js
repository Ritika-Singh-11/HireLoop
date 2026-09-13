import mongoose from 'mongoose';
import User from '../models/user.model.js';
import StudentProfile from '../models/studentProfile.model.js';
import Job from '../models/job.model.js';
import PlacementDrive from '../models/placementDrive.model.js';
import Company from '../models/company.model.js';
import Announcement from '../models/announcement.model.js';
import Interview from '../models/interview.model.js';
import Notification from '../models/notification.model.js';
import Application from '../models/application.model.js';
import RecruiterProfile from '../models/recruiterProfile.model.js';
import OfferLetter from '../models/offerLetter.model.js';

// Initial Seeds
const INITIAL_COMPANIES_SEED = [
  {
    name: 'Razorpay',
    logo: '💳',
    industry: 'Financial Technology',
    location: 'Bangalore, India',
    contactPerson: 'Aditi Rao',
    contactEmail: 'aditi.rao@razorpay.com',
    status: 'Approved'
  },
  {
    name: 'Microsoft',
    logo: '💻',
    industry: 'Cloud & Enterprise Systems',
    location: 'Hyderabad, India',
    contactPerson: 'Karan Mehra',
    contactEmail: 'karan.m@microsoft.com',
    status: 'Approved'
  },
  {
    name: 'Zomato',
    logo: '🍔',
    industry: 'Consumer Internet / Logistics',
    location: 'Gurugram, India',
    contactPerson: 'Vikram Sethi',
    contactEmail: 'vikram.s@zomato.com',
    status: 'Approved'
  },
  {
    name: 'Deloitte',
    logo: '🏢',
    industry: 'Management & Technology Consulting',
    location: 'Mumbai, India',
    contactPerson: 'Sanjay Deshmukh',
    contactEmail: 'sanjay.d@deloitte.com',
    status: 'Approved'
  },
  {
    name: 'Cred',
    logo: '💎',
    industry: 'FinTech / High-Throughput Distributed',
    location: 'Bangalore, India',
    contactPerson: 'Rohit Bansal',
    contactEmail: 'rohit@cred.club',
    status: 'Pending'
  }
];

const INITIAL_ANNOUNCEMENTS_SEED = [
  {
    title: 'Microsoft Cloud & Azure Campus Recruitment Round 2 Schedule',
    category: 'Assessment Schedule',
    badge: 'Important',
    author: 'Training & Placement Directorate',
    content: 'Shortlisted candidates for Microsoft Cloud SDE-1 are requested to join the Virtual CodePair panel on Friday, Sept 12th at 09:30 AM IST. Check your registered email for direct meeting PINs.',
    pinned: true,
    targetAudience: 'All'
  },
  {
    title: 'Razorpay SDE-1 Technical Round Schedule & Candidate Instructions',
    category: 'Placement Drive',
    badge: 'Drive',
    author: 'TPO Placement Cell',
    content: 'All eligible CSE, IT, and ECE candidates who cleared the Razorpay Online Assessment have been scheduled for Round 1 interviews starting Sept 15th in Lab 4.',
    pinned: true,
    targetAudience: 'Circuital'
  },
  {
    title: 'Mandatory Policy: One-Student-One-Dream Offer Restriction',
    category: 'Policy Update',
    badge: 'Urgent',
    author: 'Dean of Student Affairs',
    content: 'Students holding an active Dream offer (CTC >= ₹15 LPA) are restricted from applying to standard recruitment drives. You remain eligible exclusively for Super Dream tier companies (CTC >= ₹25 LPA).',
    pinned: true,
    targetAudience: 'All'
  }
];

const INITIAL_INTERVIEWS_SEED = [
  {
    studentName: 'Aarav Sharma',
    studentRoll: '21BCSE104',
    companyName: 'Microsoft',
    jobTitle: 'Software Engineer (Cloud & Azure Services)',
    roundType: 'Technical Interview 1',
    date: '2026-09-12',
    time: '11:00 AM',
    mode: 'Virtual',
    link: 'https://meet.google.com/hrc-camp-ms',
    venue: 'Virtual CodePair',
    interviewer: 'Azure Cloud Engineering Lead',
    status: 'Scheduled'
  },
  {
    studentName: 'Priya Nambiar',
    studentRoll: '21BIT045',
    companyName: 'Microsoft',
    jobTitle: 'Software Engineer (Cloud & Azure Services)',
    roundType: 'Technical Interview 1',
    date: '2026-09-12',
    time: '02:00 PM',
    mode: 'Virtual',
    link: 'https://meet.google.com/hrc-camp-ms',
    venue: 'Virtual CodePair',
    interviewer: 'Senior Staff Systems Architect',
    status: 'Scheduled'
  },
  {
    studentName: 'Ananya Verma',
    studentRoll: '21BCSE012',
    companyName: 'Razorpay',
    jobTitle: 'Software Development Engineer - I',
    roundType: 'Technical Screening',
    date: '2026-09-15',
    time: '10:30 AM',
    mode: 'In-Person',
    link: 'https://meet.google.com/hrc-camp-rzp',
    venue: 'Placement Cell Room 104',
    interviewer: 'Backend Tech Lead',
    status: 'Scheduled'
  }
];

async function ensureAdminSeeds() {
  if (await Company.countDocuments() === 0) {
    await Company.insertMany(INITIAL_COMPANIES_SEED);
  }
  if (await Announcement.countDocuments() === 0) {
    await Announcement.insertMany(INITIAL_ANNOUNCEMENTS_SEED);
  }
  if (await Interview.countDocuments() === 0) {
    await Interview.insertMany(INITIAL_INTERVIEWS_SEED);
  }
}

// GET /api/admin/stats - Real-time placement directorate metrics
export const getDashboardStats = async (req, res, next) => {
  try {
    await ensureAdminSeeds();

    const [
      totalStudents,
      totalJobs,
      liveDrives,
      pendingCompanies,
      pendingJobs,
      totalInterviews,
      placedProfiles,
      offeredApplications,
      offerLetters,
      drives
    ] = await Promise.all([
      StudentProfile.countDocuments(),
      Job.countDocuments(),
      PlacementDrive.countDocuments({ status: 'Live' }),
      Company.countDocuments({ status: 'Pending' }),
      Job.countDocuments({ approved: false }),
      Interview.countDocuments(),
      StudentProfile.countDocuments({ placedCompany: { $exists: true, $ne: null, $ne: '' } }),
      Application.countDocuments({ $or: [{ status: 'offered' }, { status: 'Offer' }, { status: 'Offered' }, { offerAccepted: true }] }),
      OfferLetter.find().lean(),
      PlacementDrive.find().lean()
    ]);

    // Compute genuine institutional placement numbers from real database records
    const studentCount = totalStudents;
    const placedCount = Math.min(studentCount, Math.max(placedProfiles, offeredApplications));
    const placementRate = studentCount > 0 ? Math.min(100, Math.round((placedCount / studentCount) * 100)) : 0;

    // Packages calculation from genuine offers & drives
    const packagesList = [];
    offerLetters.forEach(o => {
      const lpa = o.ctc?.totalLpa;
      if (typeof lpa === 'number' && !isNaN(lpa) && lpa > 0) {
        packagesList.push(lpa);
      }
    });

    drives.forEach(drv => {
      if (drv.ctcDisplay) {
        const match = drv.ctcDisplay.match(/(\d+(\.\d+)?)/);
        if (match) {
          const lpa = parseFloat(match[1]);
          const offeredCandidates = (drv.candidates || []).filter(c => c.status === 'Offered' || c.status === 'offered');
          if (offeredCandidates.length > 0) {
            offeredCandidates.forEach(() => packagesList.push(lpa));
          }
        }
      }
    });

    let averagePackage = '₹0.0 LPA';
    let highestPackage = '₹0.0 LPA';

    if (packagesList.length > 0) {
      const highest = Math.max(...packagesList);
      const avg = packagesList.reduce((a, b) => a + b, 0) / packagesList.length;
      highestPackage = `₹${highest.toFixed(1)} LPA`;
      averagePackage = `₹${avg.toFixed(1)} LPA`;
    }

    res.json({
      success: true,
      stats: {
        totalStudents: studentCount,
        placedStudents: placedCount,
        placementRate,
        totalJobs: totalJobs || 0,
        liveDrives: liveDrives || 0,
        pendingCompanyApprovals: pendingCompanies,
        pendingJobApprovals: pendingJobs,
        activeInterviews: totalInterviews || 0,
        averagePackage,
        highestPackage
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/companies - List companies with statuses
export const getCompanies = async (req, res, next) => {
  try {
    await ensureAdminSeeds();

    // Auto-sync any existing RecruiterProfile without a Company document into Company collection
    try {
      const recruiters = await RecruiterProfile.find().populate('user', 'name email').lean();
      for (const rp of recruiters) {
        if (rp?.companyName) {
          const exists = await Company.findOne({ name: rp.companyName });
          if (!exists) {
            await Company.create({
              name: rp.companyName,
              logo: '🏢',
              industry: 'Corporate Recruitment',
              location: 'India',
              contactPerson: rp.user?.name || 'Recruitment Head',
              contactEmail: rp.user?.email || 'recruiter@campus.edu',
              status: rp.isApproved ? 'Approved' : 'Pending',
            });
          }
        }
      }
    } catch (syncErr) {
      console.warn('Auto-sync recruiters error:', syncErr);
    }

    const companies = await Company.find().sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      companies: companies.map(c => ({ ...c, id: c._id.toString() }))
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/companies/:id/status - Approve or reject company
export const updateCompanyStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason, name } = req.body;
    let company = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      company = await Company.findById(req.params.id);
    }

    if (!company && req.params.id) {
      const escapedId = req.params.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      company = await Company.findOne({
        name: new RegExp(`^${escapedId}$`, 'i')
      });
    }

    if (!company && name) {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      company = await Company.findOne({
        name: new RegExp(`^${escapedName}$`, 'i')
      });
    }

    if (!company) {
      company = new Company({
        name: name || req.params.id || 'Campus Employer',
        status: status || 'Approved',
        logo: '🏢',
        industry: 'Corporate Recruitment',
        location: 'India',
        contactPerson: 'Corporate Relations',
        contactEmail: 'campus@recruitment.com'
      });
    }

    company.status = status;
    if (rejectionReason !== undefined) company.rejectionReason = rejectionReason;
    if (req.user?.id) company.verifiedBy = req.user.id;
    await company.save();

    // Sync isApproved status to all recruiter profiles with this company name
    try {
      await RecruiterProfile.updateMany(
        { companyName: company.name },
        { isApproved: status === 'Approved' }
      );
    } catch (rpErr) {
      console.warn('Sync RecruiterProfile error:', rpErr);
    }

    // Notify recruiter
    try {
      await Notification.create({
        title: `Company Verification: ${company.name} is ${status}`,
        message: status === 'Approved'
          ? `Your company profile for ${company.name} has been verified and approved by the Placement Cell. You can now post jobs and schedule drives.`
          : `Your company verification was rejected: ${rejectionReason || 'Criteria not met'}.`,
        type: 'status',
        role: 'recruiter'
      });
    } catch (e) {}

    res.json({
      success: true,
      message: `Company ${company.name} is now ${status}`,
      company: { ...company.toObject(), id: company._id.toString() }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/announcements - List notices
export const getAnnouncements = async (req, res, next) => {
  try {
    await ensureAdminSeeds();
    const announcements = await Announcement.find().sort({ pinned: -1, createdAt: -1 }).lean();
    res.json({
      success: true,
      announcements: announcements.map(a => ({ ...a, id: a._id.toString() }))
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/announcements - Publish notice with student notification broadcast
export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, category, badge, author, content, pinned, targetAudience } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const announcement = new Announcement({
      title,
      category: category || 'Placement Drive',
      badge: badge || 'Important',
      author: author || 'Training & Placement Office (TPO)',
      content,
      pinned: pinned !== undefined ? pinned : true,
      targetAudience: targetAudience || 'All',
      createdBy: req.user?.id
    });

    await announcement.save();

    // Broadcast persistent notification to students
    try {
      await Notification.create({
        title: `Notice: ${title}`,
        message: content.length > 120 ? `${content.slice(0, 117)}...` : content,
        type: 'announcement',
        role: 'student'
      });
    } catch (e) {}

    res.status(201).json({
      success: true,
      message: 'Campus notice published and broadcasted to students',
      announcement: { ...announcement.toObject(), id: announcement._id.toString() }
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/announcements/:id - Remove announcement
export const deleteAnnouncement = async (req, res, next) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Notice removed from board'
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/interviews - List scheduled interviews
export const getInterviews = async (req, res, next) => {
  try {
    await ensureAdminSeeds();
    const interviews = await Interview.find().sort({ date: 1, time: 1 }).lean();
    res.json({
      success: true,
      interviews: interviews.map(i => ({ ...i, id: i._id.toString() }))
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/interviews - Schedule interview round & dispatch invite
export const scheduleInterview = async (req, res, next) => {
  try {
    const {
      applicationId,
      studentName,
      studentRoll,
      studentEmail,
      companyName,
      jobTitle,
      roundType,
      date,
      time,
      mode,
      link,
      venue,
      interviewer
    } = req.body;

    if (!studentName || !companyName || !date || !time) {
      return res.status(400).json({ message: 'Candidate name, company, date, and time are required' });
    }

    const interview = new Interview({
      application: applicationId,
      studentName,
      studentRoll: studentRoll || '21BCSE104',
      studentEmail,
      companyName,
      jobTitle: jobTitle || 'Software Engineer',
      roundType: roundType || 'Technical Interview 1',
      date,
      time,
      mode: mode || 'Virtual',
      link: mode === 'Virtual' ? (link || 'https://meet.google.com/hrc-camp-tpo') : null,
      venue: mode === 'In-Person' ? (venue || 'Campus Placement Cell Room 204') : null,
      interviewer: interviewer || 'Senior Technical Lead',
      scheduledBy: req.user?.id
    });

    await interview.save();

    // If linked to an application, update application status
    if (applicationId) {
      try {
        await Application.findByIdAndUpdate(applicationId, {
          status: 'Interview Scheduled',
          interviewDetails: {
            round: interview.roundType,
            date: interview.date,
            time: interview.time,
            mode: interview.mode,
            link: interview.link,
            venue: interview.venue
          }
        });
      } catch (e) {}
    }

    // Send candidate interview alert notification
    try {
      await Notification.create({
        title: `Interview Scheduled: ${companyName} (${interview.roundType})`,
        message: `Your interview for ${companyName} is confirmed on ${date} at ${time}. Mode: ${interview.mode}. Link/Venue: ${interview.link || interview.venue}.`,
        type: 'interview',
        role: 'student'
      });
    } catch (e) {}

    res.status(201).json({
      success: true,
      message: `Interview for ${studentName} scheduled successfully!`,
      interview: { ...interview.toObject(), id: interview._id.toString() }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/students - List all student profiles with academic credentials
export const getStudents = async (req, res, next) => {
  try {
    const students = await StudentProfile.find().populate('user', 'name email').lean();
    res.json({
      success: true,
      students: students.map(s => ({
        id: s._id.toString(),
        name: s.user?.name || s.name || 'Candidate',
        email: s.user?.email || s.email,
        rollNumber: s.rollNumber,
        branch: s.branch,
        cgpa: s.cgpa,
        batch: s.batch || '2026',
        backlogs: s.backlogs || 0,
        isVerified: s.isVerified !== false,
        isBlocked: !!s.isBlocked,
        blockReason: s.blockReason,
        placedCompany: s.placedCompany,
        skills: s.skills || [],
        phone: s.phone || '',
        location: s.location || '',
        linkedin: s.linkedin || '',
        github: s.github || '',
        summary: s.summary || '',
        resumeUrl: s.resumeUrl || '',
        atsScore: s.atsScore,
        mockInterviewScore: s.mockInterviewScore
      }))
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/students/:id/verify - Verify student credentials
export const verifyStudent = async (req, res, next) => {
  try {
    const student = await StudentProfile.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.isVerified = true;
    await student.save();

    try {
      await Notification.create({
        user: student.user,
        title: 'Academic Profile Verified',
        message: 'Your university CGPA and academic credentials have been verified by the Training & Placement Office.',
        type: 'status',
        role: 'student'
      });
    } catch (e) {}

    res.json({
      success: true,
      message: 'Student verified successfully',
      student
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/students/:id/block - Toggle disciplinary freeze
export const toggleBlockStudent = async (req, res, next) => {
  try {
    const { blockReason } = req.body;
    const student = await StudentProfile.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.isBlocked = !student.isBlocked;
    student.blockReason = student.isBlocked ? (blockReason || 'Disciplinary hold') : null;
    await student.save();

    try {
      await Notification.create({
        user: student.user,
        title: student.isBlocked ? 'Placement Access Suspended' : 'Placement Access Restored',
        message: student.isBlocked
          ? `Your placement portal participation is on hold: ${student.blockReason}. Contact TPO.`
          : 'Your placement portal participation access has been reinstated.',
        type: 'status',
        role: 'student'
      });
    } catch (e) {}

    res.json({
      success: true,
      message: student.isBlocked ? 'Student placement access suspended' : 'Student access restored',
      student
    });
  } catch (err) {
    next(err);
  }
};
