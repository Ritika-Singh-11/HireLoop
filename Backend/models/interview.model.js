import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: false
  },
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
  studentEmail: {
    type: String
  },
  companyName: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  roundType: {
    type: String,
    enum: [
      'Technical Screening',
      'Technical Interview 1',
      'Technical Interview 2',
      'System Design Round',
      'Managerial / Executive Round',
      'HR & Cultural Fit'
    ],
    default: 'Technical Interview 1'
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['Virtual', 'In-Person'],
    default: 'Virtual'
  },
  link: {
    type: String,
    default: 'https://meet.google.com/hrc-camp-tpo'
  },
  venue: {
    type: String,
    default: 'Campus Placement Cell Room 204'
  },
  interviewer: {
    type: String,
    default: 'Senior Technical Lead'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
    default: 'Scheduled'
  },
  feedback: {
    type: String
  },
  scheduledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
