import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  studentName: {
    type: String,
    required: true
  },
  studentRoll: {
    type: String,
    required: true
  },
  studentBranch: {
    type: String,
    required: true
  },
  studentCgpa: {
    type: Number,
    required: true
  },
  currentRound: {
    type: String,
    default: 'Pre-Placement Talk'
  },
  status: {
    type: String,
    enum: ['Registered', 'Shortlisted', 'Eliminated', 'Offered'],
    default: 'Registered'
  },
  hallTicketCode: {
    type: String,
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const placementDriveSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  companyLogo: {
    type: String,
    default: '🏢'
  },
  roleTitle: {
    type: String,
    required: true,
    trim: true
  },
  ctcDisplay: {
    type: String,
    required: true,
    default: '₹12 - ₹18 LPA'
  },
  tier: {
    type: String,
    enum: ['Standard', 'Dream', 'Super Dream'],
    default: 'Dream'
  },
  scheduledDate: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    default: 'Campus Placement Lab & Google Meet'
  },
  phases: {
    type: [String],
    default: [
      'Pre-Placement Talk',
      'Online Assessment',
      'Technical Interview 1',
      'Technical Interview 2',
      'HR & Offer Extension'
    ]
  },
  currentPhase: {
    type: String,
    default: 'Pre-Placement Talk'
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Live', 'Completed', 'Cancelled'],
    default: 'Live'
  },
  eligibilityCriteria: {
    minCgpa: {
      type: Number,
      default: 7.0
    },
    maxBacklogs: {
      type: Number,
      default: 0
    },
    allowedBranches: {
      type: [String],
      default: [
        'Computer Science & Engineering',
        'Information Technology',
        'Electronics & Comm.',
        'Electrical Engg.',
        'Mechanical Engg.',
        'Civil Engg.',
        'Data Science & AI'
      ]
    },
    eligibleBatch: {
      type: String,
      default: '2026'
    },
    allowMultipleOffers: {
      type: Boolean,
      default: true
    }
  },
  candidates: [candidateSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const PlacementDrive = mongoose.model('PlacementDrive', placementDriveSchema);
export default PlacementDrive;
