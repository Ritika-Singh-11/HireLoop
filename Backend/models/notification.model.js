import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    // Specific recipient user, or null/absent if role broadcast
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null,
    },
    // The role audience for this notification
    role: {
      type: String,
      enum: ['student', 'recruiter', 'admin', 'all'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'urgent'],
      default: 'info',
    },
    category: {
      type: String,
      enum: ['application', 'drive', 'interview', 'approval', 'system', 'fraud'],
      default: 'system',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    // Optional navigation target when clicking on notification in UI
    actionTarget: {
      role: { type: String }, // 'student' | 'recruiter' | 'admin'
      tab: { type: String },  // 'applications', 'jobs', 'approvals', 'interviews', etc.
      meta: { type: mongoose.Schema.Types.Mixed },
    },
  },
  { timestamps: true }
);

// Compound indexes for fast querying of unread notifications by user or role
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ role: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
