import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interview_scheduled', 'offered', 'rejected'],
      default: 'applied',
    },
    atsScore: Number, // filled in later by the Gemini ATS scorer (Phase 4)
    resumeUrl: { type: String, required: true },
    coverLetter: String,
    recruiterNotes: String, // internal feedback, only recruiter/admin can see
  },
  { timestamps: true }
);

// A student can only apply once per job
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
