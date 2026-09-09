import Notification from '../models/notification.model.js';

export const notificationService = {
  /**
   * Create and persist a single notification
   */
  async createNotification(data) {
    try {
      const notification = await Notification.create({
        recipient: data.recipient || null,
        role: data.role || 'all',
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        category: data.category || 'system',
        actionTarget: data.actionTarget || null,
      });
      return notification;
    } catch (err) {
      console.error('Error creating notification:', err.message);
      return null;
    }
  },

  /**
   * Broadcast notification to all users of a specific role (or 'all')
   */
  async broadcastToRole(role, data) {
    return this.createNotification({
      ...data,
      recipient: null,
      role: role || 'all',
    });
  },

  /**
   * Fetch notifications relevant to the authenticated user and active role
   */
  async getUserNotifications(userId, role, options = {}) {
    const { limit = 40, unreadOnly = false } = options;

    const query = {
      $or: [
        { recipient: userId },
        { role: role },
        { role: 'all' },
      ],
    };

    if (unreadOnly) {
      query.isRead = false;
    }

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .lean(),
      Notification.countDocuments({
        ...query,
        isRead: false,
      }),
    ]);

    return { notifications, unreadCount };
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId, userId, role) {
    const notification = await Notification.findOne({
      _id: notificationId,
      $or: [
        { recipient: userId },
        { role: role },
        { role: 'all' },
      ],
    });

    if (!notification) return null;

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
    return notification;
  },

  /**
   * Mark all notifications as read for this user and role
   */
  async markAllAsRead(userId, role) {
    const result = await Notification.updateMany(
      {
        $or: [
          { recipient: userId },
          { role: role },
          { role: 'all' },
        ],
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );
    return result;
  },

  /**
   * Delete a single notification
   */
  async deleteNotification(notificationId, userId, role) {
    const result = await Notification.findOneAndDelete({
      _id: notificationId,
      $or: [
        { recipient: userId },
        { role: role },
        { role: 'all' },
      ],
    });
    return result;
  },

  /**
   * Delete all read notifications for this user/role
   */
  async clearAllRead(userId, role) {
    const result = await Notification.deleteMany({
      $or: [
        { recipient: userId },
        { role: role },
        { role: 'all' },
      ],
      isRead: true,
    });
    return result;
  },
};

export default notificationService;
