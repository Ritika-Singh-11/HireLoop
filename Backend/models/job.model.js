import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecruiterProfile',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    roleType: { type: String, enum: ['full_time', 'internship', 'ppo'], default: 'full_time' },
    eligibleBranches: [String], // e.g. ['CSE', 'ECE', 'ME']
    minCgpa: { type: Number, min: 0, max: 10, default: 0 },
    batch: { type: Number, required: true }, // graduation year e.g. 2026
    ctcMin: { type: Number, required: true },
    ctcMax: { type: Number, required: true },
    skillsRequired: [String],
    deadline: { type: Date, required: true },

    // Admin moderation - job is invisible to students until approved
    isApproved: { type: Boolean, default: false },
    rejectionReason: String,

    // Set true once the recruiter has paid the listing fee sandbox checkout.
    // A job can be paid but still waiting on admin approval.
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Common query patterns: students filtering the approved job board
jobSchema.index({ isApproved: 1, batch: 1, eligibleBranches: 1 });

const Job = mongoose.model('Job', jobSchema);
export default Job;
