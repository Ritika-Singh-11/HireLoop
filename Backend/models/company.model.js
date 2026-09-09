import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  logo: {
    type: String,
    default: '🏢'
  },
  industry: {
    type: String,
    default: 'Information Technology'
  },
  location: {
    type: String,
    default: 'Bangalore, India'
  },
  website: {
    type: String
  },
  contactPerson: {
    type: String,
    default: 'Campus Talent Acquisition'
  },
  contactEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Rejected'],
    default: 'Approved'
  },
  rejectionReason: {
    type: String
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);
export default Company;
