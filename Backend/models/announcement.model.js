import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Placement Drive', 'Policy Update', 'Assessment Schedule', 'Results & Shortlists', 'General Advisory'],
    default: 'Placement Drive'
  },
  badge: {
    type: String,
    enum: ['Urgent', 'Important', 'Drive', 'Result', 'Notice'],
    default: 'Important'
  },
  author: {
    type: String,
    default: 'Training & Placement Office (TPO)'
  },
  content: {
    type: String,
    required: true
  },
  pinned: {
    type: Boolean,
    default: true
  },
  targetAudience: {
    type: String,
    enum: ['All', 'Computer Science', 'Information Technology', 'Circuital', 'Core Engineering', 'Unplaced Only'],
    default: 'All'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
