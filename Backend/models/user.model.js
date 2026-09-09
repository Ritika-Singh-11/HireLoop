import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String, // absent for OAuth-only users
      select: false, // never returned by default queries
    },
    name: String,
    avatar: String,
    role: {
      type: String,
      enum: ['student', 'recruiter', 'admin'],
      required: true,
      default: 'student',
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local',
    },
    providerId: String, // Google/GitHub user id, absent for local accounts
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password only when it's set/changed, and only for local accounts
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidate) {
  if (!this.password) return Promise.resolve(false); // OAuth-only account
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
