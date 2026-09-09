import PlacementDrive from '../models/placementDrive.model.js';
import EligibilityPolicy from '../models/eligibilityPolicy.model.js';
import StudentProfile from '../models/studentProfile.model.js';
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
        message: 'Eligibility criteria not met for this campus recruitment drive',
        reasons: evalResult.reasons,
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

    const drives = await PlacementDrive.find().lean();
    
    // Sample accreditation aggregate numbers
    const totalEnrolled = 640;
    const placedStudents = 541;
    const placementRate = Math.round((placedStudents / totalEnrolled) * 100);

    const branchStats = [
      { branch: 'Computer Science & Engineering', enrolled: 180, placed: 172, percentage: 95.5, medianCtc: '₹18.5 LPA' },
      { branch: 'Information Technology', enrolled: 120, placed: 114, percentage: 95.0, medianCtc: '₹16.2 LPA' },
      { branch: 'Electronics & Comm.', enrolled: 120, placed: 102, percentage: 85.0, medianCtc: '₹12.0 LPA' },
      { branch: 'Electrical Engg.', enrolled: 80, placed: 64, percentage: 80.0, medianCtc: '₹9.5 LPA' },
      { branch: 'Mechanical Engg.', enrolled: 80, placed: 52, percentage: 65.0, medianCtc: '₹8.5 LPA' },
      { branch: 'Civil Engg.', enrolled: 60, placed: 37, percentage: 61.6, medianCtc: '₹7.8 LPA' }
    ];

    const packageTiers = [
      { tier: 'Super Dream (> ₹20 LPA)', count: 98, percentage: 18.1 },
      { tier: 'Dream (₹12 - ₹20 LPA)', count: 245, percentage: 45.3 },
      { tier: 'Standard (₹6 - ₹12 LPA)', count: 198, percentage: 36.6 }
    ];

    res.json({
      success: true,
      report: {
        academicYear: '2025 - 2026',
        totalEnrolled,
        placedStudents,
        placementRate,
        highestPackage: '₹48.0 LPA (Google)',
        averagePackage: '₹14.2 LPA',
        medianPackage: '₹12.8 LPA',
        totalDrivesConducted: drives.length,
        branchStats,
        packageTiers
      }
    });
  } catch (err) {
    next(err);
  }
};
