import mongoose from 'mongoose';

const eligibilityPolicySchema = new mongoose.Schema({
  minCgpa: {
    type: Number,
    default: 7.0,
    required: true
  },
  maxBacklogs: {
    type: Number,
    default: 0,
    required: true
  },
  eligibleBatch: {
    type: String,
    default: '2026',
    required: true
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
  allowMultipleOffers: {
    type: Boolean,
    default: true
  },
  dreamThreshold: {
    type: Number,
    default: 15.0 // LPA
  },
  superDreamThreshold: {
    type: Number,
    default: 25.0 // LPA
  },
  minAttendancePercentage: {
    type: Number,
    default: 75
  },
  resumeFreezeDate: {
    type: String,
    default: '2026-09-30'
  }
}, {
  timestamps: true
});

const EligibilityPolicy = mongoose.model('EligibilityPolicy', eligibilityPolicySchema);
export default EligibilityPolicy;
