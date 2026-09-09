import mongoose from 'mongoose';

const offerLetterSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecruiterProfile',
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '🏢',
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    ctc: {
      totalLpa: { type: Number, required: true },
      baseLpa: { type: Number, required: true },
      variableBonusLpa: { type: Number, default: 0 },
      joiningBonus: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    probationPeriodMonths: {
      type: Number,
      default: 6,
    },
    offerCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    signatoryName: {
      type: String,
      required: true,
    },
    signatoryTitle: {
      type: String,
      default: 'Head of Talent Acquisition & Campus Hiring',
    },
    status: {
      type: String,
      enum: ['issued', 'accepted', 'declined', 'withdrawn'],
      default: 'issued',
      index: true,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    declinedAt: {
      type: Date,
      default: null,
    },
    termsAndConditions: {
      type: [String],
      default: [
        'The candidate must maintain satisfactory academic performance and complete all degree requirements with zero active backlogs.',
        'This employment is governed by the standard 6-month probation policy with full campus placement medical clearance.',
        'Formal joining documentation and original transcripts must be submitted on or before the declared date of joining.',
      ],
    },
  },
  { timestamps: true }
);

const OfferLetter = mongoose.model('OfferLetter', offerLetterSchema);
export default OfferLetter;
