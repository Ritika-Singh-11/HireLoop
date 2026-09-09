import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rollNumber: String, // added: your registration form collects this, previous schema didn't have it
    branch: String,
    cgpa: { type: Number, min: 0, max: 10 },
    batch: Number,
    skills: [String],
    resumeUrl: String,
    resumeFileName: String,
    resumeFileSize: Number,
    resumeUploadedAt: Date,
    resumeText: String, // Extracted plain text for AI ATS Scanner
    atsScore: Number, // Latest verified ATS diagnostic score (0-100)
    mockInterviewScore: Number, // Latest verified AI mock interview readiness score (0-100)
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
export default StudentProfile;
