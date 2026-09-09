import notificationService from '../services/notification.service.js';

// GET /api/notifications?role=student&unreadOnly=false&limit=40
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.query.role || req.user.role || 'student';
    const { unreadOnly, limit } = req.query;

    const data = await notificationService.getUserNotifications(userId, role, {
      unreadOnly: unreadOnly === 'true',
      limit: limit ? parseInt(limit, 10) : 40,
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/:id/read
export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.query.role || req.user.role || 'student';

    const updated = await notificationService.markAsRead(id, userId, role);
    if (!updated) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification: updated });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/mark-all-read
export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.body?.role || req.query.role || req.user.role || 'student';

    await notificationService.markAllAsRead(userId, role);
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.query.role || req.user.role || 'student';

    const deleted = await notificationService.deleteNotification(id, userId, role);
    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification dismissed' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notifications/clear-all
export const clearAllReadNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.body?.role || req.query.role || req.user.role || 'student';

    await notificationService.clearAllRead(userId, role);
    res.json({ message: 'All read notifications cleared' });
  } catch (err) {
    next(err);
  }
};

// POST /api/notifications/broadcast (Admin only)
export const broadcastNotification = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only campus placement admins can broadcast notifications' });
    }

    const { targetRole, title, message, type, category, actionTarget } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const notification = await notificationService.broadcastToRole(targetRole || 'all', {
      title,
      message,
      type: type || 'info',
      category: category || 'drive',
      actionTarget: actionTarget || null,
    });

    res.status(201).json({ message: 'Notification broadcasted successfully', notification });
  } catch (err) {
    next(err);
  }
};
