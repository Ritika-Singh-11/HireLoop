import mongoose from 'mongoose';

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true },
    isApproved: { type: Boolean, default: false }, // admin must approve before posting jobs
  },
  { timestamps: true }
);

const RecruiterProfile = mongoose.model('RecruiterProfile', recruiterProfileSchema);
export default RecruiterProfile;
