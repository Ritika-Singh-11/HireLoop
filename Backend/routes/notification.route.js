import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import optionalAuth from '../middleware/optionalAuth.middleware.js';
import roleCheck from '../middleware/roleCheck.middleware.js';
import * as ctrl from '../controllers/notification.controller.js';

const router = Router();

// Get notifications for current user and role
router.get('/', optionalAuth, ctrl.getNotifications);

// Bulk operations (must be before /:id)
router.patch('/mark-all-read', optionalAuth, ctrl.markAllNotificationsRead);
router.delete('/clear-all', optionalAuth, ctrl.clearAllReadNotifications);
router.post('/broadcast', auth, roleCheck('admin'), ctrl.broadcastNotification);

// Single notification operations
router.patch('/:id/read', optionalAuth, ctrl.markNotificationRead);
router.delete('/:id', optionalAuth, ctrl.deleteNotification);

export default router;
