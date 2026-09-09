import OfferLetter from '../models/offerLetter.model.js';
import Application from '../models/application.model.js';
import StudentProfile from '../models/studentProfile.model.js';
import RecruiterProfile from '../models/recruiterProfile.model.js';
import Job from '../models/job.model.js';
import notificationService from '../services/notification.service.js';

// POST /api/offers - Issue a new offer letter
export const issueOfferLetter = async (req, res, next) => {
  try {
    const {
      applicationId,
      designation,
      ctc,
      joiningDate,
      location,
      probationPeriodMonths,
      signatoryName,
      signatoryTitle,
      termsAndConditions,
    } = req.body;

    if (!applicationId || !designation || !ctc?.totalLpa || !joiningDate || !location) {
      return res.status(400).json({
        message: 'Application ID, designation, CTC total, joining date, and location are required',
      });
    }

    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('student');

    if (!application) {
      return res.status(404).json({ message: 'Application record not found' });
    }

    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user.id });
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && (!recruiterProfile || application.job.recruiter.toString() !== recruiterProfile._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to issue offer for this job' });
    }

    // Generate unique verifiable offer serial
    const offerCode = `TPC-OFFER-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const offerLetter = await OfferLetter.create({
      application: application._id,
      student: application.student._id,
      job: application.job._id,
      recruiter: application.job.recruiter,
      companyName: recruiterProfile?.companyName || application.job.recruiter?.companyName || 'Corporate Recruiter',
      companyLogo: recruiterProfile?.companyLogo || '🏢',
      designation,
      ctc: {
        totalLpa: Number(ctc.totalLpa),
        baseLpa: Number(ctc.baseLpa || ctc.totalLpa * 0.8),
        variableBonusLpa: Number(ctc.variableBonusLpa || 0),
        joiningBonus: Number(ctc.joiningBonus || 0),
        currency: ctc.currency || 'INR',
      },
      joiningDate: new Date(joiningDate),
      location,
      probationPeriodMonths: probationPeriodMonths || 6,
      offerCode,
      signatoryName: signatoryName || req.user.name || 'Authorized Signatory',
      signatoryTitle: signatoryTitle || 'Head of Talent Acquisition & Campus Hiring',
      termsAndConditions: termsAndConditions && termsAndConditions.length > 0 ? termsAndConditions : undefined,
    });

    // Update application status to offered
    application.status = 'offered';
    await application.save();

    // Notify student about the official offer letter
    if (application.student?.user) {
      await notificationService.createNotification({
        recipient: application.student.user,
        role: 'student',
        title: `🎉 Official Placement Offer: ${application.job.title}`,
        message: `Congratulations! ${offerLetter.companyName} has issued your official campus placement offer letter (${offerLetter.ctc.totalLpa} LPA). Code: ${offerCode}.`,
        type: 'success',
        category: 'application',
        actionTarget: { role: 'student', tab: 'applications' },
      });
    }

    // Notify TPO Directorate about the campus placement milestone
    await notificationService.broadcastToRole('admin', {
      title: `Campus Placement Placed: ${application.job.title}`,
      message: `Candidate matched with ${offerLetter.companyName} for ${offerLetter.ctc.totalLpa} LPA CTC.`,
      type: 'success',
      category: 'drive',
      actionTarget: { role: 'admin', tab: 'applications' },
    });

    res.status(201).json({ message: 'Offer letter issued successfully', offerLetter });
  } catch (err) {
    next(err);
  }
};

// GET /api/offers/my-offers - (Student)
export const getMyOffers = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const offers = await OfferLetter.find({ student: studentProfile._id })
      .populate('job', 'title ctcMin ctcMax roleType')
      .populate('recruiter', 'companyName website')
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (err) {
    next(err);
  }
};

// GET /api/offers/job/:jobId - (Recruiter / Admin)
export const getJobOffers = async (req, res, next) => {
  try {
    const offers = await OfferLetter.find({ job: req.params.jobId })
      .populate('student')
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (err) {
    next(err);
  }
};

// GET /api/offers/:id - Single offer details
export const getOfferById = async (req, res, next) => {
  try {
    const offer = await OfferLetter.findById(req.params.id)
      .populate('student')
      .populate('job')
      .populate('recruiter');

    if (!offer) {
      return res.status(404).json({ message: 'Offer letter not found' });
    }

    res.json(offer);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/offers/:id/accept - (Student)
export const acceptOffer = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const offer = await OfferLetter.findOne({
      _id: req.params.id,
      student: studentProfile._id,
    }).populate('recruiter');

    if (!offer) {
      return res.status(404).json({ message: 'Offer letter not found' });
    }

    offer.status = 'accepted';
    offer.acceptedAt = new Date();
    await offer.save();

    // Notify Recruiter
    if (offer.recruiter?.user) {
      await notificationService.createNotification({
        recipient: offer.recruiter.user,
        role: 'recruiter',
        title: 'Offer Accepted by Candidate',
        message: `Candidate has formally accepted your placement offer for "${offer.designation}". Verification code: ${offer.offerCode}.`,
        type: 'success',
        category: 'application',
        actionTarget: { role: 'recruiter', tab: 'applicants' },
      });
    }

    // Notify TPO
    await notificationService.broadcastToRole('admin', {
      title: `Offer Formal Acceptance: ${offer.companyName}`,
      message: `Student formally accepted campus placement contract at ${offer.companyName}.`,
      type: 'success',
      category: 'approval',
      actionTarget: { role: 'admin', tab: 'analytics' },
    });

    res.json({ message: 'Offer accepted successfully', offer });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/offers/:id/decline - (Student)
export const declineOffer = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const offer = await OfferLetter.findOne({
      _id: req.params.id,
      student: studentProfile._id,
    });

    if (!offer) {
      return res.status(404).json({ message: 'Offer letter not found' });
    }

    offer.status = 'declined';
    offer.declinedAt = new Date();
    await offer.save();

    res.json({ message: 'Offer declined', offer });
  } catch (err) {
    next(err);
  }
};
