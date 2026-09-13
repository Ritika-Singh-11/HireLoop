import PlacementDrive from '../models/placementDrive.model.js';
import EligibilityPolicy from '../models/eligibilityPolicy.model.js';
import StudentProfile from '../models/studentProfile.model.js';
import Application from '../models/application.model.js';
import OfferLetter from '../models/offerLetter.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import { evaluateStudentEligibility } from '../services/eligibility.service.js';

// Initial Seed Drives for Campus Placement
const INITIAL_DRIVES_SEED = [
  {
    companyName: 'Microsoft',
    companyLogo: '💻',
    roleTitle: 'Software Engineer (Cloud & Azure Services)',
    ctcDisplay: '₹28 - ₹32 LPA',
    tier: 'Super Dream',
    scheduledDate: '2026-09-12',
    venue: 'Main Auditorium & Google Meet',
    phases: ['Pre-Placement Talk', 'Online Assessment', 'Technical Round 1', 'Technical Round 2', 'HR & Offer'],
    currentPhase: 'Technical Round 1',
    status: 'Live',
    eligibilityCriteria: {
      minCgpa: 8.0,
      maxBacklogs: 0,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Comm.', 'Data Science & AI'],
      eligibleBatch: '2026',
      allowMultipleOffers: true
    },
    candidates: [
      {
        studentName: 'Aarav Sharma',
        studentRoll: '21BCSE104',
        studentBranch: 'Computer Science & Engineering',
        studentCgpa: 8.85,
        currentRound: 'Technical Round 1',
        status: 'Shortlisted',
        hallTicketCode: 'TPO-DRV-2026-MS-104',
        registeredAt: new Date('2026-08-20')
      },
      {
        studentName: 'Priya Nambiar',
        studentRoll: '21BIT045',
        studentBranch: 'Information Technology',
        studentCgpa: 9.12,
        currentRound: 'Technical Round 1',
        status: 'Shortlisted',
        hallTicketCode: 'TPO-DRV-2026-MS-045',
        registeredAt: new Date('2026-08-20')
      }
    ]
  },
  {
    companyName: 'Razorpay',
    companyLogo: '💳',
    roleTitle: 'Software Development Engineer - I (Full Stack)',
    ctcDisplay: '₹18 - ₹22 LPA',
    tier: 'Dream',
    scheduledDate: '2026-09-15',
    venue: 'Campus Lab 4 & CodePair Virtual',
    phases: ['Pre-Placement Talk', 'Online Assessment', 'Technical Interview', 'Executive Round', 'Offer Extension'],
    currentPhase: 'Online Assessment',
    status: 'Live',
    eligibilityCriteria: {
      minCgpa: 7.5,
      maxBacklogs: 0,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Comm.', 'Electrical Engg.'],
      eligibleBatch: '2026',
      allowMultipleOffers: true
    },
    candidates: [
      {
        studentName: 'Aarav Sharma',
        studentRoll: '21BCSE104',
        studentBranch: 'Computer Science & Engineering',
        studentCgpa: 8.85,
        currentRound: 'Online Assessment',
        status: 'Shortlisted',
        hallTicketCode: 'TPO-DRV-2026-RZ-104',
        registeredAt: new Date('2026-08-22')
      }
    ]
  },
  {
    companyName: 'Zomato',
    companyLogo: '🍔',
    roleTitle: 'Backend Engineer - Platform & Growth',
    ctcDisplay: '₹16 - ₹20 LPA',
    tier: 'Dream',
    scheduledDate: '2026-08-30',
    venue: 'Placement Office Room 102',
    phases: ['Coding Test', 'Technical Round', 'HR Discussion', 'Offer Extension'],
    currentPhase: 'Offer Extension',
    status: 'Completed',
    eligibilityCriteria: {
      minCgpa: 7.0,
      maxBacklogs: 1,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Data Science & AI'],
      eligibleBatch: '2026',
      allowMultipleOffers: false
    },
    candidates: [
      {
        studentName: 'Tanmay Saxena',
        studentRoll: '21BCSE089',
        studentBranch: 'Computer Science & Engineering',
        studentCgpa: 8.95,
        currentRound: 'Offer Extension',
        status: 'Offered',
        hallTicketCode: 'TPO-DRV-2026-ZM-089',
        registeredAt: new Date('2026-08-15')
      }
    ]
  },
  {
    companyName: 'Deloitte',
    companyLogo: '🏢',
    roleTitle: 'Associate Technology Consultant',
    ctcDisplay: '₹11 - ₹14 LPA',
    tier: 'Standard',
    scheduledDate: '2026-09-22',
    venue: 'Campus Amphitheatre & Interview Rooms',
    phases: ['Pre-Placement Talk', 'Aptitude Test', 'Group Discussion', 'Personal Interview'],
    currentPhase: 'Pre-Placement Talk',
    status: 'Upcoming',
    eligibilityCriteria: {
      minCgpa: 6.5,
      maxBacklogs: 1,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Comm.', 'Electrical Engg.', 'Mechanical Engg.', 'Civil Engg.'],
      eligibleBatch: '2026',
      allowMultipleOffers: true
    },
    candidates: []
  }
];

// Seed Helper
async function ensureDrivesSeeded() {
  const count = await PlacementDrive.countDocuments();
  if (count === 0) {
    await PlacementDrive.insertMany(INITIAL_DRIVES_SEED);
  }
}

// GET /api/drives - List all placement drives
export const getDrives = async (req, res, next) => {
  try {
    await ensureDrivesSeeded();

    const drives = await PlacementDrive.find().sort({ scheduledDate: 1 }).lean();

    // Map counts and candidate summary
    const formatted = drives.map(d => ({
      ...d,
      id: d._id.toString(),
      registeredCount: d.candidates ? d.candidates.length : 0,
      shortlistedCount: d.candidates ? d.candidates.filter(c => ['Shortlisted', 'Offered'].includes(c.status)).length : 0,
      offeredCount: d.candidates ? d.candidates.filter(c => c.status === 'Offered').length : 0
    }));

    res.json({
      success: true,
      drives: formatted
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/drives/:id - Get single drive with full candidate roster
export const getDriveById = async (req, res, next) => {
  try {
    await ensureDrivesSeeded();
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Placement drive not found' });
    }

    res.json({
      success: true,
      drive: {
        ...drive.toObject(),
        id: drive._id.toString()
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/drives - Create new campus recruitment drive (TPO / Admin)
export const createDrive = async (req, res, next) => {
  try {
    const {
      companyName,
      companyLogo,
      roleTitle,
      ctcDisplay,
      tier,
      scheduledDate,
      venue,
      phases,
      eligibilityCriteria
    } = req.body;

    if (!companyName || !roleTitle) {
      return res.status(400).json({ message: 'Company name and role title are required' });
    }

    const drive = new PlacementDrive({
      companyName,
      companyLogo: companyLogo || '🏢',
      roleTitle,
      ctcDisplay: ctcDisplay || '₹14 - ₹18 LPA',
      tier: tier || 'Dream',
      scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
      venue: venue || 'Campus Placement Center',
      phases: phases && phases.length ? phases : [
        'Pre-Placement Talk',
        'Online Assessment',
        'Technical Round 1',
        'Technical Round 2',
        'HR & Offer Extension'
      ],
      currentPhase: phases ? phases[0] : 'Pre-Placement Talk',
      status: 'Live',
      eligibilityCriteria: eligibilityCriteria || {
        minCgpa: 7.0,
        maxBacklogs: 0,
        allowedBranches: ['Computer Science & Engineering', 'Information Technology'],
        eligibleBatch: '2026',
        allowMultipleOffers: true
      },
      createdBy: req.user?.id
    });

    await drive.save();

    // Broadcast notice to all students
    try {
      await Notification.create({
        title: `New Campus Drive Announced: ${companyName}`,
        message: `${companyName} announced recruitment drive for ${roleTitle} (${drive.ctcDisplay}). Check your eligibility and register.`,
        type: 'drive',
        role: 'student'
      });
    } catch (e) {}

    res.status(201).json({
      success: true,
      message: 'Placement drive created and published successfully',
      drive: {
        ...drive.toObject(),
        id: drive._id.toString()
      }
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/drives/:id/phase - Advance drive round/phase
export const updateDrivePhase = async (req, res, next) => {
  try {
    const { phase, status } = req.body;
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Placement drive not found' });
    }

    if (phase) {
      drive.currentPhase = phase;
    }
    if (status) {
      drive.status = status;
    }

    await drive.save();

    // Send round progression notification to registered candidates
    try {
      await Notification.create({
        title: `Drive Update: ${drive.companyName} Advanced to ${drive.currentPhase}`,
        message: `The campus drive for ${drive.companyName} has moved to ${drive.currentPhase}. Check your status in the placement portal.`,
        type: 'drive',
        role: 'student'
      });
    } catch (e) {}

    res.json({
      success: true,
      message: `Drive successfully advanced to ${drive.currentPhase}`,
      drive: {
        ...drive.toObject(),
        id: drive._id.toString()
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/drives/:id/register - Student registers for placement drive with automated eligibility
export const registerForDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Placement drive not found' });
    }

    // Get student profile or user context
    let studentData = null;
    if (req.user?.id) {
      const profile = await StudentProfile.findOne({ user: req.user.id });
      const user = await User.findById(req.user.id);
      if (profile) {
        studentData = {
          name: user?.name || profile.name || 'Candidate',
          rollNumber: profile.rollNumber || user?.rollNumber || '21BCSE104',
          branch: profile.branch || 'Computer Science & Engineering',
          cgpa: profile.cgpa || 8.85,
          batch: profile.batch || '2026',
          backlogs: profile.backlogs || 0,
          isBlocked: profile.isBlocked || false,
          isVerified: profile.isVerified !== false
        };
      }
    }

    // Fallback if testing as guest or payload passed
    if (!studentData) {
      studentData = {
        name: req.body.name || 'Aarav Sharma',
        rollNumber: req.body.rollNumber || '21BCSE104',
        branch: req.body.branch || 'Computer Science & Engineering',
        cgpa: req.body.cgpa ? parseFloat(req.body.cgpa) : 8.85,
        batch: req.body.batch || '2026',
        backlogs: req.body.backlogs ? parseInt(req.body.backlogs) : 0,
        isBlocked: false,
        isVerified: true
      };
    }

    // Check automated eligibility gate
    const policy = await EligibilityPolicy.findOne().lean();
    const evalResult = evaluateStudentEligibility(studentData, drive.eligibilityCriteria, policy);

    if (!evalResult.isEligible) {
      return res.status(403).json({
        success: false,
        message: 'Eligibility criteria not met under University Placement Directorate Policy',
        reasons: evalResult.reasons,
        collegeReasons: evalResult.collegeReasons,
        companyReasons: evalResult.companyReasons,
        checks: evalResult.checks
      });
    }

    // Check if already registered
    const existing = drive.candidates.find(c => 
      c.studentRoll === studentData.rollNumber || 
      (req.user?.id && c.student?.toString() === req.user.id.toString())
    );

    if (existing) {
      return res.json({
        success: true,
        message: 'Already registered for this drive',
        candidate: existing,
        hallTicketCode: existing.hallTicketCode
      });
    }

    // Generate unique Hall Ticket Pass Code
    const cleanCompany = drive.companyName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
    const cleanRoll = studentData.rollNumber.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
    const hallTicketCode = `TPO-DRV-2026-${cleanCompany}-${cleanRoll}`;

    const newCandidate = {
      student: req.user?.id,
      studentName: studentData.name,
      studentRoll: studentData.rollNumber,
      studentBranch: studentData.branch,
      studentCgpa: studentData.cgpa,
      currentRound: drive.currentPhase,
      status: 'Registered',
      hallTicketCode,
      registeredAt: new Date()
    };

    drive.candidates.push(newCandidate);
    await drive.save();

    // Push notification with hall ticket
    try {
      await Notification.create({
        user: req.user?.id,
        title: `Registration Confirmed: ${drive.companyName}`,
        message: `Your Hall Ticket Pass ${hallTicketCode} has been generated for ${drive.companyName}. Venue: ${drive.venue}.`,
        type: 'drive',
        role: 'student'
      });
    } catch (e) {}

    res.status(201).json({
      success: true,
      message: `Successfully registered for ${drive.companyName} recruitment drive!`,
      hallTicketCode,
      candidate: newCandidate
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/drives/:id/candidate - TPO advances candidate round or extends offer
export const updateCandidateStatus = async (req, res, next) => {
  try {
    const { candidateId, status, currentRound } = req.body;
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    const candidate = drive.candidates.id(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate registration not found' });
    }

    if (status) candidate.status = status;
    if (currentRound) candidate.currentRound = currentRound;

    await drive.save();

    res.json({
      success: true,
      message: `Candidate ${candidate.studentName} updated to ${candidate.status}`,
      candidate
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/drives/policy/global - Fetch institutional placement eligibility policy
export const getEligibilityPolicy = async (req, res, next) => {
  try {
    let policy = await EligibilityPolicy.findOne();
    if (!policy) {
      policy = await EligibilityPolicy.create({
        minCgpa: 7.0,
        maxBacklogs: 0,
        eligibleBatch: '2026',
        allowedBranches: [
          'Computer Science & Engineering',
          'Information Technology',
          'Electronics & Comm.',
          'Electrical Engg.',
          'Mechanical Engg.',
          'Civil Engg.',
          'Data Science & AI'
        ],
        allowMultipleOffers: true,
        dreamThreshold: 15.0,
        superDreamThreshold: 25.0
      });
    }

    res.json({
      success: true,
      policy
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/drives/policy/global - Update institutional placement policy (TPO Directorate)
export const updateEligibilityPolicy = async (req, res, next) => {
  try {
    let policy = await EligibilityPolicy.findOne();
    if (!policy) {
      policy = new EligibilityPolicy(req.body);
    } else {
      Object.assign(policy, req.body);
    }
    await policy.save();

    res.json({
      success: true,
      message: 'University placement eligibility rules saved and published',
      policy
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/drives/reports/nirf - Aggregated NIRF / NAAC Accreditation Statistical Metrics
export const getPlacementReports = async (req, res, next) => {
  try {
    await ensureDrivesSeeded();

    const [drives, profiles, applications, offers] = await Promise.all([
      PlacementDrive.find().lean(),
      StudentProfile.find().lean(),
      Application.find().populate('job').lean(),
      OfferLetter.find().lean()
    ]);

    const totalEnrolled = profiles.length;

    // Track placed student keys (student profile id, user id, or roll number)
    const placedStudentKeys = new Set();
    const branchDataMap = {};

    profiles.forEach(p => {
      const b = p.branch || 'Computer Science & Engineering';
      if (!branchDataMap[b]) {
        branchDataMap[b] = { branch: b, enrolled: 0, placed: 0, packages: [] };
      }
      branchDataMap[b].enrolled += 1;
      if (p.placedCompany && p.placedCompany.trim()) {
        placedStudentKeys.add(p._id.toString());
        if (p.user) placedStudentKeys.add(p.user.toString());
        if (p.rollNumber) placedStudentKeys.add(p.rollNumber);
        branchDataMap[b].placed += 1;
      }
    });

    // Packages list for genuine statistics
    const packagesList = [];

    // Collect from OfferLetter
    offers.forEach(o => {
      if (o.student) placedStudentKeys.add(o.student.toString());
      const totalLpa = o.ctc?.totalLpa;
      if (typeof totalLpa === 'number' && !isNaN(totalLpa) && totalLpa > 0) {
        packagesList.push({ lpa: totalLpa, company: o.companyName || 'Campus Recruiter' });
      }
    });

    // Collect from Applications with offer
    applications.forEach(a => {
      const isOffer = a.status && ['offered', 'offer'].includes(a.status.toLowerCase());
      if (isOffer && a.student) {
        placedStudentKeys.add(a.student._id ? a.student._id.toString() : a.student.toString());
        const jobLpa = a.job?.ctcMax || a.job?.ctcMin;
        if (typeof jobLpa === 'number' && !isNaN(jobLpa) && jobLpa > 0) {
          packagesList.push({ lpa: jobLpa, company: a.job?.title || 'Campus Recruiter' });
        }
      }
    });

    // Collect from candidates marked Offered in Placement Drives
    drives.forEach(drv => {
      let drvLpa = 0;
      if (drv.ctcDisplay) {
        const match = drv.ctcDisplay.match(/(\d+(\.\d+)?)/);
        if (match) drvLpa = parseFloat(match[1]);
      }
      (drv.candidates || []).forEach(cand => {
        if (cand.status === 'Offered' || cand.status === 'offered') {
          if (cand.studentRoll) placedStudentKeys.add(cand.studentRoll);
          if (cand.student) placedStudentKeys.add(cand.student.toString());
          const b = cand.studentBranch || 'Computer Science & Engineering';
          if (!branchDataMap[b]) {
            branchDataMap[b] = { branch: b, enrolled: 1, placed: 1, packages: [] };
          } else {
            branchDataMap[b].placed = Math.min(branchDataMap[b].enrolled, branchDataMap[b].placed + 1);
          }
          if (drvLpa > 0) {
            packagesList.push({ lpa: drvLpa, company: drv.companyName || 'Recruiter' });
          }
        }
      });
    });

    const placedStudents = totalEnrolled > 0
      ? Math.min(totalEnrolled, Math.max(placedStudentKeys.size, profiles.filter(p => p.placedCompany).length))
      : placedStudentKeys.size;
    const placementRate = totalEnrolled > 0 ? Math.round((placedStudents / totalEnrolled) * 100) : 0;

    // Package statistical computation
    let highestPackage = '₹0.0 LPA';
    let averagePackage = '₹0.0 LPA';
    let medianPackage = '₹0.0 LPA';

    if (packagesList.length > 0) {
      packagesList.sort((a, b) => a.lpa - b.lpa);
      const maxPkg = packagesList[packagesList.length - 1];
      highestPackage = `₹${maxPkg.lpa.toFixed(1)} LPA (${maxPkg.company})`;

      const sum = packagesList.reduce((acc, curr) => acc + curr.lpa, 0);
      const avg = sum / packagesList.length;
      averagePackage = `₹${avg.toFixed(1)} LPA`;

      const mid = Math.floor(packagesList.length / 2);
      const med = packagesList.length % 2 !== 0
        ? packagesList[mid].lpa
        : (packagesList[mid - 1].lpa + packagesList[mid].lpa) / 2;
      medianPackage = `₹${med.toFixed(1)} LPA`;
    }

    // Branch stats array
    const branchStats = Object.values(branchDataMap).map(b => {
      const pct = b.enrolled > 0 ? Math.round((b.placed / b.enrolled) * 1000) / 10 : 0;
      return {
        branch: b.branch,
        enrolled: b.enrolled,
        placed: b.placed,
        percentage: pct,
        medianCtc: medianPackage !== '₹0.0 LPA' ? medianPackage : '₹12.0 LPA'
      };
    });

    // Package tiers
    const superDream = packagesList.filter(p => p.lpa >= 20).length;
    const dream = packagesList.filter(p => p.lpa >= 12 && p.lpa < 20).length;
    const standard = packagesList.filter(p => p.lpa < 12).length;
    const totalPkgCount = packagesList.length || 1;

    const packageTiers = [
      { tier: 'Super Dream (> ₹20 LPA)', count: superDream, percentage: Math.round((superDream / totalPkgCount) * 1000) / 10 },
      { tier: 'Dream (₹12 - ₹20 LPA)', count: dream, percentage: Math.round((dream / totalPkgCount) * 1000) / 10 },
      { tier: 'Standard (₹6 - ₹12 LPA)', count: standard, percentage: Math.round((standard / totalPkgCount) * 1000) / 10 }
    ];

    res.json({
      success: true,
      report: {
        academicYear: '2025 - 2026',
        totalEnrolled,
        placedStudents,
        placementRate,
        highestPackage,
        averagePackage,
        medianPackage,
        totalDrivesConducted: drives.length,
        branchStats: branchStats.length > 0 ? branchStats : [
          { branch: 'Computer Science & Engineering', enrolled: totalEnrolled, placed: placedStudents, percentage: placementRate, medianCtc: medianPackage }
        ],
        packageTiers
      }
    });
  } catch (err) {
    next(err);
  }
};
